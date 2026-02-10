export type UserRole = "CUSTOMER" | "PROVIDER" | "ADMIN";

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