/* eslint-disable consistent-return */
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Loader2 } from "lucide-react";
import { MONTHS, YEARS } from "@/lib/data";
import { Combobox } from "@/components/shared/Combobox";
import { createClient } from "@/lib/supabase/component";
import { Separator } from "@/components/shared/Separator";
import { Button } from "@/components/shared/Button";
import { Card, CardContent } from "@/components/shared/Card";
import { isDatePast } from "@/lib/utils";

const GDGenerated = () => {
  const [month, setMonth] = useState(MONTHS[dayjs().month()].value || "");
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(dayjs().year().toString());
  const [data, setData] = useState([]);
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
        .gte("date", startOfMonth)
        .lt("date", endOfMonth);

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

  const generateDPListFn = () => {};

  return (
    <div className="w-full flex flex-col pl-4 items-left">
      <h1 className="text-md font-semibold">Generate list from guard duty</h1>
      <span className="space-x-2 mt-2">
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
      <Separator className="my-4" />
      <div className="w-full flex flex-col gap-y-4">
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
                <Button onClick={generateDPListFn}>Add</Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default GDGenerated;
