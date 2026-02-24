"use client";

import { ShieldAlert, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export function SuspendedModal({ countdown }: { countdown: number }) {
  return (
    <Dialog open={true}>
      {/* [&>button]:hidden দিয়ে shadcn এর ক্লোজ বাটন হাইড করা হয়েছে */}
      <DialogContent className="sm:max-w-md [&>button]:hidden" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <ShieldAlert className="h-8 w-8 text-red-600" />
          </div>
          <DialogTitle className="text-xl text-red-600">Account Suspended</DialogTitle>
          <DialogDescription className="text-center">
            Your account has been suspended by the administrator.
            <br /> Please contact support.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-4">
          <div className="flex items-center gap-2 text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Logging out in {countdown} seconds...</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-red-600 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${(countdown / 5) * 100}%` }}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}