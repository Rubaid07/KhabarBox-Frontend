import { Roles } from "@/constants/roles";
import { z } from "zod";

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be less than 50 characters"),
    email: z.string().email("Please enter a valid email address"),
    phone: z
      .string()
      .min(10, "Phone number must be at least 10 digits")
      .max(15, "Phone number is too long")
      .regex(/^[0-9+\-\s()]+$/, "Please enter a valid phone number"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password is too long")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    role: z.nativeEnum(Roles),
    
    restaurantName: z.string().optional(),
    address: z.string().optional(),
    description: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.role === Roles.provider) {
        return (
          data.restaurantName &&
          data.restaurantName.length >= 2 &&
          data.address &&
          data.address.length >= 5
        );
      }
      return true;
    },
    {
      message: "Restaurant name and address are required for providers",
      path: ["restaurantName"],
    }
  );

export type RegisterFormData = z.infer<typeof registerSchema>;