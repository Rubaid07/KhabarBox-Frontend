import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  fetchOptions: {
    credentials: "include",
  },
});

// ইউজারের টাইপ এক্সটেন্ড করা
export type User = {
  id: string;
  email: string;
  name: string;
  image?: string | null;
  status?: string; // ব্যাকএন্ড থেকে আসা স্ট্যাটাস
  isSuspended?: boolean;
};

export const { signIn, signUp, signOut, useSession } = authClient;