"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getMealById } from "@/lib/api-meals";
import { getRestaurantById } from "@/lib/api-restaurants";
import { Meal } from "@/types/meal";
import { Restaurant } from "@/types/restaurant";
import { toast } from "sonner";
import {
  Star,
  ChevronLeft,
  ShoppingCart,
  Plus,
  Minus,
  Flame,
  Leaf,
  WheatOff,
  ChevronRight,
  UtensilsCrossed,
  BadgeCheck,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function SingleMealPage() {
  const params = useParams();
  const router = useRouter();
  const mealId = params.id as string;

  const [meal, setMeal] = useState<Meal | null>(null);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (mealId) loadData();
  }, [mealId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const mealData = await getMealById(mealId);
      setMeal(mealData);

      if (mealData.providerId) {
        const restaurantData = await getRestaurantById(mealData.providerId);
        setRestaurant(restaurantData);
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to load meal";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = () => {
    toast.success(`${quantity}x ${meal?.name} added to cart!`);
  };

  const incrementQty = () => setQuantity((prev) => prev + 1);
  const decrementQty = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const getDietaryIcon = (tag: string) => {
    const lower = tag.toLowerCase();
    if (lower.includes("veg") || lower.includes("vegetarian"))
      return <Leaf className="w-4 h-4" />;
    if (lower.includes("gluten")) return <WheatOff className="w-4 h-4" />;
    if (lower.includes("spicy")) return <Flame className="w-4 h-4" />;
    return null;
  };

  const rating = meal?.averageRating || 0;
  const reviewCount = meal?.totalReviews || 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!meal) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <UtensilsCrossed className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">Meal not found</h2>
          <Link
            href="/"
            className="text-orange-600 mt-4 inline-block hover:underline"
          >
            Browse all meals
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Simple Navigation */}
      <div className="sticky top-22 z-10 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section - Image + Basic Info */}
        <div className="bg-linear-to-br from-orange-50 to-white rounded-3xl p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Image - Small and Compact */}
            <div className="relative w-full max-w-xs aspect-4/3 shrink-0">
              {meal.imageUrl ? (
                <Image
                  src={`${meal.imageUrl}?width=400&height=300`}
                  alt={meal.name}
                  fill
                  className="object-contain "
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-orange-100 to-red-100 rounded-2xl">
                  <span className="text-5xl">🍽️</span>
                </div>
              )}

              {/* Availability Badge */}
              {!meal.isAvailable && (
                <div className="absolute -top-2 -right-2">
                  <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full shadow-lg">
                    SOLD OUT
                  </span>
                </div>
              )}
            </div>

            {/* Basic Info */}
            <div className="flex-1 text-center md:text-left">
              {restaurant && (
                <Link
                  href={`/restaurants/${restaurant.userId}`}
                  className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-2 group"
                >
                  <span className="font-medium">
                    {restaurant.restaurantName}
                  </span>
                  {restaurant.isVerified && (
                    <BadgeCheck className="w-4 h-4 text-blue-500" />
                  )}
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              )}

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                {meal.name}
              </h1>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-4">
                {/* Rating */}
                <div className="flex items-center gap-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-1 font-semibold text-gray-900">
                    {rating > 0 ? rating.toFixed(1) : "New"}
                  </span>
                  <span className="text-gray-400 text-sm">
                    ({reviewCount} reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-orange-600">
                    BDT {meal.price}
                  </span>
                </div>
              </div>

              {/* Dietary Tags */}
              {meal.dietaryTags.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  {meal.dietaryTags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-full text-sm font-medium shadow-sm"
                    >
                      {getDietaryIcon(tag)}
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Description & Reviews (2/3 width) */}
          <div className="lg:col-span-2 space-y-8 order-2 lg:order-1">
            {/* Description */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                About this meal
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {meal.description || "No description available for this meal."}
              </p>
            </div>
            {/* Reviews Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-orange-500" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Reviews ({reviewCount})
                  </h2>
                </div>
              </div>

              {meal.reviews && meal.reviews.length > 0 ? (
                <div className="space-y-4">
                  {meal.reviews.map((review) => (
                    <div
                      key={review.id}
                      className="bg-white border border-gray-200 rounded-xl p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-linear-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold shrink-0">
                          {review.customer?.name?.charAt(0) || "U"}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-semibold text-gray-900">
                              {review.customer?.name || "Anonymous"}
                            </p>
                            <span className="text-xs text-gray-400">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 mb-2">
                            {[...Array(5)].map((_, j) => (
                              <Star
                                key={j}
                                className={`w-3 h-3 ${
                                  j < review.rating
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-gray-600 text-sm">
                            {review.comment || "Great meal!"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-xl p-8 text-center">
                  <MessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">No reviews yet</p>
                </div>
              )}
            </div>
          </div>
          {/* Right Column */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4">Order Now</h3>

              {/* Quantity */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-gray-700">Quantity</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={decrementQty}
                    disabled={quantity <= 1}
                    className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-orange-100 hover:text-orange-600 disabled:opacity-50 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-semibold">
                    {quantity}
                  </span>
                  <button
                    onClick={incrementQty}
                    className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-orange-100 hover:text-orange-600 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Total */}
              <div className="flex items-center justify-between py-3 border-t border-gray-100 mb-4">
                <span className="text-gray-700">Total</span>
                <span className="text-xl font-bold text-orange-600">
                  BDT {(meal.price * quantity).toFixed(2)}
                </span>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={addToCart}
                disabled={!meal.isAvailable}
                className="w-full py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingCart className="w-5 h-5" />
                {meal.isAvailable ? "Add to Cart" : "Sold Out"}
              </button>

              {/* Restaurant Card */}
              {restaurant && (
                <Link
                  href={`/restaurants/${restaurant.userId}`}
                  className="block mt-4 pt-4 border-t border-gray-100 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-linear-to-br from-orange-100 to-orange-200 overflow-hidden shrink-0 flex items-center justify-center">
                      {restaurant.logoUrl ? (
                        <Image
                          src={restaurant.logoUrl}
                          alt={restaurant.restaurantName}
                          width={48}
                          height={48}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <span className="text-2xl">🏪</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <h4 className="font-semibold text-gray-900 truncate group-hover:text-orange-500 transition-transform">
                          {restaurant.restaurantName}
                        </h4>
                        {restaurant.isVerified && (
                          <BadgeCheck className="w-3 h-3 text-blue-500 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500 truncate">
                        {restaurant.address}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 shrink-0 group-hover:translate-x-1 transition-transform group-hover:text-orange-500" />
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
