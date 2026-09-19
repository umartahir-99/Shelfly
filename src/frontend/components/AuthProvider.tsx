"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { AuthPage } from "./AuthPage";
import KineticTextLoader from "@/components/ui/kinetic-text-loader";

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<boolean | null>(null);
  // null = loading, true = authenticated, false = not authenticated

  useEffect(() => {
    const startedAt = Date.now();

    // Check active session on mount
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      const remainingTime = Math.max(0, 4000 - (Date.now() - startedAt));

      window.setTimeout(() => {
        setSession(s !== null);
      }, remainingTime);
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (window.localStorage.getItem("shelfly-signup-pending") === "true") {
        setSession(false);
        return;
      }

      setSession(session !== null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Loading state — show the shared kinetic loader.
  if (session === null) {
    return (
      <div className="min-h-screen bg-cream-paper flex items-center justify-center">
        <KineticTextLoader aria-label="Loading your shelf" />
      </div>
    );
  }

  // Not authenticated — show auth page
  if (!session) {
    return <AuthPage />;
  }

  // Authenticated — show the app
  return <>{children}</>;
}