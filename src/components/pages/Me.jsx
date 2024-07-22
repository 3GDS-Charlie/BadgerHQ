/* eslint-disable no-restricted-globals */
import React, { useContext } from "react";
import MainLayout from "@/components/layout/MainLayout";
import AuthContext from "@/lib/context/AuthContext";
import { Input } from "../shared/Input";
import { Label } from "../shared/Label";
import { Separator } from "../shared/Separator";

const MeFormFields = ({ label, value, className }) => (
  <div className={`gap-y-1 ${className}`}>
    <Label>{label}</Label>
    <Input placeholder="Name" disabled value={value} />
  </div>
);
const Me = () => {
  const { profile } = useContext(AuthContext);

  return (
    <MainLayout title="Me - Badger HQ">
      <div className="m-auto h-full w-full max-w-screen-md mt-8 px-6 sm:px-16 mb-16">
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
          <MeFormFields
            label="HA Status"
            value={"HA Build up" || "Not available"}
          />
          <MeFormFields
            label="Current Work Year Best IPPT"
            value={"Guards Gold - 90" || "Not available"}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default Me;
