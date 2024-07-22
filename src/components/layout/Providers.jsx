import React from "react";
import ErrorBoundary from "@/components/layout/ErrorBoundary";
import { TooltipProvider } from "@/components/shared/Tooltip";
import { Toaster } from "@/components/shared/Toast/toaster";
import { AuthProvider } from "@/lib/context/AuthContext";

const Providers = ({ children }) => (
  <ErrorBoundary>
    <AuthProvider>
      <TooltipProvider delayDuration={200}>
        <Toaster />
        {children}
      </TooltipProvider>
    </AuthProvider>
  </ErrorBoundary>
);

export default Providers;
