"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Store,
  Search,
  MoreHorizontal,
  CheckCircle,
  Eye,
  UtensilsCrossed,
  MapPin,
  Mail,
  Phone,
  RefreshCw,
  TrendingUp,
  ShieldCheck,
  Ban,
  Check,
  ShoppingBag,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface UserFilterOptions {
  limit?: number;
  page?: number;
  role?: string;
  status?: string;
  [key: string]: string | number | undefined;
}

const getAllUsers = async (options: UserFilterOptions) => {
  const cleanOptions = Object.fromEntries(
    Object.entries(options)
      .filter(([_, v]) => v !== undefined)
      .map(([k, v]) => [k, String(v)])
  );

  const params = new URLSearchParams(cleanOptions).toString();
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/admin/users?${params}`,
    {
      credentials: "include",
    },
  );
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
};

const getProviderStats = async (providerId: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/provider/dashboard/stats`,
    {
      credentials: "include",
      headers: {
        "x-provider-id": providerId,
      },
    },
  );
  if (!res.ok) throw new Error("Failed to fetch stats");
  return res.json();
};

const updateUserStatus = async (userId: string, status: string) => {
  const endpoint = status === "ACTIVE" ? "activate" : "suspend";
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/admin/users/${userId}/${endpoint}`,
    {
      method: "PATCH",
      credentials: "include",
    },
  );
  if (!res.ok) throw new Error("Failed to update status");
  return res.json();
};

interface Provider {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: string;
  createdAt: string;
  providerProfile?: {
    restaurantName?: string;
    address?: string;
    logoUrl?: string;
    isVerified?: boolean;
    description?: string;
    openingHours?: string;
  };
  _count?: {
    meals: number;
    orders: number;
  };
  stats?: {
    totalOrders: number;
    totalRevenue: number;
    pendingOrders: number;
    totalMeals: number;
    todayOrders: number;
    weeklyRevenue: number;
  };
}

export default function AdminRestaurantsPage() {
  const router = useRouter();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingStats, setLoadingStats] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    try {
      setLoading(true);
      const result = await getAllUsers({ limit: 100 });
      const onlyProviders = result.data.filter(
      (u: { role: string }) => u.role === "PROVIDER",
    ) as Provider[];
      setProviders(onlyProviders);
      onlyProviders.forEach((provider: Provider) => {
        loadProviderStats(provider.id);
      });
    } catch (error) {
      toast.error("Failed to load restaurants");
    } finally {
      setLoading(false);
    }
  };

  const loadProviderStats = async (providerId: string) => {
    try {
      setLoadingStats((prev) => ({ ...prev, [providerId]: true }));
      const result = await getProviderStats(providerId);
      if (result.success) {
        setProviders((prev) =>
          prev.map((p) =>
            p.id === providerId ? { ...p, stats: result.data } : p,
          ),
        );
      }
    } catch (error) {
      console.error("Failed to load stats for provider:", providerId);
    } finally {
      setLoadingStats((prev) => ({ ...prev, [providerId]: false }));
    }
  };

  const handleStatusChange = async (providerId: string, newStatus: string) => {
    try {
      await updateUserStatus(providerId, newStatus);
      toast.success(
        `Restaurant ${newStatus === "ACTIVE" ? "activated" : "suspended"}`,
      );
      loadProviders();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const filteredProviders = providers.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.providerProfile?.restaurantName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      p.providerProfile?.address
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || p.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: providers.length,
    active: providers.filter((p) => p.status === "ACTIVE").length,
    suspended: providers.filter((p) => p.status === "SUSPENDED").length,
    verified: providers.filter((p) => p.providerProfile?.isVerified).length,
  };

  if (loading) {
    return <RestaurantsSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Restaurants</h1>
          <p className="text-gray-500 mt-1">Manage all restaurant partners</p>
        </div>
        <Button
          onClick={() => loadProviders()}
          variant="outline"
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Store className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active</p>
              <p className="text-2xl font-bold text-green-600">
                {stats.active}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <ShieldCheck className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Verified</p>
              <p className="text-2xl font-bold text-yellow-600">
                {stats.verified}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <Ban className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Suspended</p>
              <p className="text-2xl font-bold text-red-600">
                {stats.suspended}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by restaurant, owner, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="w-full md:w-[200px]">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="SUSPENDED">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing{" "}
          <span className="font-medium text-gray-900">
            {filteredProviders.length}
          </span>{" "}
          restaurants
        </p>
        <Badge variant="outline" className="px-3 py-1">
          {filteredProviders.length} of {providers.length}
        </Badge>
      </div>

      {/* Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProviders.map((provider) => (
          <div
            key={provider.id}
            className="group hover:shadow-lg transition-all bg-card text-card-foreground flex flex-col gap-6 rounded-xl border shadow-sm"
          >
            <CardContent className="p-0">
              {/* Cover Image Placeholder */}
              <div className="h-24 bg-linear-to-r from-orange-500 to-orange-600 rounded-t-xl relative">
                <div className="absolute -bottom-8 left-4">
                  <Avatar className="h-16 w-16 border-4 border-white shadow-lg">
                    <AvatarImage src={provider.providerProfile?.logoUrl} />
                    <AvatarFallback className="bg-orange-100 text-orange-600 text-xl">
                      {provider.providerProfile?.restaurantName?.charAt(0) ||
                        provider.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>

              <div className="pt-10 p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-gray-900">
                        {provider.providerProfile?.restaurantName ||
                          "Unnamed Restaurant"}
                      </h3>
                      {provider.providerProfile?.isVerified && (
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 border-green-200"
                        >
                          <Check className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      by {provider.name}
                    </p>
                  </div>
                  <Badge
                    className={cn(
                      "capitalize",
                      provider.status === "ACTIVE"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800",
                    )}
                  >
                    {provider.status}
                  </Badge>
                </div>

                <p className="text-sm text-gray-600 flex items-center gap-1 mt-2">
                  <MapPin className="h-3 w-3 text-gray-400" />
                  {provider.providerProfile?.address || "Address not set"}
                </p>

                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                  <Mail className="h-3 w-3 text-gray-400" />
                  {provider.email}
                </p>

                {provider.phone && (
                  <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                    <Phone className="h-3 w-3 text-gray-400" />
                    {provider.phone}
                  </p>
                )}

                {/* Stats Section */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="grid grid-cols-2 gap-3">
                    {/* Meals Count */}
                    <div className="bg-orange-50 rounded-lg p-2 text-center">
                      <UtensilsCrossed className="h-4 w-4 text-orange-500 mx-auto mb-1" />
                      <p className="text-xs text-gray-500">Meals</p>
                      {loadingStats[provider.id] ? (
                        <div className="flex justify-center">
                          <div className="h-5 w-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                      ) : (
                        <p className="text-lg font-bold text-gray-900">
                          {provider.stats?.totalMeals || 0}
                        </p>
                      )}
                    </div>

                    {/* Total Orders */}
                    <div className="bg-blue-50 rounded-lg p-2 text-center">
                      <ShoppingBag className="h-4 w-4 text-blue-500 mx-auto mb-1" />
                      <p className="text-xs text-gray-500">Total Orders</p>
                      {loadingStats[provider.id] ? (
                        <div className="flex justify-center">
                          <div className="h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                      ) : (
                        <p className="text-lg font-bold text-gray-900">
                          {provider.stats?.totalOrders || 0}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Additional Stats Row */}
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    {/* Today's Orders */}
                    <div className="bg-green-50 rounded-lg p-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Today</span>
                        {loadingStats[provider.id] ? (
                          <div className="h-3 w-3 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <span className="text-sm font-bold text-green-600">
                            {provider.stats?.todayOrders || 0}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-1">orders</p>
                    </div>

                    {/* Pending Orders */}
                    <div className="bg-yellow-50 rounded-lg p-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Pending</span>
                        {loadingStats[provider.id] ? (
                          <div className="h-3 w-3 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <span className="text-sm font-bold text-yellow-600">
                            {provider.stats?.pendingOrders || 0}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-1">orders</p>
                    </div>
                  </div>

                  {/* Revenue Stats */}
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 flex items-center gap-1">
                        <DollarSign className="h-3 w-3 text-gray-400" />
                        Total Revenue
                      </span>
                      {loadingStats[provider.id] ? (
                        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                      ) : (
                        <span className="font-bold text-gray-900">
                          ৳
                          {Number(provider.stats?.totalRevenue || 0).toFixed(2)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-sm mt-1">
                      <span className="text-gray-500 flex items-center gap-1">
                        <TrendingUp className="h-3 w-3 text-gray-400" />
                        Weekly
                      </span>
                      {loadingStats[provider.id] ? (
                        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                      ) : (
                        <span className="font-medium text-green-600">
                          +৳
                          {Number(provider.stats?.weeklyRevenue || 0).toFixed(
                            2,
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() =>
                      router.push(`/restaurants/${provider.id}`)
                    }
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon" className="h-9 w-9">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>

                      <DropdownMenuSeparator />

                      {provider.status === "ACTIVE" ? (
                        <DropdownMenuItem
                          onClick={() =>
                            handleStatusChange(provider.id, "SUSPENDED")
                          }
                          className="text-red-600 cursor-pointer"
                        >
                          <Ban className="h-4 w-4 mr-2" />
                          Suspend Restaurant
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          onClick={() =>
                            handleStatusChange(provider.id, "ACTIVE")
                          }
                          className="text-green-600"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Activate Restaurant
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProviders.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Store className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No restaurants found
            </h3>
            <p className="text-gray-500">
              {searchQuery
                ? "Try adjusting your search or filters"
                : "No restaurants have registered yet"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function RestaurantsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-24" />
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>

      <Skeleton className="h-12" />

      <div className="grid grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-96" />
        ))}
      </div>
    </div>
  );
}
