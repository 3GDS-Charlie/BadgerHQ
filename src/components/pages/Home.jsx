import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import WordFadeIn from "@/components/magicui/word-fade-in";
import { Button } from "@/components/shared/Button";

const Home = () => {
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
        <Button className="mt-4">Login</Button>
      </div>
    </MainLayout>
  );
};

export default Home;
