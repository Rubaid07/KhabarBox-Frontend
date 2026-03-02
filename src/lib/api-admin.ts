const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface UserQueryParams {
  page?: string;
  limit?: string;
  role?: string;
  search?: string;
  [key: string]: string | undefined;
}

// Dashboard Stats
export const getDashboardStats = async () => {
  const res = await fetch(`${API_URL}/admin/stats`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch stats");
  const json = await res.json();
  return json.data;
};

// Revenue Trend
export const getRevenueTrend = async (days: number = 30) => {
  const res = await fetch(
    `${API_URL}/admin/stats/revenue-trend?days=${days}`,
    {
      credentials: "include",
    }
  );
  if (!res.ok) throw new Error("Failed to fetch revenue trend");
  const json = await res.json();
  return json.data;
};

// Recent Orders
export const getRecentOrders = async (limit: number = 10) => {
  const res = await fetch(
    `${API_URL}/admin/stats/recent-orders?limit=${limit}`,
    {
      credentials: "include",
    }
  );
  if (!res.ok) throw new Error("Failed to fetch recent orders");
  const json = await res.json();
  return json.data;
};

// Top Providers
export const getTopProviders = async (limit: number = 5) => {
  const res = await fetch(
    `${API_URL}/admin/stats/top-providers?limit=${limit}`,
    {
      credentials: "include",
    }
  );
  if (!res.ok) throw new Error("Failed to fetch top providers");
  const json = await res.json();
  return json.data;
};

// Order Status Breakdown
export const getOrderStatusBreakdown = async () => {
  const res = await fetch(`${API_URL}/admin/stats/order-status`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch order status");
  const json = await res.json();
  return json.data;
};

// All Orders
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

// Update Order Status
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

// Cancel Order
export const cancelOrder = async (orderId: string) => {
  const res = await fetch(`${API_URL}/admin/orders/${orderId}/cancel`, {
    method: "PATCH",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to cancel order");
  return res.json();
};

// All Users
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

// Suspend User
export const suspendUser = async (userId: string) => {
  const res = await fetch(`${API_URL}/admin/users/${userId}/suspend`, {
    method: "PATCH",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to suspend user");
  return res.json();
};

// Activate User
export const activateUser = async (userId: string) => {
  const res = await fetch(`${API_URL}/admin/users/${userId}/activate`, {
    method: "PATCH",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to activate user");
  return res.json();
};

// Delete User
export const deleteUser = async (userId: string) => {
  const res = await fetch(`${API_URL}/admin/users/${userId}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to delete user");
};

// Update User Status
export const updateUserStatus = async (userId: string, status: string) => {
  const res = await fetch(`${API_URL}/admin/users/${userId}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to update status");
  return res.json();
};