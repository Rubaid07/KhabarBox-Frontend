import { CreateOrderInput, Order } from "@/types/order";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const getMyOrders = async (): Promise<Order[]> => {
 
  try {
    const response = await fetch(`${API_URL}/orders/my`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    if (response.status === 401 || response.status === 403) {
      console.warn("Unauthorized attempt to fetch orders");
      return [];
    }

    if (!response.ok) throw new Error("Failed to fetch orders");

    const result = await response.json();
    return result.data || [];
  } catch (error) {
    return [];
  }
};

export const createOrder = async (data: CreateOrderInput): Promise<Order> => {
  const response = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
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

export const getOrderById = async (orderId: string): Promise<Order> => {
  const response = await fetch(`${API_URL}/orders/${orderId}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch order");
  }

  const result = await response.json();
  return result.data;
};

export const cancelOrder = async (orderId: string): Promise<void> => {
  const response = await fetch(`${API_URL}/orders/${orderId}/cancel`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to cancel order");
  }
};
