"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Package,
  DollarSign,
  Clock,
  ChefHat,
  TrendingUp,
  Users,
  ArrowUpRight,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  getDashboardStats,
  getRecentOrders,
  getPopularMeals,
  getWeeklyChart,
  DashboardStats,
  RecentOrder,
  PopularMeal,
  ChartData,
} from "@/lib/api-provider-dashboard";
import { formatPrice } from "@/lib/utils";

// Simple Bar Chart Component
function WeeklyChart({ data }: { data: ChartData[] }) {
  const maxRevenue = Math.max(...data.map((d) => d.revenue), 1);

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between h-48 gap-2">
        {data.map((day, idx) => {
          const height = day.revenue > 0 ? (day.revenue / maxRevenue) * 100 : 5;
          return (
            <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
              <div
                className="w-full bg-orange-500 rounded-t-lg transition-all duration-500 hover:bg-orange-600 relative group"
                style={{ height: `${Math.max(height, 5)}%` }}
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">
                  {formatPrice(day.revenue)}
                </div>
              </div>
              <span className="text-xs text-gray-500 font-medium">{day.day}</span>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between text-xs text-gray-500 pt-2 border-t">
        <span>Total Orders: {data.reduce((sum, d) => sum + d.orders, 0)}</span>
        <span>Total Revenue: {formatPrice(data.reduce((sum, d) => sum + d.revenue, 0))}</span>
      </div>
    </div>
  );
}

const statusConfig: Record<string, { label: string; color: string }> = {
  PLACED: { label: "New", color: "bg-blue-100 text-blue-800" },
  PREPARING: { label: "Preparing", color: "bg-yellow-100 text-yellow-800" },
  READY: { label: "Ready", color: "bg-purple-100 text-purple-800" },
  DELIVERED: { label: "Delivered", color: "bg-green-100 text-green-800" },
  CANCELLED: { label: "Cancelled", color: "bg-red-100 text-red-800" },
};

export default function ProviderOverviewPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [popularMeals, setPopularMeals] = useState<PopularMeal[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsData, ordersData, mealsData, chartData] = await Promise.all([
        getDashboardStats(),
        getRecentOrders(1, 5),
        getPopularMeals(5),
        getWeeklyChart(),
      ]);

      setStats(statsData);
      setRecentOrders(ordersData.data);
      setPopularMeals(mealsData);
      setChartData(chartData);
    } catch (error) {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatPrice(stats.totalRevenue)}
                </p>
                <p className="text-xs text-orange-600 mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +{formatPrice(stats.weeklyRevenue)} this week
                </p>
              </div>
              <div className="p-3 bg-orange-200 rounded-lg">
                <DollarSign className="h-6 w-6 text-orange-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.totalOrders}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.todayOrders} today
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Pending Orders</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.pendingOrders}
                </p>
                <p className="text-xs text-red-500 mt-1">Needs attention</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Meals</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.totalMeals}
                </p>
                <Link
                  href="/provider/dashboard/meals"
                  className="text-xs text-orange-600 hover:underline mt-1 inline-flex items-center gap-1"
                >
                  Manage meals <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <ChefHat className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-orange-500" />
              Weekly Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <WeeklyChart data={chartData} />
          </CardContent>
        </Card>

        {/* Popular Meals */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-500" />
              Top Meals
            </CardTitle>
            <Link href="/provider/dashboard/meals">
              <Button variant="ghost" size="sm">
                View all
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {popularMeals.length === 0 ? (
              <p className="text-center text-gray-500 py-4">No sales yet</p>
            ) : (
              <div className="space-y-4">
                {popularMeals.map((meal, idx) => (
                  <div key={meal.mealId} className="flex items-center gap-3">
                    <span className="text-lg font-bold text-gray-400 w-6">
                      #{idx + 1}
                    </span>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 truncate">
                        {meal.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {meal.totalSold} sold • {formatPrice(meal.revenue)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-orange-500" />
            Recent Orders
          </CardTitle>
          <Link href="/provider/dashboard/orders">
            <Button variant="ghost" size="sm">
              View all orders
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No orders yet</p>
          ) : (
            <div className="divide-y">
              {recentOrders.map((order) => {
                const status = statusConfig[order.status];
                return (
                  <div
                    key={order.id}
                    className="py-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="font-semibold text-gray-900">
                          #{order.id.slice(-8)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {order.customer.name}
                        </p>
                      </div>
                      <Badge className={status?.color || "bg-gray-100"}>
                        {status?.label || order.status}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatPrice(order.totalAmount)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {order.orderItems.length} items
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/provider/dashboard/meals">
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-dashed border-2">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <ChefHat className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Add New Meal</p>
                <p className="text-sm text-gray-500">Create a new menu item</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/provider/dashboard/orders">
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-dashed border-2">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Manage Orders</p>
                <p className="text-sm text-gray-500">
                  {stats.pendingOrders} pending orders
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/profile">
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-dashed border-2">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Edit Profile</p>
                <p className="text-sm text-gray-500">Update restaurant info</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}