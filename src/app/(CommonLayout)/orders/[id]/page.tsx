"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getOrderById } from "@/lib/api-orders";
import { Order } from "@/types/order";
import {
  Package,
  ChevronLeft,
  MapPin,
  Phone,
  CheckCircle2,
  ChefHat,
  Bike,
  XCircle,
  FileText,
  Printer,
  Download,
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
    icon: <Package className="w-6 h-6" />,
    description: "Your order has been received and is being processed",
  },
  PREPARING: {
    label: "Preparing",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    icon: <ChefHat className="w-6 h-6" />,
    description: "Restaurant is preparing your delicious food",
  },
  READY: {
    label: "Ready for Pickup",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    icon: <CheckCircle2 className="w-6 h-6" />,
    description: "Your order is ready! Head to the restaurant",
  },
  DELIVERED: {
    label: "Delivered",
    color: "text-green-600",
    bgColor: "bg-green-50",
    icon: <Bike className="w-6 h-6" />,
    description: "Enjoy your meal! Thank you for ordering",
  },
  CANCELLED: {
    label: "Cancelled",
    color: "text-red-600",
    bgColor: "bg-red-50",
    icon: <XCircle className="w-6 h-6" />,
    description: "This order was cancelled",
  },
};

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    try {
      const data = await getOrderById(orderId);
      setOrder(data);
    } catch (error) {
      toast.error("Failed to load order");
      router.push("/orders");
    } finally {
      setLoading(false);
    }
  };

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

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Order not found
          </h2>
          <Link
            href="/orders"
            className="text-orange-600 hover:underline inline-flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to orders
          </Link>
        </div>
      </div>
    );
  }

  const status = statusConfig[order.status];
  const progress = getStatusProgress(order.status);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="lg:container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Link
              href="/orders"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Order #{order.id.slice(-8).toUpperCase()}
              </h1>
              <p className="text-gray-600 text-sm">
                Placed on{" "}
                {new Date(order.createdAt).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Card */}
            <div
              className={`${status.bgColor} rounded-2xl p-6 border-2 border-dashed border-current`}
            >
              <div className="flex items-center gap-4">
                <div className={`${status.color}`}>{status.icon}</div>
                <div>
                  <h2 className={`text-xl font-bold ${status.color}`}>
                    {status.label}
                  </h2>
                  <p className="text-gray-600 mt-1">{status.description}</p>
                </div>
              </div>

              {/* Progress Bar */}
              {order.status !== "CANCELLED" && (
                <div className="mt-6">
                  <div className="flex justify-between mb-2">
                    {["Order Placed", "Preparing", "Ready", "Delivered"].map(
                      (step, idx) => (
                        <div
                          key={step}
                          className={`text-xs font-medium ${
                            idx <= progress ? "text-gray-900" : "text-gray-400"
                          }`}
                        >
                          {step}
                        </div>
                      ),
                    )}
                  </div>
                  <div className="h-3 bg-white rounded-full overflow-hidden border border-gray-200">
                    <div
                      className="h-full bg-orange-500 transition-all duration-700 ease-out"
                      style={{ width: `${((progress + 1) / 4) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-orange-500" />
                Order Items
              </h3>
              <div className="space-y-4">
                {order.orderItems?.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-20 h-20 bg-white rounded-lg overflow-hidden border border-gray-200">
                      {item.meal.imageUrl ? (
                        <Image
                          src={item.meal.imageUrl}
                          alt={item.meal.name}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">
                          🍽️
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-sm line-clamp-1">
                        {item.meal.name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {item.quantity} × BDT{" "}
                        {Number(item.priceAtTime || item.price)}
                      </p>
                    </div>
                    <p className="font-semibold text-orange-600 text-sm">
                      BDT{" "}
                      {(
                        Number(item.priceAtTime || item.price) * item.quantity
                      ).toFixed(0)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Info */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-orange-500" />
                Delivery Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      Delivery Address
                    </p>
                    <p className="text-gray-600 text-sm mt-1">
                      {order.deliveryAddress}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Contact Number</p>
                    <p className="text-gray-600 text-sm mt-1">{order.phone}</p>
                  </div>
                </div>
                {order.notes && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Order Notes</p>
                      <p className="text-gray-600 text-sm mt-1">
                        {order.notes}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Order Summary */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Order Summary
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>
                      BDT{" "}
                      {order.orderItems
                        ?.reduce(
                          (sum, item) =>
                            sum +
                            Number(item.priceAtTime || item.price) *
                              item.quantity,
                          0,
                        )
                        .toFixed(0)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>BDT 0</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>BDT {Number(order.totalAmount).toFixed(0)}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Actions
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={() => window.print()}
                    className="w-full py-3 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <Printer className="w-4 h-4" />
                    Print Receipt
                  </button>
                  <button className="w-full py-3 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" />
                    Download Invoice
                  </button>
                </div>
              </div>

              {/* Help */}
              <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
                <h3 className="font-bold text-gray-900 mb-2">Need Help?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  If you have any issues with your order, please contact us.
                </p>
                <Link
                  href="/contact"
                  className="text-orange-600 font-medium hover:underline text-sm"
                >
                  Contact Support →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
