/* eslint-disable no-await-in-loop */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable consistent-return */
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { DataTable } from "@/components/shared/Table/DataTable";
import { EDITABLE_GUARD_DUTY_COLUMNS } from "@/lib/data";
import { Card, CardContent } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { useToast } from "@/components/shared/Toast/use-toast";
import { createClient } from "@/lib/supabase/component";
import {
  calculateGDPoints,
  convertPersonnelArrayToObject,
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
import { ToastAction } from "../shared/Toast";

const EditGuardDutyPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { id } = router.query;
  const [data, setData] = useState([]);
  const [allPersonnels, setAllPersonnels] = useState([]);
  const [originalGDPersonnel, setOriginalGDPersonnel] = useState([]);
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
        console.error(error1);
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
              id: null,
              rank: null,
              name: null,
              appointment: oneGDPersonnel.appointment
            };
          }

          return {
            id: personnelProfile.id,
            rank: personnelProfile.rank,
            name: personnelProfile.name,
            appointment: oneGDPersonnel.appointment
          };
        })
      );
      setOriginalGDPersonnel(personnelInfo);

      // Fill missing appointments with null values for rank and name
      const completePersonnels = fillMissingAppointment(personnelInfo);

      setData({
        location: guardDutyDates.location,
        date: guardDutyDates.date,
        personnels: completePersonnels
      });

      const { data: allPersonnelProfile, error: error4 } = await supabaseClient
        .from("profiles")
        .select();
      if (error4) {
        console.error(error4);
        setError(true);
      }
      setAllPersonnels(allPersonnelProfile);
      setLoading(false);
    })();
  }, [id]);

  const handleSubmit = async () => {
    const personnelToBeInserted = [];
    const personnelToBeUpdated = [];
    const personnelToBeDeleted = [];
    const originalPersonnelObj =
      convertPersonnelArrayToObject(originalGDPersonnel);
    let gotError = false;

    // Step 1: Retrieve existing personnel for the current guard duty
    let existingPersonnel = [];
    try {
      const { data, error } = await supabaseClient
        .from("guard_duty_personnel")
        .select("id, appointment, fk_user_id")
        .eq("fk_guard_duty_id", id);

      if (error) {
        throw error;
      }
      existingPersonnel = data;
    } catch (error) {
      console.error("Error fetching existing personnel:", error);
      gotError = true;
      return;
    }

    // Convert existing personnel to an object for easy lookup
    const existingPersonnelObj = {};
    existingPersonnel.forEach((person) => {
      existingPersonnelObj[person.appointment] = person;
    });

    // Step 2: Determine changes
    await Promise.all(
      data.personnels.map(async (onePersonnel) => {
        const existingPersonnel =
          existingPersonnelObj[onePersonnel.appointment];
        // Records to be updated
        if (existingPersonnel) {
          if (
            onePersonnel.id !== null &&
            existingPersonnel.fk_user_id !== onePersonnel.id
          ) {
            personnelToBeUpdated.push({
              id: existingPersonnel.id, // Use existing GD personnel table ID for update
              fk_user_id: onePersonnel.id
            });
          }
        } else if (onePersonnel.id !== null) {
          // New records to be inserted
          personnelToBeInserted.push({
            fk_user_id: onePersonnel.id,
            appointment: onePersonnel.appointment,
            fk_guard_duty_id: id
          });
        }

        if (onePersonnel.id === null && existingPersonnel) {
          personnelToBeDeleted.push({
            id: existingPersonnel.id // refers to gd_personnel table id
          });
        }
      })
    );
    // Insert new personnel
    if (personnelToBeInserted.length > 0) {
      const { data: insertData, error: insertError } = await supabaseClient
        .from("guard_duty_personnel")
        .insert(personnelToBeInserted);

      if (insertError) {
        console.error("Error inserting data:", insertError);
        gotError = true;
      } else {
        console.log("Inserted data:", insertData);
      }
    }

    // Update existing personnel
    if (personnelToBeUpdated.length > 0) {
      // eslint-disable-next-line no-restricted-syntax
      for (const personnel of personnelToBeUpdated) {
        const { data: updateData, error: updateError } = await supabaseClient
          .from("guard_duty_personnel")
          .update({ fk_user_id: personnel.fk_user_id })
          .eq("id", personnel.id);

        if (updateError) {
          console.error("Error updating data:", updateError);
          gotError = true;
        } else {
          console.log("Updated data:", updateData);
        }
      }
    }

    // Delete personnel
    if (personnelToBeDeleted.length > 0) {
      const deletePromises = personnelToBeDeleted.map((personnel) =>
        supabaseClient
          .from("guard_duty_personnel")
          .delete()
          .eq("id", personnel.id)
      );

      const deleteResults = await Promise.all(deletePromises);
      deleteResults.forEach(({ data, error }, index) => {
        if (error) {
          console.error(`Error deleting data for item ${index}:`, error);
          gotError = true;
        } else {
          console.log(`Deleted data for item ${index}:`, data);
        }
      });
    }

    if (gotError) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          "There was a problem with your request. Please contact the administrator.",
        action: <ToastAction altText="Try again">Try again</ToastAction>
      });
      return;
    }
    toast({
      title: "Success!",
      description: "Guard duty modified"
    });
    router.replace(`/dashboard/viewGuardDuty/${id}`);
  };

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
            <Button onClick={() => handleSubmit()}>Save</Button>
          </div>

          <DataTable
            className="mt-4"
            columns={EDITABLE_GUARD_DUTY_COLUMNS}
            data={data?.personnels || []}
            setData={setData}
            allPersonnels={allPersonnels}
            state={{
              columnVisibility: {
                id: false
              }
            }}
          />
        </CardContent>
      </Card>
    );
  };

  return (
    <MainLayout title="Edit Guard Duty - Badger HQ">
      <div className="mx-auto h-full w-full max-w-screen-xl px-6 sm:px-16 mb-16">
        {/* TOP */}
        <span className="flex flex-col mb-4">
          <h2 className="font-semibold text-lg mb-4">Edit Guard Duty</h2>
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
                <BreadcrumbPage>Edit Guard Duty</BreadcrumbPage>
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

export default EditGuardDutyPage;
