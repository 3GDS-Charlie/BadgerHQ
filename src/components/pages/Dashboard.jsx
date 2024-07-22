import React, { useContext } from "react";
import { useRouter } from "next/router";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/shared/Button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/shared/Tabs";
import AuthContext from "@/lib/context/AuthContext";
import GuardDuty from "../dashboard/GuardDuty";

const DashboardPage = () => {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  return (
    <MainLayout title="Dashboard - Badger HQ">
      <div className="m-auto h-full w-full max-w-screen-xl px-6 sm:px-16 mb-16">
        <h1 className="font-bold text-2xl">Dashboard</h1>
        <Tabs defaultValue="overview" className="mt-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="paradeState">Parade State</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="conductTracking">Conduct Tracking</TabsTrigger>
            <TabsTrigger value="guardDuty">Guard Duty</TabsTrigger>
            <TabsTrigger value="commanderDuty">Commmander Duty</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <p>this is empty for now.</p>
          </TabsContent>
          <TabsContent value="paradeState"></TabsContent>
          <TabsContent value="resources"></TabsContent>
          <TabsContent value="conductTracking"></TabsContent>
          <TabsContent value="guardDuty">
            <GuardDuty />
          </TabsContent>
          <TabsContent value="commanderDuty"></TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default DashboardPage;
