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
  ShoppingBag,
  LucideIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
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

// Simple Bar Chart Component - Improved Visual
function WeeklyChart({ data }: { data: ChartData[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        No data available for this week
      </div>
    );
  }

  const maxRevenue = Math.max(...data.map((d) => d.revenue), 1);
  const hasData = data.some(d => d.revenue > 0 || d.orders > 0);

  if (!hasData) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        No sales data for this week
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Chart Container - Increased height */}
      <div className="relative h-64">
        {/* Y-axis labels (visual only) */}
        <div className="absolute -left-2 top-0 h-full flex flex-col justify-between text-xs text-gray-400">
          <span>{formatPrice(maxRevenue)}</span>
          <span>{formatPrice(maxRevenue * 0.75)}</span>
          <span>{formatPrice(maxRevenue * 0.5)}</span>
          <span>{formatPrice(maxRevenue * 0.25)}</span>
          <span>0</span>
        </div>

        {/* Grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none ml-6">
          <div className="border-b border-gray-200 w-full" />
          <div className="border-b border-gray-200 w-full" />
          <div className="border-b border-gray-200 w-full" />
          <div className="border-b border-gray-200 w-full" />
          <div className="border-b border-gray-200 w-full" />
        </div>

        {/* Bars */}
        <div className="relative h-full flex items-end justify-around gap-2 ml-8">
          {data.map((day, idx) => {
            const heightPercentage = day.revenue > 0 
              ? (day.revenue / maxRevenue) * 100 
              : 4; // Minimum 4% height for visibility
            
            return (
              <div key={day.day || idx} className="flex-1 flex flex-col items-center gap-2 group">
                {/* Bar with gradient and animation */}
                <div className="relative w-full h-full flex items-end">
                  <div
                    className="w-full bg-gradient-to-t from-orange-600 to-orange-400 rounded-t-lg transition-all duration-300 group-hover:from-orange-700 group-hover:to-orange-500 cursor-pointer relative shadow-sm"
                    style={{ 
                      height: `${heightPercentage}%`,
                      minHeight: '16px', // Increased minimum height
                      opacity: day.revenue === 0 ? 0.5 : 1
                    }}
                  >
                    {/* Tooltip */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 whitespace-nowrap z-20 transition-opacity shadow-lg">
                      <div className="font-semibold">{formatPrice(day.revenue)}</div>
                      <div className="text-gray-300 text-[10px]">{day.orders} orders</div>
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
                    </div>

                    {/* Value label on bar (for significant values) */}
                    {day.revenue > maxRevenue * 0.1 && (
                      <div className="absolute top-1 left-1/2 -translate-x-1/2 text-[10px] font-medium text-white opacity-0 group-hover:opacity-100">
                        {formatPrice(day.revenue)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Day label with order count */}
                <div className="text-center">
                  <span className="text-sm font-medium text-gray-700">{day.day}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Weekly Stats */}
      <div className="flex justify-between text-xs text-gray-500">
        <span>Best Day: {
          (() => {
            const best = [...data].sort((a, b) => b.revenue - a.revenue)[0];
            return best?.revenue > 0 ? `${best.day} (${formatPrice(best.revenue)})` : 'N/A';
          })()
        }</span>
        <span>Average: {
          (() => {
            const avg = data.reduce((sum, d) => sum + d.revenue, 0) / data.length;
            return formatPrice(avg);
          })()
        }</span>
      </div>
    </div>
  );
}

const statusConfig: Record<string, { label: string; color: string }> = {
  PLACED: { label: "New", color: "bg-orange-50 text-orange-700 border-orange-200" },
  PREPARING: { label: "Preparing", color: "bg-amber-50 text-amber-700 border-amber-200" },
  READY: { label: "Ready", color: "bg-purple-50 text-purple-700 border-purple-200" },
  DELIVERED: { label: "Delivered", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  CANCELLED: { label: "Cancelled", color: "bg-rose-50 text-rose-700 border-rose-200" },
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
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard Overview</h1>
          <p className="text-sm text-gray-500 mt-1">
            Welcome back! Here&#39;s what&#39;s happening with your restaurant.
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={loadDashboardData}
          className="gap-2"
        >
          <TrendingUp className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value={formatPrice(stats.totalRevenue)}
          icon={DollarSign}
          subValue={`+${formatPrice(stats.weeklyRevenue)} this week`}
          trend="up"
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders.toString()}
          icon={Package}
          subValue={`${stats.todayOrders} today`}
        />
        <StatCard
          title="Pending Orders"
          value={stats.pendingOrders.toString()}
          icon={Clock}
          subValue="Needs attention"
          highlight={stats.pendingOrders > 0}
        />
        <StatCard
          title="Total Meals"
          value={stats.totalMeals.toString()}
          icon={ChefHat}
          subValue=""
          link="/provider/dashboard/meals"
          linkText="Manage meals"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              Weekly Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <WeeklyChart data={chartData} />
          </CardContent>
        </Card>

        {/* Popular Meals */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-gray-500" />
              Top Meals
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/provider/dashboard/meals" className="gap-1 text-sm">
                View all
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {popularMeals.length === 0 ? (
              <div className="text-center py-8 text-sm text-gray-500">
                No sales yet
              </div>
            ) : (
              <div className="space-y-3">
                {popularMeals.map((meal, idx) => (
                  <div key={meal.mealId} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                    <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center text-sm font-medium text-gray-700">
                      #{idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
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
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Package className="h-4 w-4 text-gray-500" />
            Recent Orders
          </CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/provider/dashboard/orders" className="gap-1 text-sm">
              View all orders
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <div className="text-center py-8 text-sm text-gray-500">
              No orders yet
            </div>
          ) : (
            <div className="space-y-2">
              {recentOrders.map((order) => {
                const status = statusConfig[order.status];
                return (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 bg-white rounded-full flex items-center justify-center text-base">
                        🍽️
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          #{order.id.slice(-8)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {order.customer.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-900">
                        {formatPrice(order.totalAmount)}
                      </span>
                      <Badge className={status?.color || "bg-gray-100"}>
                        {status?.label || order.status}
                      </Badge>
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
        <QuickActionCard
          href="/provider/dashboard/meals/create"
          icon={ChefHat}
          title="Add New Meal"
          description="Create a new menu item"
          color="orange"
        />
        <QuickActionCard
          href="/provider/dashboard/orders"
          icon={Package}
          title="Manage Orders"
          description={`${stats.pendingOrders} pending orders`}
          color="amber"
        />
        <QuickActionCard
          href="/profile"
          icon={Users}
          title="Edit Profile"
          description="Update restaurant info"
          color="emerald"
        />
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  subValue,
  trend,
  highlight,
  link,
  linkText,
}: { 
  title: string; 
  value: string; 
  icon: LucideIcon; 
  subValue: string;
  trend?: 'up' | 'down';
  highlight?: boolean;
  link?: string;
  linkText?: string;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-gray-500 mb-1">{title}</p>
            <p className={`text-xl font-semibold ${highlight ? 'text-amber-600' : 'text-gray-900'}`}>
              {value}
            </p>
            <div className="flex items-center gap-1 mt-2">
              {trend === 'up' && <TrendingUp className="h-3 w-3 text-emerald-600" />}
              <p className={`text-xs ${highlight ? 'text-amber-600' : 'text-gray-400'}`}>
                {subValue}
              </p>
            </div>
            {link && linkText && (
              <Link href={link} className="text-xs text-orange-600 hover:underline mt-2 inline-flex items-center gap-1">
                {linkText} <ArrowUpRight className="h-3 w-3" />
              </Link>
            )}
          </div>
          <div className="p-2 bg-gray-50 rounded-lg">
            <Icon className="h-4 w-4 text-gray-600" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Quick Action Card
function QuickActionCard({ 
  href, 
  icon: Icon, 
  title, 
  description, 
  color 
}: { 
  href: string; 
  icon: LucideIcon; 
  title: string; 
  description: string; 
  color: string;
}) {
  const colorClasses = {
    orange: "bg-orange-50 text-orange-600",
    amber: "bg-amber-50 text-amber-600",
    emerald: "bg-emerald-50 text-emerald-600",
  };

  return (
    <Link href={href}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer border-dashed border-2 border-gray-200 hover:border-gray-300">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
              <Icon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{title}</p>
              <p className="text-xs text-gray-500">{description}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

// Skeleton Component
function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <div>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <Skeleton className="h-8 w-20" />
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        <Skeleton className="col-span-2 h-64" />
        <Skeleton className="h-64" />
      </div>

      <Skeleton className="h-64" />

      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20" />
        ))}
      </div>
    </div>
  );
}