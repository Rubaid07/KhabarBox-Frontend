import { CreateOrderInput, Order } from "@/types/order";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

export const createOrder = async (data: CreateOrderInput): Promise<Order> => {
  const token = getToken();
  
  const response = await fetch(`${API_URL}/orders`, {
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
    throw new Error(error.message || "Failed to create order");
  }

  const result = await response.json();
  return result.data;
};