import { createAuthClient } from "better-auth/react";
import { toast } from "sonner";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  fetchOptions: {
    credentials: "include",
  },
});

export const { signIn, signUp, signOut, useSession } = authClient;

export const handleAuthError = (error: unknown): string => {
  let message = "Something went wrong";

  if (error instanceof Error) {
    message = error.message;
  }

  toast.error(message);
  return message;
};
