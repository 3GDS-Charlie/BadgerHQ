import React, { useContext } from "react";
import { useRouter } from "next/router";
import MainLayout from "@/components/layout/MainLayout";
import WordFadeIn from "@/components/magicui/word-fade-in";
import { Button } from "@/components/shared/Button";
import AuthContext from "@/lib/context/AuthContext";

const HomePage = () => {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  return (
    <MainLayout className="flex items-center justify-center">
      <div className="mx-auto text-center h-full w-full max-w-screen-xl px-6 sm:px-16 mb-16">
        <WordFadeIn
          className="mx-auto my-10 w-full max-w-[700px]"
          words="Strong alone, Stronger Together!"
        />
        <p className="text-slate-500 text-md font-medium">
          Charlie Administrative Matters
        </p>
        {user ? (
          <Button className="mt-4" onClick={() => router.push("/dashboard")}>
            Go to Dashboard
          </Button>
        ) : (
          <Button className="mt-4" onClick={() => router.push("/login")}>
            Login
          </Button>
        )}
      </div>
    </MainLayout>
  );
};

export default HomePage;
