const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface ProviderOrder {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  deliveryAddress: string;
  phone?: string;
  notes?: string;
  paymentMethod: string;
  customer: {
    name: string;
    phone?: string;
  };
  orderItems: {
    id: string;
    quantity: number;
    priceAtTime: number;
    meal: {
      name: string;
      imageUrl?: string;
    };
  }[];
}

export const getProviderOrders = async (): Promise<ProviderOrder[]> => {
  const res = await fetch(`${API_URL}/orders/provider`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch orders");
  const json = await res.json();
  return json.data;
};

export const updateOrderStatus = async (
  orderId: string,
  status: string
): Promise<ProviderOrder> => {
  const res = await fetch(`${API_URL}/orders/${orderId}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to update status");
  const json = await res.json();
  return json.data;
};

export const getOrderDetails = async (orderId: string): Promise<ProviderOrder> => {
  const res = await fetch(`${API_URL}/orders/${orderId}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch order details");
  const json = await res.json();
  return json.data;
};