"use client";

import { useEffect, useState } from "react";
import {
  getMyCart,
  updateCartQuantity,
  removeCartItem,
  clearCart,
} from "@/lib/api-cart";
import { CartItem, CartMeta } from "@/types/cart";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Store,
  MapPin,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [meta, setMeta] = useState<CartMeta>({ totalItems: 0, totalAmount: 0 });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const data = await getMyCart();
      setItems(data.items);
      setMeta(data.meta);
    } catch (error) {
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = async (cartId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    setUpdating(cartId);
    try {
      await updateCartQuantity(cartId, newQuantity);
      await loadCart();
    } catch (error) {
      toast.error("Failed to update quantity");
    } finally {
      setUpdating(null);
    }
  };

  const handleRemoveItem = async (cartId: string) => {
    try {
      await removeCartItem(cartId);
      await loadCart();
      toast.success("Item removed from cart");
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
      await loadCart();
      toast.success("Cart cleared");
    } catch (error) {
      toast.error("Failed to clear cart");
    }
  };

  // Group items by restaurant
  const groupedItems = items.reduce(
    (acc, item) => {
      const restaurantName =
        item.meal.provider?.providerProfile?.restaurantName ||
        "Unknown Restaurant";
      if (!acc[restaurantName]) {
        acc[restaurantName] = [];
      }
      acc[restaurantName].push(item);
      return acc;
    },
    {} as Record<string, CartItem[]>,
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="lg:container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="w-32 h-32 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-16 h-16 text-orange-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Your Cart is Empty
            </h1>
            <p className="text-gray-600 mb-8">
              Looks like you haven&apos;t added any meals yet. Browse our
              delicious menu and add your favorites!
            </p>
            <Link
              href="/meals"
              className="inline-flex items-center gap-2 px-8 py-4 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors"
            >
              Browse Meals
              <ArrowRight className="w-5 h-5" />
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <ShoppingBag className="w-8 h-8 text-orange-500" />
                Shopping Cart
              </h1>
              <p className="text-gray-600 mt-1">
                {meta.totalItems} {meta.totalItems === 1 ? "item" : "items"} in
                your cart
              </p>
            </div>
            <button
              onClick={handleClearCart}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              Clear Cart
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {Object.entries(groupedItems).map(
              ([restaurantName, restaurantItems]) => (
                <div
                  key={restaurantName}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
                >
                  {/* Restaurant Header */}
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                      <Store className="w-5 h-5 text-orange-500" />
                      <h2 className="font-semibold text-gray-900">
                        {restaurantName}
                      </h2>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="divide-y divide-gray-100">
                    {restaurantItems.map((item) => (
                      <div key={item.id} className="group">
                        {/* Main Row - Clickable */}
                        <Link
                          href={`/meals/${item.meal.id}`}
                          className="p-6 flex gap-4 hover:bg-gray-50 transition-colors block"
                        >
                          {/* Image */}
                          <div className="w-24 h-24 shrink-0 bg-gray-100 rounded-xl overflow-hidden relative">
                            {item.meal.imageUrl ? (
                              <Image
                                src={item.meal.imageUrl}
                                alt={item.meal.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform"
                                style={{ objectPosition: "center center" }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-2xl">
                                🍽️
                              </div>
                            )}
                          </div>

                          {/* Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <h3 className="font-semibold text-gray-900 text-lg group-hover:text-orange-600 transition-colors">
                                  {item.meal.name}
                                </h3>
                                <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                                  {item.meal.description}
                                </p>
                              </div>
                            </div>

                            {/* Price Info */}
                            <div className="mt-3">
                              <p className="text-lg font-bold">
                                BDT{" "}
                                {(
                                  Number(item.meal.price) * item.quantity
                                ).toFixed(0)}
                              </p>
                              <p className="text-sm text-gray-500">
                                BDT {Number(item.meal.price).toFixed(0)} each ×{" "}
                                {item.quantity}
                              </p>
                            </div>
                          </div>
                        </Link>

                        {/* Actions Row - Separate from Link */}
                        <div className="px-6 pb-6 flex items-center justify-between">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleQuantityChange(
                                  item.id,
                                  item.quantity - 1,
                                );
                              }}
                              disabled={
                                updating === item.id || item.quantity <= 1
                              }
                              className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-white cursor-pointer"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center font-semibold">
                              {updating === item.id ? "..." : item.quantity}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleQuantityChange(
                                  item.id,
                                  item.quantity + 1,
                                );
                              }}
                              disabled={updating === item.id}
                              className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-white cursor-pointer"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Remove item"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ),
            )}

            {/* Continue Shopping */}
            <Link
              href="/meals"
              className="inline-flex items-center gap-2 text-orange-600 font-medium hover:underline"
            >
              <ArrowLeft /> Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Order Summary
                </h2>

                {/* Price Breakdown */}
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({meta.totalItems} items)</span>
                    <span>BDT {meta.totalAmount.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>BDT 0</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-xl font-bold text-gray-900">
                      <span>Total</span>
                      <span>BDT {meta.totalAmount.toFixed(0)}</span>
                    </div>
                  </div>
                </div>

                {/* Checkout Button */}
                <Link href="/checkout">
                <button
                  onClick={() => router.push("/checkout")}
                  className="w-full py-4 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-5 h-5" />
                </button>
                </Link>
              </div>

              {/* Delivery Info */}
              <div className="mt-4 bg-blue-50 rounded-2xl p-4 border border-blue-100">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-blue-900">
                      Free Delivery
                    </h3>
                    <p className="text-sm text-blue-700 mt-1">
                      Enter your address at checkout to see delivery options
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
