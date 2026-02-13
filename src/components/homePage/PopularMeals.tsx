"use client";

import { useEffect, useState } from "react";
import { getPopularMeals } from "@/lib/api-meals";
import { Meal } from "@/types/meal";
import { toast } from "sonner";
import {
  ShoppingCart,
  Star,
  Clock,
  Flame,
  ChevronRight,
  Plus,
} from "lucide-react";
import Link from "next/link";

interface PopularMealsProps {
  onAddToCart?: (meal: Meal) => void;
}

export default function PopularMeals({ onAddToCart }: PopularMealsProps) {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState<string | null>(null);

  useEffect(() => {
    loadMeals();
  }, []);

  const loadMeals = async () => {
    try {
      setLoading(true);
      const data = await getPopularMeals(8);
      setMeals(data);
    } catch (error) {
      console.error("Failed to load meals");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (meal: Meal) => {
    if (onAddToCart) {
      onAddToCart(meal);
    }
    setAddedToCart(meal.id);
    toast.success(`${meal.name} added to cart!`);
    setTimeout(() => setAddedToCart(null), 2000);
  };

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="lg:container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-64 mt-2 animate-pulse" />
            </div>
            <div className="h-10 bg-gray-200 rounded w-32 animate-pulse" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-100 rounded-xl h-96 animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (meals.length === 0) return null;

  return (
    <section className="py-16 bg-white">
      <div className="lg:container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-6 h-6 text-orange-500" />
              <span className="text-orange-500 font-semibold text-sm uppercase tracking-wide">
                Most Ordered
              </span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Popular Meals</h2>
            <p className="text-gray-600 mt-2">
              Delicious dishes loved by our customers
            </p>
          </div>

          <Link
            href="/meals"
            className="hidden sm:flex items-center gap-2 text-orange-600 font-medium hover:text-orange-700 transition-colors group"
          >
            View All
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Meals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {meals.map((meal, index) => (
            <div
              key={meal.id}
              className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Image Container */}
              <div className="relative aspect-square bg-gray-100 overflow-hidden">
                {meal.imageUrl ? (
                  <img
                    src={meal.imageUrl}
                    alt={meal.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <span className="text-6xl">🍽️</span>
                  </div>
                )}

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  {index < 3 && (
                    <span className="px-2 py-1 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                      <Flame className="w-3 h-3" />
                      HOT
                    </span>
                  )}
                  {!meal.isAvailable && (
                    <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                      SOLD OUT
                    </span>
                  )}
                </div>

                {/* Quick Add Button */}
                <button
                  onClick={() => handleAddToCart(meal)}
                  disabled={!meal.isAvailable || addedToCart === meal.id}
                  className={`absolute bottom-3 right-3 p-3 rounded-full shadow-lg transition-all transform translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 ${
                    addedToCart === meal.id
                      ? "bg-green-500 text-white"
                      : "bg-white text-gray-900 hover:bg-orange-600 hover:text-white"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {addedToCart === meal.id ? (
                    <ShoppingCart className="w-5 h-5" />
                  ) : (
                    <Plus className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Content */}
              <div className="p-4">
                {/* Meal Name */}
                <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-1 group-hover:text-orange-600 transition-colors">
                  {meal.name}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm line-clamp-2 mb-3 h-10">
                  {meal.description ||
                    "Delicious meal prepared with fresh ingredients"}
                </p>

                {/* Tags */}
                {meal.dietaryTags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {meal.dietaryTags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-green-50 text-green-700 text-xs rounded-full font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                    {meal.dietaryTags.length > 2 && (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{meal.dietaryTags.length - 2}
                      </span>
                    )}
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-gray-900">
                      BDT {Number(meal.price)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      4.5
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      25-35 min
                    </span>
                  </div>
                </div>

                {/* Mobile Add Button */}
                <button
                  onClick={() => handleAddToCart(meal)}
                  disabled={!meal.isAvailable}
                  className="w-full mt-4 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed sm:hidden flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/meals"
            className="inline-flex items-center gap-2 text-orange-600 font-medium"
          >
            View All Meals
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
