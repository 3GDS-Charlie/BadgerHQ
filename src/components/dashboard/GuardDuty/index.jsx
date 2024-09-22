/* eslint-disable consistent-return */
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { Copy, Loader2 } from "lucide-react";
import Link from "next/link";
import { Combobox } from "@/components/shared/Combobox";
import { CLIPBOARD_TEMPLATE_GD_SINGLE, MONTHS, YEARS } from "@/lib/data";
import { Card, CardContent } from "@/components/shared/Card";
import { Button, buttonVariants } from "@/components/shared/Button";
import { createClient } from "@/lib/supabase/component";
import {
  cn,
  copyToClipboard,
  fillMissingAppointment,
  isDatePast
} from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/shared/Tooltip";
import { useToast } from "@/components/shared/Toast/use-toast";

const GuardDuty = () => {
  const [data, setData] = useState([]);
  const [month, setMonth] = useState(MONTHS[dayjs().month()].value || "");
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(dayjs().year().toString());
  const supabaseClient = createClient();
  const { toast } = useToast();

  // Mapping month names to numeric values
  const monthNameToNumber = {
    january: "01",
    february: "02",
    march: "03",
    april: "04",
    may: "05",
    june: "06",
    july: "07",
    august: "08",
    september: "09",
    october: "10",
    november: "11",
    december: "12"
  };

  const generateClipboard = () => {
    const clipboard = `
      *${dayjs().format("MMM").toUpperCase()} Guard Duties*
      ---------------------------
      ${
        data.length > 0
          ? data.map((oneGD) => {
              const formattedPersonnels = oneGD?.personnels
                .map((onePersonnel) =>
                  !onePersonnel.name
                    ? `- EMPTY (${onePersonnel.appointment})`
                    : `- ${onePersonnel.rank} ${onePersonnel.name} (${onePersonnel.appointment}) - ${onePersonnel.contact}`
                )
                .join("\n");
              return CLIPBOARD_TEMPLATE_GD_SINGLE(
                oneGD.date,
                oneGD.location,
                formattedPersonnels,
                oneGD.id,
                false // include tagline
              );
            })
          : `No guard duty for this month.`
      }
      Powered by Badger HQ
    `
      .split("\n")
      .map((line) => line.trim())
      .join("\n");

    copyToClipboard(clipboard);

    toast({
      title: "Success!",
      description: "Copied to clipboard"
    });

    return clipboard;
  };

  useEffect(() => {
    (async () => {
      if (year === "" || month === "") return;
      setLoading(true);

      // Convert month name to two-digit month number
      const numericMonth = monthNameToNumber[month.toLowerCase()];

      const startOfMonth = dayjs(`${year}-${numericMonth}`)
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

          const personnelInfo = await Promise.all(
            guardDutyPersonnel.map(async (oneGDPersonnel) => {
              const { data: personnelProfile, error: error3 } =
                await supabaseClient
                  .from("profiles")
                  .select()
                  .eq("id", oneGDPersonnel.fk_user_id)
                  .single();
              if (error3) {
                console.error(error3);
                setError(true);
                return {
                  id: null,
                  contact: null,
                  platoon: null,
                  rank: null,
                  name: null,
                  dutyPoints: null,
                  signExtra: null,
                  appointment: oneGDPersonnel.appointment
                };
              }
              return {
                id: personnelProfile.id,
                contact: personnelProfile.contact,
                platoon: personnelProfile.platoon,
                rank: personnelProfile.rank,
                name: personnelProfile.name,
                dutyPoints: personnelProfile.duty_points,
                signExtra: oneGDPersonnel.sign_extra,
                appointment: oneGDPersonnel.appointment
              };
            })
          );

          const completePersonnels = fillMissingAppointment(personnelInfo);

          const personnelCount = guardDutyPersonnel.length;
          return {
            id: oneGuardDutyDate.id,
            location: oneGuardDutyDate.location,
            date: oneGuardDutyDate.date,
            personnelCount,
            personnels: completePersonnels
          };
        })
      );
      setData(guardDutyInfo);
      setLoading(false);
    })();
  }, [month, year]);

  const displayData = () => {
    if (!data.length) return <p className="text-sm">No data.</p>;
    return data.map((oneData, index) => (
      <Card key={index}>
        <CardContent className="flex items-center justify-between pt-6">
          <span className="flex flex-col gap-2">
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
              <b>Personnel Count:</b> {oneData.personnelCount || "No Data"}
            </code>
          </span>
          <Link
            className={cn(buttonVariants({ variant: "default" }))}
            href={`/dashboard/viewGuardDuty/${oneData.id}`}
          >
            View more
          </Link>
        </CardContent>
      </Card>
    ));
  };

  return (
    <div className="flex flex-col mt-4">
      {/* TOP */}
      <span className="flex flex-col md:flex-row justify-between md:space-x-4 mb-4">
        <span className="flex flex-col">
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
        <Tooltip>
          <TooltipTrigger className="text-left mt-4 sm:mt-0" asChild>
            <Button
              variant="secondary"
              disabled={data.length === 0}
              onClick={generateClipboard}
              className="w-fit"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy as Text
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-sm">
              Copy to clipboard in whatsapp/tele friendly format
            </p>
          </TooltipContent>
        </Tooltip>
      </span>
      {/* LIST */}
      <div className="flex flex-col gap-y-4">
        {loading ? (
          <span className="w-full h-full flex justify-center items-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </span>
        ) : (
          displayData()
        )}
      </div>
    </div>
  );
};

export default GuardDuty;
