const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "CUSTOMER" | "PROVIDER" | "ADMIN";
  status: "ACTIVE" | "SUSPENDED";
  createdAt: string;
}

export interface DashboardStats {
  users: {
    total: number;
    providers: number;
    customers: number;
  };
  orders: {
    total: number;
    pending: number;
  };
  revenue: number;
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const res = await fetch(`${API_URL}/admin/stats`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch stats");
  const json = await res.json();
  return json.data;
};

export const getAllUsers = async (params?: {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}): Promise<{
  data: User[];
  meta: { page: number; limit: number; total: number; totalPage: number };
}> => {
  const query = new URLSearchParams();
  if (params?.page) query.append("page", params.page.toString());
  if (params?.limit) query.append("limit", params.limit.toString());
  if (params?.sortBy) query.append("sortBy", params.sortBy);
  if (params?.sortOrder) query.append("sortOrder", params.sortOrder);

  const res = await fetch(`${API_URL}/admin/users?${query}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
};

export const suspendUser = async (userId: string): Promise<User> => {
  const res = await fetch(`${API_URL}/admin/users/${userId}/suspend`, {
    method: "PATCH",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to suspend user");
  const json = await res.json();
  return json.data;
};

export const activateUser = async (userId: string): Promise<User> => {
  const res = await fetch(`${API_URL}/admin/users/${userId}/activate`, {
    method: "PATCH",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to activate user");
  const json = await res.json();
  return json.data;
};

export const deleteUser = async (userId: string): Promise<void> => {
  const res = await fetch(`${API_URL}/admin/users/${userId}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to delete user");
};