"use client";

import { Roles } from "@/constants/roles";
import { UserRole } from "@/types/auth";
import { ChefHat, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface RoleSelectorProps {
  value: UserRole;
  onChange: (role: UserRole) => void;
  disabled?: boolean;
}

const roles = [
  {
    id: Roles.customer,
    label: "Customer",
    description: "Order delicious meals",
    icon: User,
    color: "bg-blue-500",
  },
  {
    id: Roles.provider,
    label: "Provider",
    description: "Sell your food",
    icon: ChefHat,
    color: "bg-orange-500",
  },
];

export function RoleSelector({ value, onChange, disabled }: RoleSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {roles.map((role) => {
        const Icon = role.icon;
        const isSelected = value === role.id;

        return (
          <button
            key={role.id}
            type="button"
            onClick={() => onChange(role.id)}
            disabled={disabled}
            className={cn(
              "relative flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-200",
              "hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2",
              isSelected
                ? `border-${role.color.replace("bg-", "")} ${role.color} text-white`
                : "border-gray-200 bg-white hover:border-gray-300 text-gray-700",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            <Icon
              className={cn(
                "h-6 w-6 mb-2",
                isSelected ? "text-white" : "text-gray-500"
              )}
            />
            <span className="font-semibold">{role.label}</span>
            <span
              className={cn(
                "text-xs mt-1",
                isSelected ? "text-white/90" : "text-gray-500"
              )}
            >
              {role.description}
            </span>
            
            {isSelected && (
              <div className="absolute top-2 right-2">
                <div className="h-3 w-3 rounded-full bg-white ring-2 ring-white" />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}