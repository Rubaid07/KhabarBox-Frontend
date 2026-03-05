"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Loader2, CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const verificationStarted = useRef(false);

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    token ? "loading" : "error",
  );
  const [message, setMessage] = useState(
    token
      ? "Verifying your email address..."
      : "Invalid or missing verification token.",
  );

  const handleVerify = useCallback(
    async (tokenValue: string) => {
      try {
        const { data, error } = await authClient.verifyEmail({
          query: { token: tokenValue },
        });

        if (error) {
          const errorMsg =
            error.code === "TOKEN_EXPIRED"
              ? "Your link has expired."
              : "Invalid or used link.";
          setStatus("error");
          setMessage(errorMsg);
          return;
        }

        setStatus("success");
        setMessage("Email verified successfully! Logging you in...");
        toast.success("Verified! Redirecting to home...");

        if (!error) {
          setStatus("success");
          toast.success("Email verified successfully!");

          setTimeout(() => {
            window.location.assign("/");
          }, 1500);
        }
      } catch (err) {
        setStatus("error");
        setMessage("An unexpected error occurred.");
      }
    },
    [router],
  );

  useEffect(() => {
    const startVerification = async () => {
      if (token && !verificationStarted.current) {
        verificationStarted.current = true;
        await handleVerify(token);
      }
    };

    startVerification();
  }, [token, handleVerify]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-8 text-center">
        {status === "loading" && (
          <div className="space-y-4">
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 border-4 border-orange-100 rounded-full"></div>
              <Loader2 className="w-20 h-20 text-orange-500 animate-spin relative z-10" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Verifying...</h2>
            <p className="text-gray-500">{message}</p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-6 animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-12 h-12 text-green-500" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">
                Email Verified!
              </h2>
              <p className="text-green-600 font-medium">{message}</p>
            </div>
            {/* 🔥 বাটনটি এখন ডিরেক্ট হোমপেজে নিয়ে যাবে */}
            <button
              onClick={() => router.push("/")}
              className="flex items-center justify-center gap-2 w-full bg-orange-600 text-white py-4 rounded-2xl font-semibold hover:bg-orange-700 transition-all shadow-lg shadow-orange-200"
            >
              Go to Home <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-6">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto">
              <XCircle className="w-12 h-12 text-red-500" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">
                Verification Failed
              </h2>
              <p className="text-gray-600">{message}</p>
            </div>
            <div className="pt-4 space-y-3">
              <Link
                href="/login"
                className="block w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-2xl font-medium hover:bg-gray-200 transition-colors"
              >
                Back to Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
