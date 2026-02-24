const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  totalMeals: number;
  todayOrders: number;
  weeklyRevenue: number;
}

export interface RecentOrder {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  customer: {
    name: string;
    phone?: string;
  };
  orderItems: {
    meal: {
      name: string;
      imageUrl?: string;
    };
  }[];
}

export interface PopularMeal {
  mealId: string;
  name: string;
  imageUrl: string | null;
  totalSold: number;
  revenue: number;
}

export interface ChartData {
  day: string;
  orders: number;
  revenue: number;
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const res = await fetch(`${API_URL}/provider/dashboard/stats`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch stats");
  const json = await res.json();
  return json.data;
};

export const getRecentOrders = async (page = 1, limit = 5): Promise<{
  data: RecentOrder[];
  meta: { page: number; limit: number; total: number; totalPage: number };
}> => {
  const res = await fetch(
    `${API_URL}/provider/dashboard/orders?page=${page}&limit=${limit}`,
    { credentials: "include" }
  );
  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
};

export const getPopularMeals = async (limit = 5): Promise<PopularMeal[]> => {
  const res = await fetch(
    `${API_URL}/provider/dashboard/popular-meals?limit=${limit}`,
    { credentials: "include" }
  );
  if (!res.ok) throw new Error("Failed to fetch popular meals");
  const json = await res.json();
  return json.data;
};

export const getWeeklyChart = async (): Promise<ChartData[]> => {
  const res = await fetch(`${API_URL}/provider/dashboard/weekly-chart`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch chart data");
  const json = await res.json();
  return json.data;
};