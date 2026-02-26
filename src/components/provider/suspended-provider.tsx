"use client";

import { useEffect, useState, useMemo } from "react";
import { authClient, useSession } from "@/lib/auth-client";
import { SuspendedModal } from "../shared/suspended-modal";

interface UserWithStatus {
  status?: string;
  isSuspended?: boolean;
}

export function SuspendedProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  
  const [isApiSuspended, setIsApiSuspended] = useState(false);
  const [countdown, setCountdown] = useState(5);

  const isSuspended = useMemo(() => {
    const user = session?.user as (UserWithStatus & { id: string }) | undefined;
    const isSessionSuspended = !!(user?.status === "SUSPENDED" || user?.isSuspended);
    
    return isSessionSuspended || isApiSuspended;
  }, [session, isApiSuspended]);

  useEffect(() => {
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const response = await originalFetch(...args);
      
      if (response.status === 403) {
        const clone = response.clone();
        try {
          const data = await clone.json();
          if (data.code === "SUSPENDED" || data.message === "ACCOUNT_SUSPENDED") {
        setIsApiSuspended(true);
      }
    } catch { 

         }
      }
      return response;
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  useEffect(() => {
    if (!isSuspended) return;

    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      authClient.signOut().then(() => {
        window.location.href = "/login";
      });
    }
  }, [isSuspended, countdown]);

  return (
    <>
      {isSuspended && <SuspendedModal countdown={countdown} />}
      <div className={isSuspended ? "pointer-events-none blur-sm select-none overflow-hidden" : ""}>
        {children}
      </div>
    </>
  );
}