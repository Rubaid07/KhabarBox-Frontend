"use client";

import { useEffect, useState, useRef, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  const verificationStarted = useRef(false);

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    token ? "loading" : "error"
  );
  const [message, setMessage] = useState(
    token ? "Verifying your email address..." : "Invalid or missing token."
  );

  const handleVerify = useCallback(async (tokenValue: string) => {
    try {
      const { error } = await authClient.verifyEmail({
        query: { token: tokenValue },
      });

      if (error) {
        setStatus("error");
        setMessage(error.code === "TOKEN_EXPIRED" ? "Link expired." : "Invalid link.");
        return;
      }

      setStatus("success");
      setMessage("Email verified successfully!");
      toast.success("Verified!");

      setTimeout(() => {
        window.location.assign("/");
      }, 1500);
    } catch (err) {
      setStatus("error");
      setMessage("An unexpected error occurred.");
    }
  }, []);

  useEffect(() => {
    if (token && !verificationStarted.current) {
      verificationStarted.current = true;
      Promise.resolve().then(() => handleVerify(token));
    }
  }, [token, handleVerify]); 

  return (
    <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center border border-gray-100">
      {status === "loading" && <div className="animate-pulse">Verifying...</div>}
      {status === "success" && <div className="text-green-600">{message}</div>}
      {status === "error" && <div className="text-red-600">{message}</div>}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Suspense fallback={<Loader2 className="animate-spin" />}>
        <VerifyEmailContent />
      </Suspense>
    </div>
  );
}