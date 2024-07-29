/* eslint-disable react/no-unescaped-entities */
/* eslint-disable consistent-return */
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { DataTable } from "@/components/shared/Table/DataTable";
import { GUARD_DUTY_COLUMNS } from "@/lib/data";
import { Card, CardContent } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { createClient } from "@/lib/supabase/component";
import {
  calculateGDPoints,
  fillMissingAppointment,
  isDatePast
} from "@/lib/utils";
import MainLayout from "@/components/layout/MainLayout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/shared/Breadcrumb";

const ViewGuardDutyPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const supabaseClient = createClient();

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(false);
      if (!id) {
        setLoading(false);
        setError(true);
        return;
      }

      // Fetch guard duty dates
      const { data: guardDutyDates, error: error1 } = await supabaseClient
        .from("guard_duty_dates")
        .select()
        .eq("id", id)
        .single();
      if (error1) {
        setLoading(false);
        setError(true);
        return;
      }

      // Fetch guard duty personnel
      const { data: guardDutyPersonnel, error: error2 } = await supabaseClient
        .from("guard_duty_personnel")
        .select()
        .eq("fk_guard_duty_id", id);
      if (error2) {
        console.error(error2);
        setLoading(false);
        setError(true);
        return;
      }

      // Fetch personnel profiles and create personnel info
      const personnelInfo = await Promise.all(
        guardDutyPersonnel.map(async (oneGDPersonnel) => {
          const { data: personnelProfile, error: error3 } = await supabaseClient
            .from("profiles")
            .select()
            .eq("id", oneGDPersonnel.fk_user_id)
            .single();
          if (error3) {
            console.error(error3);
            setError(true);
            return {
              contact: null,
              platoon: null,
              rank: null,
              name: null,
              appointment: oneGDPersonnel.appointment
            };
          }

          return {
            contact: personnelProfile.contact,
            platoon: personnelProfile.platoon,
            rank: personnelProfile.rank,
            name: personnelProfile.name,
            appointment: oneGDPersonnel.appointment
          };
        })
      );

      // Fill missing appointments with null values for rank and name
      const completePersonnels = fillMissingAppointment(personnelInfo);

      setData({
        location: guardDutyDates.location,
        date: guardDutyDates.date,
        personnels: completePersonnels
      });

      setLoading(false);
    })();
  }, [id]);

  const renderContent = () => {
    if (loading) {
      return (
        <span className="w-full h-full flex justify-center items-center">
          <Loader2 className="h-6 w-6 animate-spin" />
        </span>
      );
    }

    if (error) {
      return (
        <div className="flex w-full flex-col justify-center">
          <p className="font-semibold text-primary">Error</p>
          <h1 className="text-4xl mt-2 font-semibold text-slate-900">
            Something went wrong
          </h1>
          <p className="text-md mt-2 text-slate-600">
            Sorry, the page cannot be found.
          </p>
          <Button
            className="mt-4 w-fit"
            onClick={() => router.push("/dashboard")}
          >
            Take me to Dashboard
          </Button>
        </div>
      );
    }

    return (
      <Card>
        <CardContent>
          <div className="flex justify-between mt-4">
            <span className="flex flex-col gap-2">
              <code className="font-mono text-gray-600 text-xs font-medium">
                <b>Location:</b> {data?.location || "No Data"}
              </code>
              <code className="font-mono text-gray-600 text-xs font-medium">
                <b>Date:</b>{" "}
                {data?.date
                  ? dayjs(data.date).format("MMM DD, YYYY")
                  : "No Data"}
              </code>
              <code className="font-mono text-gray-600 text-xs font-medium">
                <b>Status:</b>{" "}
                {isDatePast(data?.date) ? "Completed" : "Not completed"}
              </code>
              <span className="flex gap-x-1">
                <code className="font-mono text-gray-600 text-xs font-medium">
                  <b>Potential Duty Points:</b>{" "}
                  {data?.date && calculateGDPoints(data.date)}
                </code>
                <Image
                  style={{ objectFit: "contain" }}
                  src="/assets/coin.png"
                  alt="logo"
                  width={15}
                  height={15}
                />
              </span>
            </span>
            <Button
              onClick={() => router.push(`/dashboard/editGuardDuty/${id}`)}
            >
              Edit
            </Button>
          </div>

          <DataTable
            className="mt-4"
            columns={GUARD_DUTY_COLUMNS}
            data={data?.personnels || []}
          />
        </CardContent>
      </Card>
    );
  };

  return (
    <MainLayout title="View Guard Duty - Badger HQ">
      <div className="mx-auto h-full w-full max-w-screen-xl px-6 sm:px-16 mb-16">
        {/* TOP */}
        <span className="flex flex-col mb-4">
          <h2 className="font-semibold text-lg mb-4">Guard Duty</h2>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>View Guard Duty</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </span>
        {/* LIST */}
        <div className="flex flex-col gap-y-4">{renderContent()}</div>
      </div>
    </MainLayout>
  );
};

export default ViewGuardDutyPage;
