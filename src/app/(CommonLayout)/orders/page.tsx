"use client";

import { useEffect, useState } from "react";
import { getMyOrders, cancelOrder } from "@/lib/api-orders";
import { Order } from "@/types/order";
import {
  Package,
  CheckCircle2,
  ChefHat,
  Bike,
  XCircle,
  ChevronRight,
  MapPin,
  Phone,
  RefreshCw,
  Filter,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";

type OrderStatus = "PLACED" | "PREPARING" | "READY" | "DELIVERED" | "CANCELLED";

const statusConfig: Record<
  OrderStatus,
  {
    label: string;
    color: string;
    bgColor: string;
    icon: React.ReactNode;
    description: string;
  }
> = {
  PLACED: {
    label: "Order Placed",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    icon: <Package className="w-5 h-5" />,
    description: "Your order has been received",
  },
  PREPARING: {
    label: "Preparing",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    icon: <ChefHat className="w-5 h-5" />,
    description: "Restaurant is preparing your food",
  },
  READY: {
    label: "Ready for Pickup",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    icon: <CheckCircle2 className="w-5 h-5" />,
    description: "Your order is ready!",
  },
  DELIVERED: {
    label: "Delivered",
    color: "text-green-600",
    bgColor: "bg-green-50",
    icon: <Bike className="w-5 h-5" />,
    description: "Enjoy your meal!",
  },
  CANCELLED: {
    label: "Cancelled",
    color: "text-red-600",
    bgColor: "bg-red-50",
    icon: <XCircle className="w-5 h-5" />,
    description: "Order was cancelled",
  },
};

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<OrderStatus | "ALL">("ALL");
  const [cancelling, setCancelling] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadOrders = async () => {
    try {
      const data = await getMyOrders();

      if (Array.isArray(data)) {
        const sortedData = [...data].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        setOrders(sortedData);
      } else {
        setOrders([]);
      }
    } catch (error) {
      toast.error("Failed to load orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (orderId: string) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;

    setCancelling(orderId);
    try {
      await cancelOrder(orderId);
      toast.success("Order cancelled successfully");
      await loadOrders();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to cancel order";
      toast.error(message);
    } finally {
      setCancelling(null);
    }
  };

  const filteredOrders = Array.isArray(orders)
    ? filter === "ALL"
      ? orders
      : orders.filter((o) => o.status === filter)
    : [];

  const getStatusProgress = (status: OrderStatus) => {
    const steps = ["PLACED", "PREPARING", "READY", "DELIVERED"];
    const currentIndex = steps.indexOf(status);
    if (status === "CANCELLED") return -1;
    return currentIndex;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="lg:container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="w-32 h-32 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-16 h-16 text-orange-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              No Orders Yet
            </h1>
            <p className="text-gray-600 mb-8">
              You haven&apos;t placed any orders yet. Browse our delicious menu
              and place your first order!
            </p>
            <Link
              href="/meals"
              className="inline-flex items-center gap-2 px-8 py-4 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors"
            >
              Browse Menu
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="lg:container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <Package className="w-8 h-8 text-orange-500" />
                My Orders
              </h1>
              <p className="text-gray-600 mt-1">Track and manage your orders</p>
            </div>
            <button
              onClick={loadOrders}
              className="flex items-center gap-2 px-4 py-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="lg:container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto py-4 scrollbar-hide">
            <button
              onClick={() => setFilter("ALL")}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filter === "ALL"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All Orders ({orders.length})
            </button>
            {(
              [
                "PLACED",
                "PREPARING",
                "READY",
                "DELIVERED",
                "CANCELLED",
              ] as OrderStatus[]
            ).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  filter === status
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {statusConfig[status].label} (
                {orders.filter((o) => o.status === status).length})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="lg:container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {filteredOrders.map((order) => {
            const status = statusConfig[order.status];
            const progress = getStatusProgress(order.status);

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Order Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-xl ${status.bgColor} flex items-center justify-center ${status.color}`}
                      >
                        {status.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-gray-900">
                            Order #{order.id.slice(-8).toUpperCase()}
                          </h3>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${status.bgColor} ${status.color}`}
                          >
                            {status.label}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {status.description}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-orange-600">
                        BDT {Number(order.totalAmount).toFixed(0)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {order.status !== "CANCELLED" && (
                    <div className="mt-6">
                      <div className="flex justify-between mb-2">
                        {[
                          "Order Placed",
                          "Preparing",
                          "Ready",
                          "Delivered",
                        ].map((step, idx) => (
                          <div
                            key={step}
                            className={`text-xs font-medium ${
                              idx <= progress
                                ? "text-orange-600"
                                : "text-gray-400"
                            }`}
                          >
                            {step}
                          </div>
                        ))}
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-orange-500 transition-all duration-500"
                          style={{ width: `${((progress + 1) / 4) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Order Items */}
                <div className="p-6 bg-gray-50">
                  <div className="space-y-4">
                    {order.items?.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="w-16 h-16 bg-white rounded-lg overflow-hidden shrink-0 border border-gray-200">
                          {item.meal.imageUrl ? (
                            <Image
                              src={item.meal.imageUrl}
                              alt={item.meal.name}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl">
                              🍽️
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">
                            {item.meal.name}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {item.quantity} × BDT {Number(item.price)}
                          </p>
                          {item.meal.provider?.providerProfile
                            ?.restaurantName && (
                            <p className="text-xs text-orange-600 mt-1">
                              {
                                item.meal.provider.providerProfile
                                  .restaurantName
                              }
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            BDT{" "}
                            {(Number(item.price) * item.quantity).toFixed(0)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Footer */}
                <div className="p-6 border-t border-gray-100">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-orange-500" />
                        <span className="line-clamp-1">
                          {order.deliveryAddress}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-orange-500" />
                        <span>{order.phone}</span>
                      </div>
                      {order.notes && (
                        <div className="flex items-start gap-2">
                          <span className="text-gray-400">Note:</span>
                          <span className="text-gray-600">{order.notes}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3">
                      {order.status === "PLACED" && (
                        <button
                          onClick={() => handleCancel(order.id)}
                          disabled={cancelling === order.id}
                          className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors disabled:opacity-50"
                        >
                          {cancelling === order.id
                            ? "Cancelling..."
                            : "Cancel Order"}
                        </button>
                      )}
                      <Link
                        href={`/orders/${order.id}`}
                        className="px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center gap-2"
                      >
                        View Details
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-16">
            <Filter className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No orders found
            </h3>
            <p className="text-gray-500">Try changing the filter</p>
          </div>
        )}
      </div>
    </div>
  );
}
