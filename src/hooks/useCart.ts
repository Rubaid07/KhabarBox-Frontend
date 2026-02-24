"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export function useCart() {
  const [cartCount, setCartCount] = useState(0);
  const isInitialMount = useRef(true);

  const refreshCart = useCallback(async () => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    // ১. টোকেন না থাকলে কার্ট কাউন্ট ০ করে ফাংশন থামিয়ে দিন
    if (!token) {
      setCartCount(0);
      return; 
    }

    try {
      const headers: HeadersInit = {
        "Authorization": `Bearer ${token}`
      };

      const response = await fetch(`${API_URL}/cart`, {
        credentials: "include",
        headers: headers,
      });

      if (response.ok) {
        const result = await response.json();
        const totalItems = result.data?.items?.reduce(
          (sum: number, item: { quantity: number }) => sum + item.quantity,
          0,
        ) || 0;
        setCartCount(totalItems);
      } else if (response.status === 401 || response.status === 403) {
        // ২. যদি সার্ভার বলে টোকেন ইনভ্যালিড, তবে কাউন্ট ০ করুন
        setCartCount(0);
      }
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    }
  }, []);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      const timer = setTimeout(() => {
        refreshCart();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [refreshCart]);

  useEffect(() => {
    const handleCartUpdate = () => {
      refreshCart();
    };

    if (typeof window !== "undefined") {
      window.addEventListener("cartUpdated", handleCartUpdate);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("cartUpdated", handleCartUpdate);
      }
    };
  }, [refreshCart]);

  return { cartCount, refreshCart };
}
