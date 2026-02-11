"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"; 
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  PlusCircle, 
  ShoppingBag, 
  Settings,
  LogOut
} from "lucide-react";
import { Roles } from "@/constants/roles";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

interface DashboardSidebarProps {
  userRole: string;
}

const getNavItems = (role: string) => {
  if (role === Roles.provider) {
    return [
      { title: "Dashboard", href: "/provider/dashboard/overview", icon: LayoutDashboard },
      { title: "My Meals", href: "/provider/dashboard/meals", icon: UtensilsCrossed },
      { title: "Add New Meal", href: "/provider/dashboard/create-meal", icon: PlusCircle },
      { title: "Orders", href: "/provider/dashboard/orders", icon: ShoppingBag },
      { title: "Settings", href: "/provider/dashboard/settings", icon: Settings },
    ];
  }

  return [
    { title: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { title: "Users", href: "/admin/users", icon: UtensilsCrossed },
    { title: "Orders", href: "/admin/orders", icon: ShoppingBag },
  ];
};

export default function DashboardSidebar({ userRole }: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = authClient.useSession(); 
  const user = session?.user;

  const handleLogout = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success("Logged out successfully");
            router.push("/");
            router.refresh();
          },
          onError: (ctx) => {
            toast.error(ctx.error.message || "Logout failed");
          }
        },
      });
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const navItems = getNavItems(userRole);

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen sticky top-0 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">
          {userRole === Roles.admin ? "Admin Panel" : "Provider Panel"}
        </h1>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.title}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}