"use client";

import { useEffect, useState } from "react";
import { getTopRatedRestaurants } from "@/lib/api-restaurants";
import { Restaurant } from "@/types/restaurant";
import { toast } from "sonner";
import {
  Star,
  Clock,
  Bike,
  BadgeCheck,
  ChevronRight,
  MapPin,
  UtensilsCrossed,
  TrendingUp,
  Flame,
} from "lucide-react";
import Link from "next/link";

export default function FeaturedRestaurants() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    try {
      setLoading(true);
      const data = await getTopRatedRestaurants();
      setRestaurants(data);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load restaurants";
      toast.error(message);
      console.error("Error loading restaurants:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="lg:container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="h-8 bg-gray-200 rounded w-64 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-80 mt-2 animate-pulse" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl h-96 animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (restaurants.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="lg:container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
            <UtensilsCrossed className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No restaurants yet
            </h3>
            <p className="text-gray-500">
              Check back later for top rated restaurants
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="lg:container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-orange-600" />
              </div>
              <span className="text-orange-600 font-semibold text-sm uppercase tracking-wide">
                Top Rated
              </span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              Featured Restaurants
            </h2>
            <p className="text-gray-600 mt-2">
              Highest rated restaurants by customers
            </p>
          </div>

          <Link
            href="/restaurants"
            className="hidden sm:flex items-center gap-2 text-orange-600 font-medium hover:text-orange-700 transition-colors group"
          >
            View All
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Restaurants Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant, index) => {
            const imageUrl = restaurant.logoUrl || restaurant.user?.image;
            const rating = restaurant.user?.averageRating || 0;
            const reviewCount = restaurant.user?.totalReviews || 0;
            const mealCount = restaurant.user?._count?.meals || 0;

            return (
              <Link
                key={restaurant.id}
                href={`/restaurants/${restaurant.userId}`}
                className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Top Rated Badge */}
                {index < 3 && (
                  <div className="absolute top-4 left-4 z-10 flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold rounded-full shadow-lg">
                    <Flame className="w-3 h-3" />#{index + 1} TOP RATED
                  </div>
                )}

                {/* Cover Image Section */}
                <div className="relative h-40 bg-gradient-to-br from-orange-50 to-red-50 overflow-hidden flex items-center justify-center">
                  {/* Decorative Background */}
                  <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-200 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-red-200 rounded-full translate-y-1/2 -translate-x-1/2" />
                  </div>

                  {/* Rounded Restaurant Logo */}
                  <div className="relative z-10">
                    <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-xl bg-white group-hover:scale-105 transition-transform duration-300">
                      <img
                        src={imageUrl}
                        alt={restaurant.restaurantName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Verified Badge */}
                  {restaurant.isVerified && (
                    <div className="absolute top-4 right-4">
                      <BadgeCheck className="w-6 h-6 text-orange-600 bg-white rounded-full shadow-md" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  {/* Rating Badge */}
                  <div className="flex items-center justify-center -mt-8 mb-4 ">
                    <div className="flex items-center gap-1 px-4 py-2 bg-white rounded-full shadow-lg border border-orange-100 z-50">
                      <Star className="w-5 h-5 text-orange-500 fill-orange-500" />
                      <span className="font-bold text-gray-900 text-lg">
                        {rating.toFixed(1)}
                      </span>
                      <span className="text-gray-500 text-sm">
                        ({reviewCount} reviews)
                      </span>
                    </div>
                  </div>

                  {/* Restaurant Info */}
                  <div className="text-center">
                    <h3 className="font-bold text-xl text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-1">
                      {restaurant.restaurantName}
                    </h3>

                    <div className="flex items-center justify-center gap-1 text-gray-500 text-sm mt-2">
                      <MapPin className="w-4 h-4 text-orange-400" />
                      <span className="line-clamp-1">{restaurant.address}</span>
                    </div>

                    <p className="text-gray-600 text-sm text-center mt-3 line-clamp-2 h-10">
                      {restaurant.description ||
                        "Delicious food prepared with love and fresh ingredients"}
                    </p>
                  </div>

                  {/* Stats Row */}
                  <div className="flex items-center justify-center gap-6 mt-5 pt-5 border-t border-gray-100">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Clock className="w-4 h-4 text-orange-400" />
                      <span>25-40 min</span>
                    </div>

                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Bike className="w-4 h-4 text-orange-400" />
                      <span>Free</span>
                    </div>
                  </div>

                  {/* Meals Available */}
                  <div className="mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-orange-50 rounded-xl text-orange-700 font-semibold group-hover:bg-orange-100 transition-colors">
                    <UtensilsCrossed className="w-5 h-5" />
                    <span>{mealCount} Items Available</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Mobile View All */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/restaurants"
            className="inline-flex items-center gap-2 text-orange-600 font-medium"
          >
            View All Restaurants
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
