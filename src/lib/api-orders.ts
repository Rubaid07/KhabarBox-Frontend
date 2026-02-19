import { CreateOrderInput, Order } from "@/types/order";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const getMyOrders = async () => {
  try {
    const response = await fetch(`${API_URL}/orders/my`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch orders");
    }

    const result = await response.json();
    // এখানে নিশ্চিত করুন যে অন্তত খালি অ্যারে রিটার্ন হচ্ছে
    return result.data || []; 
  } catch (error) {
    console.error("getMyOrders Error:", error);
    return []; // এরর হলেও খালি অ্যারে দিন যাতে ম্যাপ ক্র্যাশ না করে
  }
};

export const createOrder = async (data: CreateOrderInput): Promise<any[]> => {
  const response = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // Sends session cookie
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create order");
  }

  return (await response.json()).data;
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

  return (await response.json()).data;
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