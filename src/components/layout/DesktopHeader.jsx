import React, { useContext } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { User } from "lucide-react";
import { isEq } from "@/lib/utils";
import { Button } from "@/components/shared/Button";
import { useToast } from "@/components/shared/Toast/use-toast";
import AuthContext from "@/lib/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  Dropd
} from "@/components/shared/DropdownMenu";
import { ToastAction } from "../shared/Toast";
import { createClient } from "@/lib/supabase/component";

const DesktopHeader = () => {
  const { toast } = useToast();
  const router = useRouter();
  const isActiveLink = (href) => isEq(router.pathname, href);
  const { user, profile } = useContext(AuthContext);
  const supabaseClient = createClient();

  const handleLogout = async () => {
    const { error } = await supabaseClient.auth.signOut();
    console.log(error);
    if (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        action: <ToastAction altText="Try again">Try again</ToastAction>
      });
      return;
    }
    toast({
      title: "Logout success",
      description: "See you again!"
    });
    router.replace("/");
  };

  return (
    <nav className="hidden w-full h-full justify-between items-center md:flex">
      <span className="flex gap-x-6">
        <Link
          className={`text-slate-950 ${isActiveLink("/faq") ? "" : "opacity-60"} hover:underline hover:opacity-80 text-sm`}
          href="/faq"
        >
          Dashboard
        </Link>
        <Link
          className={`text-slate-950 ${isActiveLink("/faq") ? "" : "opacity-60"} hover:underline hover:opacity-80 text-sm`}
          href="/faq"
        >
          Resources
        </Link>
      </span>
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <User className="hover:bg-gray-100 p-2 cursor-pointer h-10 w-10 rounded-full text-gray-400" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none text-gray-600">
                  {profile?.rank} {profile?.name}
                </p>
                <p className="text-xs leading-none text-gray-400">
                  {profile?.platoon}{" "}
                  {profile?.section && `Section ${profile.section}`}{" "}
                  {profile?.appointment}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={handleLogout}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        router.pathname !== "/login" && (
          <Button
            className="hidden md:flex"
            onClick={() => router.push("/login")}
          >
            Login
          </Button>
        )
      )}
    </nav>
  );
};

export default DesktopHeader;
