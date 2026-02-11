import { Roles } from "@/constants/roles";


export type UserRole = typeof Roles[keyof typeof Roles];

export interface RegisterInput {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  
  restaurantName?: string;
  address?: string;
  description?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  error?: string;
  user?: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
  };
}