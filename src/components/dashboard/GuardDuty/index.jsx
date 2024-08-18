/* eslint-disable consistent-return */
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/router";
import { Combobox } from "@/components/shared/Combobox";
import { MONTHS, YEARS } from "@/lib/data";
import { Card, CardContent } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { createClient } from "@/lib/supabase/component";
import { isDatePast } from "@/lib/utils";

const GuardDuty = () => {
  const [data, setData] = useState([]);
  const [month, setMonth] = useState(MONTHS[dayjs().month()].value || "");
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(dayjs().year().toString());
  const supabaseClient = createClient();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      if (year === "" || month === "") return;
      setLoading(true);
      const startOfMonth = dayjs(`${year}-${month}`)
        .startOf("month")
        .format("YYYY-MM-DD");
      const endOfMonth = dayjs(startOfMonth)
        .endOf("month")
        .add(1, "day")
        .format("YYYY-MM-DD");
      const { data: guardDutyDates, error: error1 } = await supabaseClient
        .from("guard_duty_dates")
        .select()
        .gte("created_at", startOfMonth)
        .lt("created_at", endOfMonth);

      if (error1) {
        console.error(error1);
        return;
      }

      const guardDutyInfo = await Promise.all(
        guardDutyDates.map(async (oneGuardDutyDate) => {
          const { data: guardDutyPersonnel, error: error2 } =
            await supabaseClient
              .from("guard_duty_personnel")
              .select()
              .eq("fk_guard_duty_id", oneGuardDutyDate.id);

          if (error2) {
            console.error(error2);
            return;
          }
          const personnelCount = guardDutyPersonnel.length;
          return {
            id: oneGuardDutyDate.id,
            location: oneGuardDutyDate.location,
            date: oneGuardDutyDate.date,
            personnelCount
          };
        })
      );
      setData(guardDutyInfo);
      setLoading(false);
    })();
  }, [month, year]);
  return (
    <div className="flex flex-col mt-4">
      {/* TOP */}
      <span className="flex justify-between space-x-4 items-center mb-4">
        <h2 className="font-semibold text-lg mb-4">Guard Duty</h2>
        <span className="flex gap-x-4">
          <Combobox
            value={year}
            setValue={setYear}
            data={YEARS}
            placeholder="Search year"
          />
          <Combobox
            value={month}
            setValue={setMonth}
            data={MONTHS}
            placeholder="Search month"
          />
        </span>
      </span>
      {/* LIST */}
      <div className="flex flex-col gap-y-4">
        {loading ? (
          <span className="w-full h-full flex justify-center items-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </span>
        ) : (
          data.map((oneData, index) => (
            <Card key={index}>
              <CardContent className="flex items-center justify-between">
                <span className="flex flex-col gap-2 mt-6">
                  <code className="font-mono text-gray-600 text-xs font-medium">
                    <b>Location:</b> {oneData?.location || "No Data"}
                  </code>
                  <code className="font-mono text-gray-600 text-xs font-medium">
                    <b>Date:</b>{" "}
                    {oneData?.date
                      ? dayjs(oneData.date).format("MMM DD, YYYY")
                      : "No Data"}
                  </code>
                  <code className="font-mono text-gray-600 text-xs font-medium">
                    <b>Status:</b>{" "}
                    {isDatePast(oneData.date) ? "Completed" : "Not completed"}
                  </code>
                  <code className="font-mono text-gray-600 text-xs font-medium">
                    <b>Personnel Count:</b>{" "}
                    {oneData.personnelCount || "No Data"}
                  </code>
                </span>
                <Button
                  onClick={() =>
                    router.push(`/dashboard/viewGuardDuty/${oneData.id}`)
                  }
                >
                  View more
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default GuardDuty;
