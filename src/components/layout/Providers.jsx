import React from "react";
import ErrorBoundary from "@/components/layout/ErrorBoundary";
import { Toaster } from "@/components/shared/Toast/toaster";
import { AuthProvider } from "@/lib/context/AuthContext";

const Providers = ({ children }) => (
  <ErrorBoundary>
    <AuthProvider>
      <Toaster />
      {children}
    </AuthProvider>
  </ErrorBoundary>
);

export default Providers;
