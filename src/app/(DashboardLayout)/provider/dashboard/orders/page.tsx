"use client";

import { useEffect, useState } from "react";
import {
  Package,
  CheckCircle,
  XCircle,
  ChefHat,
  Truck,
  Search,
  Filter,
  Phone,
  MapPin,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  getProviderOrders,
  updateOrderStatus,
  ProviderOrder,
} from "@/lib/api-provider";
import { formatPrice, formatDate } from "@/lib/utils";

const statusConfig = {
  PLACED: {
    label: "New Order",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: Package,
    actions: ["PREPARING", "CANCELLED"],
  },
  PREPARING: {
    label: "Preparing",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: ChefHat,
    actions: ["READY", "CANCELLED"],
  },
  READY: {
    label: "Ready",
    color: "bg-purple-100 text-purple-800 border-purple-200",
    icon: CheckCircle,
    actions: ["DELIVERED"],
  },
  DELIVERED: {
    label: "Delivered",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: Truck,
    actions: [],
  },
  CANCELLED: {
    label: "Cancelled",
    color: "bg-red-100 text-red-800 border-red-200",
    icon: XCircle,
    actions: [],
  },
};

export default function ProviderOrdersPage() {
  const [orders, setOrders] = useState<ProviderOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await getProviderOrders();
      setOrders(data);
    } catch (error) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success(`Order marked as ${newStatus}`);
      loadOrders(); // Refresh
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = filterStatus === "ALL" || order.status === filterStatus;
    const matchesSearch =
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Group by status for tabs
  const orderCounts = {
    ALL: orders.length,
    PLACED: orders.filter((o) => o.status === "PLACED").length,
    PREPARING: orders.filter((o) => o.status === "PREPARING").length,
    READY: orders.filter((o) => o.status === "READY").length,
    DELIVERED: orders.filter((o) => o.status === "DELIVERED").length,
    CANCELLED: orders.filter((o) => o.status === "CANCELLED").length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-500">Manage and track your orders</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "New Orders", value: orderCounts.PLACED, color: "bg-blue-50" },
          { label: "Preparing", value: orderCounts.PREPARING, color: "bg-yellow-50" },
          { label: "Ready", value: orderCounts.READY, color: "bg-purple-50" },
          { label: "Delivered Today", value: orderCounts.DELIVERED, color: "bg-green-50" },
        ].map((stat) => (
          <Card key={stat.label} className={stat.color}>
            <CardContent className="p-4">
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by customer or order ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Orders ({orderCounts.ALL})</SelectItem>
            <SelectItem value="PLACED">New ({orderCounts.PLACED})</SelectItem>
            <SelectItem value="PREPARING">Preparing ({orderCounts.PREPARING})</SelectItem>
            <SelectItem value="READY">Ready ({orderCounts.READY})</SelectItem>
            <SelectItem value="DELIVERED">Delivered ({orderCounts.DELIVERED})</SelectItem>
            <SelectItem value="CANCELLED">Cancelled ({orderCounts.CANCELLED})</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-gray-500">
              <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No orders found</p>
            </CardContent>
          </Card>
        ) : (
          filteredOrders.map((order) => {
            const config = statusConfig[order.status as keyof typeof statusConfig];
            const StatusIcon = config.icon;

            return (
              <Card key={order.id} className="overflow-hidden">
                <CardContent className="p-0">
                  {/* Order Header */}
                  <div className="p-4 border-b bg-gray-50/50 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${config.color}`}>
                        <StatusIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900">
                            #{order.id.slice(-8)}
                          </span>
                          <Badge className={config.color}>{config.label}</Badge>
                        </div>
                        <p className="text-sm text-gray-500">
                          {formatDate(order.createdAt)} • {order.orderItems.length} items
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{formatPrice(order.totalAmount)}</p>
                      <p className="text-xs text-gray-500">{order.paymentMethod}</p>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="p-4 border-b">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">{order.customer.name}</span>
                      </div>
                      {order.customer.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span>{order.customer.phone}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-start gap-2 mt-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                      <span>{order.deliveryAddress}</span>
                    </div>
                    {order.notes && (
                      <p className="mt-2 text-sm text-gray-500 italic">
                        Note: {order.notes}
                      </p>
                    )}
                  </div>

                  {/* Order Items */}
                  <div className="p-4">
                    <div className="space-y-2">
                      {order.orderItems.map((item) => (
                        <div key={item.id} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-3">
                            <span className="font-medium text-gray-900">
                              {item.quantity}x
                            </span>
                            <span>{item.meal.name}</span>
                          </div>
                          <span className="text-gray-600">
                            {formatPrice(Number(item.priceAtTime) * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  {config.actions.length > 0 && (
                    <div className="p-4 border-t bg-gray-50 flex gap-2">
                      {config.actions.map((action) => (
                        <Button
                          key={action}
                          size="sm"
                          variant={action === "CANCELLED" ? "destructive" : "default"}
                          className={
                            action === "PREPARING"
                              ? "bg-yellow-600 hover:bg-yellow-700"
                              : action === "READY"
                              ? "bg-purple-600 hover:bg-purple-700"
                              : action === "DELIVERED"
                              ? "bg-green-600 hover:bg-green-700"
                              : ""
                          }
                          onClick={() => handleStatusUpdate(order.id, action)}
                        >
                          {action === "PREPARING" && "Start Preparing"}
                          {action === "READY" && "Mark Ready"}
                          {action === "DELIVERED" && "Mark Delivered"}
                          {action === "CANCELLED" && "Cancel Order"}
                        </Button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}