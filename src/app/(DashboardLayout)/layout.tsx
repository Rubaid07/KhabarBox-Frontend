"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client"; 
import { Roles } from "@/constants/roles";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

interface CustomUser {
  id: string;
  email: string;
  name: string;
  role?: string;
  image?: string | null;
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const { data: session, isPending } = authClient.useSession();

  const isAuthenticated = !!session?.user;
  const userRole = (session?.user as CustomUser)?.role || "";

  useEffect(() => {
    if (!isPending) {
      if (!isAuthenticated) {
        router.push("/login");
        return;
      }
      if (userRole === Roles.customer) {
        router.replace("/");
        return;
      }
      if (pathname.startsWith("/admin") && userRole !== Roles.admin) {
        router.replace("/");
        return;
      }

      if (pathname.startsWith("/provider") && userRole !== Roles.provider) {
        router.replace("/");
        return;
      }
    }
  }, [isPending, isAuthenticated, userRole, router, pathname]);

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
      </div>
    );
  }
  if (!isAuthenticated || userRole === Roles.customer) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      <DashboardSidebar 
        userRole={userRole}
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      
      <div className="flex-1 flex flex-col min-h-screen">
        <DashboardNavbar 
          userRole={userRole} 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
          isSidebarOpen={isSidebarOpen}
        />
        
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}