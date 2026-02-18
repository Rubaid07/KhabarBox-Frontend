import { CartResponse, AddToCartInput } from "@/types/cart";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

const notifyCartUpdate = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("cartUpdated"));
  }
};

export const getMyCart = async (): Promise<CartResponse> => {
  const token = getToken();
  
  const response = await fetch(`${API_URL}/cart`, {
    headers: {
      "Authorization": token ? `Bearer ${token}` : "",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch cart");
  }

  const result = await response.json();
  return result.data;
};

export const addToCart = async (data: AddToCartInput): Promise<CartResponse> => {
  const token = getToken();
  
  const response = await fetch(`${API_URL}/cart`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token ? `Bearer ${token}` : "",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to add to cart");
  }

  const result = await response.json();
  
  notifyCartUpdate();
  return result.data;
};

export const updateCartQuantity = async (cartId: string, quantity: number) => {
  const token = getToken();
  
  const response = await fetch(`${API_URL}/cart/${cartId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token ? `Bearer ${token}` : "",
    },
    credentials: "include",
    body: JSON.stringify({ quantity }),
  });

  if (!response.ok) {
    throw new Error("Failed to update quantity");
  }

  const result = await response.json();
  
  notifyCartUpdate();
  return result;
};

export const removeCartItem = async (cartId: string) => {
  const token = getToken();
  
  const response = await fetch(`${API_URL}/cart/${cartId}`, {
    method: "DELETE",
    headers: {
      "Authorization": token ? `Bearer ${token}` : "",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to remove item");
  }

  const result = await response.json();
  
  notifyCartUpdate();
  return result;
};

export const clearCart = async () => {
  const token = getToken();
  
  const response = await fetch(`${API_URL}/cart`, {
    method: "DELETE",
    headers: {
      "Authorization": token ? `Bearer ${token}` : "",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to clear cart");
  }

  return response.json();
};