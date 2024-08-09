/* eslint-disable no-restricted-globals */
import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Loader2 } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import AuthContext from "@/lib/context/AuthContext";
import { Input } from "@/components/shared/Input";
import { Label } from "@/components/shared/Label";
import { Separator } from "@/components/shared/Separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/shared/Breadcrumb";
import { createClient } from "@/lib/supabase/component";
import { Button } from "@/components/shared/Button";

const ViewProfileFormFields = ({ label, value, className }) => (
  <div className={`gap-y-1 ${className}`}>
    <Label>{label}</Label>
    <Input placeholder="Name" disabled value={value} />
  </div>
);
const ViewProfilePage = () => {
  const { profile } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabaseClient = createClient();
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(false);
      if (!id) {
        setLoading(false);
        setError(true);
        return;
      }

      const { data: personnelInfo, error } = await supabaseClient
        .from("profiles")
        .select()
        .eq("id", id)
        .single();
      if (error) {
        console.error(error);
        setLoading(false);
        setError(true);
        return;
      }
      setLoading(false);
      setError(false);
      setData(personnelInfo);
    })();
  }, [id]);

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
    <MainLayout title="View Profile - Badger HQ">
      <div className="m-auto h-full w-full max-w-screen-md mt-8 px-6 sm:px-16 mb-16">
        {/* TOP */}
        <span className="flex flex-col mb-4">
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
                <BreadcrumbLink href="/dashboard?tab=nominalRoll">
                  Nominal Roll
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Profile Information</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </span>
        <div className="gap-y-4 flex flex-col">
          <div>
            <h1 className="font-bold text-2xl">Profile Information</h1>
          </div>
          <span className="flex gap-x-2">
            <ViewProfileFormFields
              label="Rank"
              value={data?.rank || "Not available"}
              className="flex-grow-1"
            />
            <ViewProfileFormFields
              label="Name"
              value={data?.name || "Not available"}
              className="flex-grow-3 w-full"
            />
          </span>
          <ViewProfileFormFields
            label="Appointment"
            value={data?.appointment || "Not available"}
          />
          <ViewProfileFormFields
            label="Email"
            value={data?.email || "Not available"}
          />
          <span className="flex gap-x-2">
            <ViewProfileFormFields
              label="Platoon"
              value={data?.platoon || "Not available"}
              className="flex-grow-1"
            />
            <ViewProfileFormFields
              label="Section"
              value={data?.section || "Not available"}
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
          <ViewProfileFormFields
            label="Duty Points"
            value={
              isNaN(data?.dutyPoints) || data?.dutyPoints === null
                ? "Not available"
                : data?.dutyPoints
            }
          />
          <ViewProfileFormFields
            label="Ration Type"
            value={data?.ration || "Not available"}
          />
          <ViewProfileFormFields
            label="Shirt Size"
            value={data?.shirtSize || "Not available"}
          />
          <ViewProfileFormFields
            label="Pants Size"
            value={data?.pantsSize || "Not available"}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default ViewProfilePage;
