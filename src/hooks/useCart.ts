    "use client";

    import { useState, useEffect, useCallback, useRef } from "react";

    export function useCart() {
    const [cartCount, setCartCount] = useState(0);
    const isInitialMount = useRef(true);

    const refreshCart = useCallback(async () => {
        try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        
        const response = await fetch(`${API_URL}/cart`, {
            credentials: "include",
            headers: {
            "Authorization": token ? `Bearer ${token}` : "",
            },
        });
        
        if (response.ok) {
            const result = await response.json();
            const totalItems =
            result.data?.items?.reduce(
                (sum: number, item: { quantity: number }) => sum + item.quantity,
                0,
            ) || 0;
            setCartCount(totalItems);
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