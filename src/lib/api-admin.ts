const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface UserQueryParams {
  page?: string;
  limit?: string;
  role?: string;
  search?: string;
  [key: string]: string | undefined;
}

export const getDashboardStats = async () => {
  const res = await fetch(`${API_URL}/admin/stats`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch stats");
  const json = await res.json();
  return json.data;
};

export const getAllOrders = async (params?: {
  page?: number;
  limit?: number;
}) => {
  const query = new URLSearchParams();
  if (params?.page) query.append("page", params.page.toString());
  if (params?.limit) query.append("limit", params.limit.toString());

  const res = await fetch(`${API_URL}/admin/orders?${query}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
};

export const updateOrderStatus = async (orderId: string, status: string) => {
  const res = await fetch(`${API_URL}/admin/orders/${orderId}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to update status");
  return res.json();
};

export const cancelOrder = async (orderId: string) => {
  const res = await fetch(`${API_URL}/admin/orders/${orderId}/cancel`, {
    method: "PATCH",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to cancel order");
  return res.json();
};

export const getAllUsers = async (params?: UserQueryParams) => {
  const filteredParams = params
    ? (Object.fromEntries(
        Object.entries(params).filter(([_, v]) => v !== undefined),
      ) as Record<string, string>)
    : {};

  const query = new URLSearchParams(filteredParams);

  const res = await fetch(`${API_URL}/admin/users?${query}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
};

export const suspendUser = async (userId: string) => {
  const res = await fetch(`${API_URL}/admin/users/${userId}/suspend`, {
    method: "PATCH",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to suspend user");
  return res.json();
};

export const activateUser = async (userId: string) => {
  const res = await fetch(`${API_URL}/admin/users/${userId}/activate`, {
    method: "PATCH",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to activate user");
  return res.json();
};

export const deleteUser = async (userId: string) => {
  const res = await fetch(`${API_URL}/admin/users/${userId}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to delete user");
};
