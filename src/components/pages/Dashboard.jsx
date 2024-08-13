import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/shared/Tabs";
import AuthContext from "@/lib/context/AuthContext";
import GuardDuty from "../dashboard/GuardDuty";
import NominalRoll from "../dashboard/NominalRoll";
import ManageDutyPoints from "../dashboard/ManageDutyPoints";

const DashboardPage = () => {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const searchParams = useSearchParams();
  const searchParamsObj = Object.fromEntries(searchParams);
  const { tab: currentTab } = searchParamsObj;

  return (
    <MainLayout title="Dashboard - Badger HQ">
      <div className="m-auto h-full w-full max-w-screen-xl px-6 sm:px-16 mb-16">
        <h1 className="font-bold text-2xl">Dashboard</h1>
        <Tabs value={currentTab || "overview"} className="mt-4">
          <TabsList>
            <TabsTrigger
              onClick={() =>
                router.replace({
                  query: { ...router.query, tab: "overview" }
                })
              }
              value="overview"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              onClick={() =>
                router.replace({
                  query: { ...router.query, tab: "guardDuty" }
                })
              }
              value="guardDuty"
            >
              Guard Duty
            </TabsTrigger>
            <TabsTrigger
              onClick={() =>
                router.replace({
                  query: { ...router.query, tab: "nominalRoll" }
                })
              }
              value="nominalRoll"
            >
              Nominal Roll
            </TabsTrigger>
            <TabsTrigger
              onClick={() =>
                router.replace({
                  query: { ...router.query, tab: "manageDutyPoints" }
                })
              }
              value="manageDutyPoints"
            >
              Manage Duty points
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <p>this is empty for now.</p>
          </TabsContent>
          <TabsContent value="guardDuty">
            <GuardDuty />
          </TabsContent>
          <TabsContent value="nominalRoll">
            <NominalRoll />
          </TabsContent>
          <TabsContent value="manageDutyPoints">
            <ManageDutyPoints />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default DashboardPage;
