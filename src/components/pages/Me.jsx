/* eslint-disable no-restricted-globals */
import React, { useContext, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import AuthContext from "@/lib/context/AuthContext";
import { Input } from "@/components/shared/Input";
import { Label } from "@/components/shared/Label";
import { Separator } from "@/components/shared/Separator";
import { DataTable } from "@/components/shared/Table/DataTable";
import { DUTY_POINTS_TRANSACTIONS_COLUMNS } from "@/lib/data";
import { createClient } from "@/lib/supabase/component";
import { Button } from "@/components/shared/Button";

const MeFormFields = ({ label, value, className }) => (
  <div className={`gap-y-1 ${className}`}>
    <Label>{label}</Label>
    <Input placeholder="Name" disabled value={value} />
  </div>
);
const Me = () => {
  const { profile } = useContext(AuthContext);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dutyPointsData, setDutyPointsData] = useState([]);
  const supabaseClient = createClient();
  const id = profile?.id;

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(false);
      if (!id) {
        setLoading(false);
        setError(true);
        return;
      }

      const { data: dataPointsTransactions, error } = await supabaseClient
        .from("duty_points_transaction_records")
        .select()
        .eq("fk_user_id", id)
        .order("created_at", { ascending: false });
      if (error) {
        console.error(error);
        setLoading(false);
        setError(true);
        return;
      }
      setLoading(false);
      setError(false);
      setDutyPointsData(dataPointsTransactions);
    })();
  }, [profile]);

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
    <MainLayout title="Me - Badger HQ">
      <div className="m-auto h-full w-full max-w-screen-lg mt-8 px-6 sm:px-16 mb-16">
        <div className="gap-y-4 flex flex-col">
          <div>
            <h1 className="font-bold text-2xl">Account Information</h1>
            <p className="text-sm text-slate-500">
              The following information can only be edited by Coy HQ. Please
              approach Coy HQ if you need to change something here.
            </p>
          </div>
          <span className="flex gap-x-2">
            <MeFormFields
              label="Rank"
              value={profile?.rank || "Not available"}
              className="flex-grow-1"
            />
            <MeFormFields
              label="Name"
              value={profile?.name || "Not available"}
              className="flex-grow-3 w-full"
            />
          </span>
          <MeFormFields
            label="Appointment"
            value={profile?.appointment || "Not available"}
          />
          <MeFormFields
            label="Email"
            value={profile?.email || "Not available"}
          />
          <span className="flex gap-x-2">
            <MeFormFields
              label="Platoon"
              value={profile?.platoon || "Not available"}
              className="flex-grow-1"
            />
            <MeFormFields
              label="Section"
              value={profile?.section || "Not available"}
              className="flex-grow-3 w-full"
            />
          </span>
        </div>
        <Separator className="my-8" />
        <div className="gap-y-4 flex flex-col">
          <div>
            <h1 className="font-bold text-xl">Other Info</h1>
            {/* <p className="text-sm text-slate-500"></p> */}
          </div>
          <MeFormFields
            label="Duty Points"
            value={
              isNaN(profile?.dutyPoints) || profile?.dutyPoints === null
                ? "Not available"
                : profile?.dutyPoints
            }
          />
          <MeFormFields
            label="Ration Type"
            value={profile?.ration || "Not available"}
          />
          <MeFormFields
            label="Shirt Size"
            value={profile?.shirtSize || "Not available"}
          />
          <MeFormFields
            label="Pants Size"
            value={profile?.pantsSize || "Not available"}
          />
        </div>
        <Separator className="my-8" />
        {/* Duty points history */}
        <div>
          <h2 className="font-bold text-xl">Duty Points Transactions</h2>
          <DataTable
            className="mt-4"
            columns={DUTY_POINTS_TRANSACTIONS_COLUMNS}
            data={dutyPointsData || []}
            setData={setDutyPointsData}
            state={{
              columnVisibility: {
                name: false,
                rank: false
              }
            }}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default Me;
