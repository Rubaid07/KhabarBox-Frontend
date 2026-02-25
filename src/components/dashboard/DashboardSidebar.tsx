"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  UtensilsCrossed,
  PlusCircle,
  ShoppingBag,
  LogOut,
  Users,
  BarChart3,
  Star,
  ChefHat,
  Store,
  Package,
  ShieldAlert,
  Settings,
} from "lucide-react";
import Image from "next/image";
import { Roles } from "@/constants/roles";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface DashboardSidebarProps {
  userRole: string;
  isOpen: boolean;
  onClose: () => void;
}

const getNavItems = (role: string) => {
  if (role === Roles.provider) {
    return [
      {
        title: "Dashboard",
        href: "/provider/dashboard/overview",
        icon: LayoutDashboard,
      },
      {
        title: "My Meals",
        href: "/provider/dashboard/meals",
        icon: UtensilsCrossed,
      },
      {
        title: "Add New Meal",
        href: "/provider/dashboard/create-meal",
        icon: PlusCircle,
      },
      {
        title: "Orders",
        href: "/provider/dashboard/orders",
        icon: ShoppingBag,
      },
    ];
  }

  return [
    {
      title: "Dashboard",
      href: "/admin/dashboard/overview",
      icon: LayoutDashboard,
    },
    { title: "Users", href: "/admin/dashboard/users", icon: Users },
    {
      title: "Orders",
      href: "/admin/dashboard/orders",
      icon: Package,
    },
    {
      title: "Restaurants",
      href: "/admin/dashboard/restaurants",
      icon: Store,
    },
    {
      title: "Meals",
      href: "/admin/dashboard/meals",
      icon: ChefHat,
    },
    {
      title: "Reviews",
      href: "/admin/dashboard/reviews",
      icon: Star,
    },
    {
      title: "Reports",
      href: "/admin/dashboard/reports",
      icon: BarChart3,
    },
    {
      title: "Suspended Users",
      href: "/admin/dashboard/suspended",
      icon: ShieldAlert,
    },
    {
      title: "Settings",
      href: "/admin/dashboard/settings",
      icon: Settings,
    },
  ];
};

export default function DashboardSidebar({
  userRole,
  isOpen,
  onClose,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = authClient.useSession();

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
          },
        },
      });
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const navItems = getNavItems(userRole);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed lg:sticky top-0 z-40 h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out",
          "w-72 lg:w-64",
          isOpen ? "left-0" : "-left-72 lg:left-0",
          "overflow-y-auto custom-scrollbar",
        )}
      >
        <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-gray-200">
          <Link href="/" className="block">
            <Image
              src="/logo.png"
              alt="logo"
              width={120}
              height={48}
              className="h-12 w-34 md:h-12 md:w-40 object-contain"
              priority
            />
          </Link>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onClose()}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                  "hover:bg-orange-50 hover:text-orange-600 group",
                  isActive
                    ? "bg-orange-50 text-orange-600 border-l-4 border-orange-600"
                    : "text-gray-700",
                )}
              >
                <Icon
                  className={cn(
                    "w-5 h-5 transition-colors",
                    isActive
                      ? "text-orange-600"
                      : "text-gray-500 group-hover:text-orange-600",
                  )}
                />
                <span>{item.title}</span>

                {/* Active indicator */}
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 bg-orange-600 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors group"
          >
            <LogOut className="w-5 h-5 text-red-500 group-hover:text-red-600" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
