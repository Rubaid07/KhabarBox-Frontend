"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Package,
  DollarSign,
  Store,
  TrendingUp,
  Clock,
  ChevronRight,
  ShoppingBag,
  UserCheck,
  PieChart as PieChartIcon,
  LucideIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  getDashboardStats,
  getRecentOrders,
  getTopProviders,
  getOrderStatusBreakdown,
  getRevenueTrend,
} from "@/lib/api-admin";
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Stats {
  users: { total: number; providers: number; customers: number };
  orders: { total: number; pending: number };
  revenue: number;
}

interface RecentOrder {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  customer: { name: string };
  provider: { providerProfile: { restaurantName: string } };
}

interface TopProvider {
  id: string;
  restaurantName: string;
  logoUrl?: string;
  totalRevenue: number;
  totalOrders: number;
}

interface StatusBreakdown {
  name: string;
  value: number;
  color: string;
}

interface RevenueData {
  date: string;
  revenue: number;
  orders: number;
}

const COLORS = ["#3b82f6", "#f59e0b", "#8b5cf6", "#10b981", "#ef4444"];

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [topProviders, setTopProviders] = useState<TopProvider[]>([]);
  const [statusBreakdown, setStatusBreakdown] = useState<StatusBreakdown[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<7 | 30 | 90>(30);

  useEffect(() => {
    loadData();
  }, [timeRange]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsData, ordersData, providersData, statusData, revenueData] = await Promise.all([
        getDashboardStats(),
        getRecentOrders(5),
        getTopProviders(5),
        getOrderStatusBreakdown(),
        getRevenueTrend(timeRange),
      ]);
      
      setStats(statsData);
      setRecentOrders(ordersData);
      setTopProviders(providersData);
      setStatusBreakdown(statusData);
      setRevenueData(revenueData);
    } catch (error) {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PLACED: "bg-blue-50 text-blue-700 border-blue-200",
      PREPARING: "bg-amber-50 text-amber-700 border-amber-200",
      READY: "bg-purple-50 text-purple-700 border-purple-200",
      DELIVERED: "bg-emerald-50 text-emerald-700 border-emerald-200",
      CANCELLED: "bg-rose-50 text-rose-700 border-rose-200",
    };
    return colors[status] || "bg-gray-50 text-gray-700 border-gray-200";
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  const completionRate = stats?.orders.total
    ? Math.round(((stats.orders.total - (stats.orders.pending || 0)) / stats.orders.total) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Welcome back! Here&#39;s what&#39;s happening with your platform.
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={loadData}
          className="gap-2"
        >
          <TrendingUp className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={stats?.users.total.toLocaleString() || "0"}
          icon={Users}
          subValue={`${stats?.users.customers || 0} customers • ${stats?.users.providers || 0} providers`}
        />
        <StatCard
          title="Total Orders"
          value={stats?.orders.total.toLocaleString() || "0"}
          icon={Package}
          subValue={`${stats?.orders.pending || 0} pending`}
        />
        <StatCard
          title="Total Revenue"
          value={`BDT ${(stats?.revenue || 0).toLocaleString()}`}
          icon={DollarSign}
          subValue="Last 30 days"
        />
        <StatCard
          title="Restaurants"
          value={stats?.users.providers.toLocaleString() || "0"}
          icon={Store}
          subValue="Active partners"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-medium">Revenue Trend</CardTitle>
              <p className="text-xs text-gray-500 mt-1">
                Daily revenue for the last {timeRange} days
              </p>
            </div>
            <Tabs value={timeRange.toString()} onValueChange={(v) => setTimeRange(Number(v) as 7 | 30 | 90)}>
              <TabsList className="h-8">
                <TabsTrigger value="7" className="text-xs px-3">7d</TabsTrigger>
                <TabsTrigger value="30" className="text-xs px-3">30d</TabsTrigger>
                <TabsTrigger value="90" className="text-xs px-3">90d</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return `${date.getDate()}/${date.getMonth() + 1}`;
                    }}
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis 
                    tickFormatter={(value) => `BDT ${value/1000}k`}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`BDT ${value.toLocaleString()}`, 'Revenue']}
                    labelFormatter={(label) => new Date(label).toLocaleDateString()}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    fill="url(#revenueGradient)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Order Status Pie Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Order Status</CardTitle>
            <p className="text-xs text-gray-500 mt-1">
              Distribution by current status
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {statusBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {statusBreakdown.slice(0, 4).map((status) => (
                <div key={status.name} className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: status.color || COLORS[0] }} />
                  <span className="text-xs text-gray-600">{status.name}</span>
                  <span className="text-xs font-medium ml-auto">{status.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-medium">Recent Orders</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/orders" className="gap-1 text-sm">
                View all <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentOrders.length > 0 ? (
              <div className="space-y-3">
                {recentOrders.map((order) => (
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
                          {order.customer?.name || "Customer"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {order.provider?.providerProfile?.restaurantName}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-900">
                        BDT {order.totalAmount}
                      </span>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-sm text-gray-500">
                No recent orders
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Restaurants */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-medium">Top Restaurants</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/restaurants" className="gap-1 text-sm">
                View all <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {topProviders.length > 0 ? (
              <div className="space-y-3">
                {topProviders.map((provider, index) => (
                  <div
                    key={provider.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 bg-white rounded-full flex items-center justify-center text-sm font-medium text-gray-700">
                        #{index + 1}
                      </div>
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={provider.logoUrl} />
                        <AvatarFallback className="bg-gray-200 text-gray-600">
                          {provider.restaurantName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {provider.restaurantName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {provider.totalOrders} orders
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        BDT {provider.totalRevenue.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-sm text-gray-500">
                No data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <UserCheck className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Active Customers</p>
                <p className="text-lg font-semibold text-gray-900">
                  {stats?.users.customers || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-50 rounded-lg">
                <Clock className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Pending Orders</p>
                <p className="text-lg font-semibold text-amber-600">
                  {stats?.orders.pending || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 rounded-lg">
                <ShoppingBag className="h-4 w-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Completion Rate</p>
                <p className="text-lg font-semibold text-emerald-600">
                  {completionRate}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  subValue 
}: { 
  title: string; 
  value: string; 
  icon: LucideIcon; 
  subValue: string;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-gray-500 mb-1">{title}</p>
            <p className="text-xl font-semibold text-gray-900">{value}</p>
            <p className="text-xs text-gray-400 mt-2">{subValue}</p>
          </div>
          <div className="p-2 bg-gray-50 rounded-lg">
            <Icon className="h-4 w-4 text-gray-600" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <div>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48 mt-2" />
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

      <div className="grid grid-cols-2 gap-6">
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16" />
        ))}
      </div>
    </div>
  );
}