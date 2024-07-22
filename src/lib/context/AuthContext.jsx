/* eslint-disable react/jsx-no-constructed-context-values */
import React, { createContext, useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/component";
import { recursiveCamelCase } from "../utils";

// Create context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // supabase auth table
  const [profile, setProfile] = useState(null); // supabase profiles table
  const supabaseClient = createClient();

  const fetchProfile = async (currUser) => {
    if (currUser) {
      const { data, error } = await supabaseClient
        .from("profiles")
        .select()
        .eq("id", currUser.id);
      if (data) {
        const formattedData = recursiveCamelCase(data[0]);
        setProfile(formattedData);
      } else {
        setProfile(null);
      }
    }
    return true;
  };

  useEffect(() => {
    (async () => {
      await fetchProfile(user);
    })();
  }, [user]);

  // Effect to handle authentication state changes
  useEffect(() => {
    // Initial fetch of user session
    (async () => {
      const fetchUser = await supabaseClient.auth.getUser();
      setUser(fetchUser?.data?.user || null);
    })();

    // Subscribe to authentication state changes
    const { data } = supabaseClient.auth.onAuthStateChange(
      async (event, session) => {
        if (
          event === "SIGNED_IN" ||
          event === "USER_UPDATED" ||
          event === "TOKEN_REFRESHED"
        ) {
          setUser(session.user);
        } else if (event === "SIGNED_OUT") {
          setUser(null);
        }
      }
    );

    // Clean up subscription on unmount
    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
