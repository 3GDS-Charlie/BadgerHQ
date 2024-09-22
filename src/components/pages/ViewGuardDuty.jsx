/* eslint-disable react/no-unescaped-entities */
/* eslint-disable consistent-return */
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import { Link as LinkIcon, Loader2, Pencil } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { DataTable } from "@/components/shared/Table/DataTable";
import { CORE_GROUP_EMAILS, GUARD_DUTY_COLUMNS } from "@/lib/data";
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
import AuthContext from "@/lib/context/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/shared/Dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/shared/Form";
import { ToastAction } from "../shared/Toast";
import { useToast } from "../shared/Toast/use-toast";
import { Input } from "../shared/Input";

const updateLinkFormSchema = z.object({
  link: z.string().url()
});

const ViewGuardDutyPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const supabaseClient = createClient();
  const { profile } = useContext(AuthContext);
  const updateLinkForm = useForm({
    resolver: zodResolver(updateLinkFormSchema),
    defaultValues: {
      link: ""
    },
    mode: "onBlur"
  });
  const [refreshFlag, setRefreshFlag] = useState(false);
  const { toast } = useToast();

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

      // Fill missing appointments with null values for rank and name
      const completePersonnels = fillMissingAppointment(personnelInfo);

      setData({
        location: guardDutyDates.location,
        date: guardDutyDates.date,
        chatLink: guardDutyDates.group_chat_link,
        personnels: completePersonnels
      });

      setLoading(false);
    })();
  }, [id, refreshFlag]);

  useEffect(() => {
    if (updateLinkForm.formState.isSubmitSuccessful) {
      updateLinkForm.reset({
        link: data.chatLink
      });
    }
  }, [updateLinkForm.formState, data]);

  const onSubmit = async ({ link }) => {
    const { data: updateData, error: updateError } = await supabaseClient
      .from("guard_duty_dates")
      .update({ group_chat_link: link })
      .eq("id", id);

    if (updateError) {
      console.error;
      toast({
        variant: "destructive",
        title: "Invalid link",
        description: "Please check the input and try again"
      });
      return;
    }
    toast({
      title: "Update success",
      description: "Please do not abuse the system!"
    });
    setRefreshFlag((curr) => !curr);
  };

  const onError = (error) => {
    console.log(error);
    toast({
      variant: "destructive",
      title: "Uh oh! Something went wrong.",
      description: "There was a problem with your request.",
      action: <ToastAction altText="Try again">Try again</ToastAction>
    });
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
                  <b>{!isDatePast(data?.date) && "Potential"} Duty Points:</b>{" "}
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
              <code className="font-mono text-gray-600 text-xs font-medium">
                <b>Chat link:</b>{" "}
                {data?.chatLink ? (
                  <Link
                    className="text-sky-500 font-medium hover:opacity-60 underline"
                    href={data?.chatLink}
                  >
                    {data.chatLink}
                  </Link>
                ) : (
                  "Not available"
                )}
              </code>
            </span>
            <span className="flex flex-col items-end">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="secondary">
                    <LinkIcon className="w-4 h-4 mr-2" />
                    Update Link
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Update chat link</DialogTitle>
                    <Form {...updateLinkForm}>
                      <form
                        onSubmit={updateLinkForm.handleSubmit(
                          onSubmit,
                          onError
                        )}
                      >
                        <div className="flex flex-col gap-2">
                          <FormField
                            control={updateLinkForm.control}
                            name="link"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Chat Link</FormLabel>
                                <FormControl>
                                  <Input
                                    type="url"
                                    placeholder="Chat Link"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="flex mt-8 gap-y-2 flex-col">
                          <Button
                            type="submit"
                            disabled={
                              updateLinkForm.formState.isSubmitting ||
                              !updateLinkForm.formState.isDirty ||
                              !updateLinkForm.formState.isValid
                            }
                            loading={updateLinkForm.formState.isSubmitting}
                          >
                            Update
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
              {profile && CORE_GROUP_EMAILS.includes(profile.email) && (
                <Button
                  onClick={() => router.push(`/dashboard/editGuardDuty/${id}`)}
                  className="mt-2 w-fit"
                >
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              )}
            </span>
          </div>

          <DataTable
            className="mt-4"
            columns={GUARD_DUTY_COLUMNS}
            data={data?.personnels || []}
            meta={{
              location: data.location,
              date: data.date,
              id,
              chatLink: data.chatLink
            }}
            downloadable
            copyable
            csvFileName={`charlie_guard_duty_on_${dayjs(data.date).format("DDMMYYYY")}_d_${dayjs().format("DDMMYYYY")}`}
          />
        </CardContent>
      </Card>
    );
  };

  // this is needed to tell form to update the isValid for some reason
  const placeholder = updateLinkForm.formState.isValid;

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
                <BreadcrumbLink href="/dashboard?tab=guardDuty">
                  Guard Duty
                </BreadcrumbLink>
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
