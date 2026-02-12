// src/components/dashboard/DashboardNavbar.tsx
"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import { Roles } from "@/constants/roles";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DashboardNavbarProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
  userRole: string;
}

export default function DashboardNavbar({
  toggleSidebar,
  isSidebarOpen,
  userRole,
}: DashboardNavbarProps) {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  return (
    <nav className="sticky top-0 z-20 bg-white border-b border-gray-200 px-4 py-3 lg:px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-orange-50 text-gray-600 hover:text-orange-600 transition-colors lg:hidden"
          >
            {isSidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>

          <div className="lg:hidden">
            <Image
              src="/logo.png"
              alt="logo"
              width={80}
              height={32}
              className="h-8 w-auto"
              priority
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="relative h-8 w-8 rounded-full cursor-pointer">
                <Avatar className="h-9 w-9 bg-orange-600 cursor-default">
                  <AvatarImage
                    src={user?.image || undefined}
                    alt={user?.name || ""}
                  />
                  <AvatarFallback>
                    {user?.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
          </DropdownMenu>
          <div className="hidden md:block text-left ml-2">
            <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
              {user?.name || "User"}
            </p>
            <p className="text-xs text-gray-500 capitalize">
              {userRole === Roles.provider ? "Food Provider" : "Admin"}
            </p>
          </div>
        </div>
      </div>
    </nav>
  );
}
