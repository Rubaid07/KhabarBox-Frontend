"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMyCart, clearCart } from "@/lib/api-cart"; // Add clearCart
import { createOrder } from "@/lib/api-orders";
import { CartItem } from "@/types/cart";
import { 
  MapPin, 
  Phone, 
  FileText, 
  CreditCard, 
  Truck, 
  ShieldCheck,
  ChevronLeft,
  Package,
  Clock
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";

export default function CheckoutPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Form states
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const data = await getMyCart();
      if (data.items.length === 0) {
        toast.error("Your cart is empty");
        router.push("/cart");
        return;
      }
      setItems(data.items);
    } catch (error) {
      toast.error("Failed to load cart");
      router.push("/cart");
    } finally {
      setLoading(false);
    }
  };

  const getTotalAmount = () => {
    return items.reduce((sum, item) => sum + (Number(item.meal.price) * item.quantity), 0);
  };

  const getTotalItems = () => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!deliveryAddress.trim()) {
      toast.error("Please enter delivery address");
      return;
    }
    if (!phone.trim()) {
      toast.error("Please enter phone number");
      return;
    }

    setSubmitting(true);
    try {
      const orderData = {
        items: items.map(item => ({
          mealId: item.mealId,
          quantity: item.quantity,
        })),
        deliveryAddress,
        phone,
        notes: notes || undefined,
      };

      const order = await createOrder(orderData);
      
      // Clear cart after successful order
      try {
        await clearCart();
      } catch (e) {
        console.log("Cart clear failed, but order placed");
      }
      
      toast.success("Order placed successfully!");
      router.push(`/orders/${order.id}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to place order";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="lg:container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Link 
              href="/cart"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
              <p className="text-gray-600 text-sm">Complete your order</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Details */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
                <Truck className="w-5 h-5 text-orange-500" />
                Delivery Details
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Delivery Address *
                  </label>
                  <textarea
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Enter your full address (house, road, area, city)"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                    rows={3}
                    required
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FileText className="w-4 h-4 inline mr-1" />
                    Order Notes (Optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any special instructions for delivery..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                    rows={2}
                  />
                </div>

                {/* Submit Button - Mobile Only */}
                <div className="lg:hidden">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Placing Order...
                      </>
                    ) : (
                      <>
                        Place Order
                        <CreditCard className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                <CreditCard className="w-5 h-5 text-orange-500" />
                Payment Method
              </h2>
              
              <div className="space-y-3">
                <label className="flex items-center gap-4 p-4 border-2 border-orange-500 bg-orange-50 rounded-xl cursor-pointer">
                  <div className="w-5 h-5 rounded-full border-2 border-orange-500 bg-orange-500 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Cash on Delivery</p>
                    <p className="text-sm text-gray-500">Pay when you receive</p>
                  </div>
                  <span className="text-2xl">💵</span>
                </label>

                <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl opacity-50">
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Online Payment</p>
                    <p className="text-sm text-gray-500">Coming soon</p>
                  </div>
                  <span className="text-2xl">💳</span>
                </div>
              </div>
            </div>

            {/* Security Note */}
            <div className="flex items-center gap-3 text-sm text-gray-500 bg-blue-50 p-4 rounded-xl">
              <ShieldCheck className="w-5 h-5 text-blue-500" />
              <p>Your personal information is secure and encrypted</p>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Order Items */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                  <Package className="w-5 h-5 text-orange-500" />
                  Order Summary
                  <span className="text-sm font-normal text-gray-500">
                    ({getTotalItems()} items)
                  </span>
                </h2>

                <div className="space-y-4 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {item.meal.imageUrl ? (
                          <Image
                            src={item.meal.imageUrl}
                            alt={item.meal.name}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xl">
                            🍽️
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 text-sm line-clamp-1">
                          {item.meal.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {item.quantity} × BDT {Number(item.meal.price)}
                        </p>
                        <p className="font-semibold text-orange-600 text-sm">
                          BDT {(Number(item.meal.price) * item.quantity).toFixed(0)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 mt-4 pt-4 space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span>BDT {getTotalAmount().toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Delivery Fee</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Tax</span>
                    <span>BDT 0</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>BDT {getTotalAmount().toFixed(0)}</span>
                  </div>
                </div>
              </div>

              {/* Delivery Estimate */}
              <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="font-semibold text-gray-900">Estimated Delivery</p>
                    <p className="text-sm text-gray-600">30-45 minutes</p>
                  </div>
                </div>
              </div>

              {/* Place Order Button - Desktop */}
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="hidden lg:flex w-full py-4 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  <>
                    Place Order
                    <CreditCard className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}