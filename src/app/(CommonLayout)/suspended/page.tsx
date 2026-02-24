"use client";

import { useEffect, useCallback } from "react";
import { ShieldAlert, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export default function SuspendedPage() {
  // ✅ Move handleLogout before useEffect
  const handleLogout = useCallback(async () => {
    await authClient.signOut();
    window.location.href = "/login?suspended=true";
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleLogout();
    }, 3000);
    return () => clearTimeout(timer);
  }, [handleLogout]); // ✅ Add handleLogout to dependency

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
          <ShieldAlert className="h-10 w-10 text-red-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-red-600">Account Suspended</h1>
        
        <p className="text-gray-600">
          Your account has been suspended by the administrator. 
          Please contact support for more information.
        </p>

        <Button onClick={handleLogout} variant="destructive" className="w-full">
          <LogOut className="h-4 w-4 mr-2" />
          Logout Now
        </Button>

        <p className="text-sm text-gray-400">Auto logout in 3 seconds...</p>
      </div>
    </div>
  );
}