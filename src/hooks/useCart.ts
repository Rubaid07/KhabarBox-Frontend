"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "@/lib/auth-client";

export function useCart() {
  const [cartCount, setCartCount] = useState(0);
  const { data: session, isPending } = useSession();

  const refreshCart = useCallback(async () => {
    if (isPending || !session) {
      setCartCount(0);
      return;
    }

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${API_URL}/cart`, {
        credentials: "include",
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const result = await response.json();
        const items = result.data?.items || [];
        const totalItems = items.reduce(
          (sum: number, item: { quantity: number }) => sum + item.quantity,
          0
        );
        setCartCount(totalItems);
      }
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    }
  }, [session, isPending]);

  useEffect(() => {
    const fetchCartData = async () => {
      await refreshCart();
    };
    
    fetchCartData();
  }, [refreshCart]);

  useEffect(() => {
    const handleCartUpdate = () => {
      void refreshCart();
    };

    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, [refreshCart]);

  return { cartCount, refreshCart };
}