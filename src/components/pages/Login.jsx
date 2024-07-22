import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/shared/Form";
import { Input } from "@/components/shared/Input";
import { useToast } from "@/components/shared/Toast/use-toast";
import { ToastAction } from "@/components/shared/Toast";
import { Button } from "@/components/shared/Button";
import MainLayout from "@/components/layout/MainLayout";
import { createClient } from "@/lib/supabase/component";
import AuthContext from "@/lib/context/AuthContext";

const loginFormSchema = z.object({
  email: z.string().email().min(1),
  password: z.string().min(1)
});
const LoginPage = () => {
  const { toast } = useToast();
  const supabaseClient = createClient();
  const { user } = useContext(AuthContext);
  const loginForm = useForm({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: ""
    },
    mode: "onBlur"
  });
  const router = useRouter();
  const [smh, setSmh] = useState(false); // flag to trigger form shaking animation

  const onSubmit = async ({ email, password }) => {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      setSmh(true);
      toast({
        variant: "destructive",
        title: "Invalid username or password",
        description: "Please check your credentials and try again"
      });
      return;
    }
    toast({
      title: "Login success",
      description: "Please do not abuse the system!"
    });
    router.replace("/dashboard");
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

  if (user) {
    return (
      <MainLayout title="Login" className="flex justify-center items-center">
        <p className="font-semibold text-md">You are already logged in!</p>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Login - Badger HQ">
      <div className="smh-container flex justify-center px-6 lg:px-24 py-16">
        <div
          className={`smh-card${
            smh ? "--animate" : ""
          } flex flex-col w-[380px] gap-3`}
          onAnimationEnd={() => setSmh(false)}
        >
          <span className="flex flex-col items-center gap-2 font-semibold">
            <Image
              style={{ objectFit: "contain" }}
              src="/assets/charlie_avatar.png"
              alt="logo"
              width={50}
              height={50}
            />
            <p className="text-lg">Badger HQ</p>
          </span>
          <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(onSubmit, onError)}>
              <div className="flex flex-col gap-2">
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Password"
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
                    loginForm.formState.isSubmitting ||
                    !loginForm.formState.isDirty ||
                    !loginForm.formState.isValid
                  }
                  loading={loginForm.formState.isSubmitting}
                >
                  Login
                </Button>
                <p className="text-gray-400 text-sm text-center mt-2">
                  By invite only.
                </p>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </MainLayout>
  );
};

export default LoginPage;
