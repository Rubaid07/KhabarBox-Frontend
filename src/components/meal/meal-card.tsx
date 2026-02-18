"use client";

import { addToCart } from "@/lib/api-cart";
import { Meal } from "@/types/meal";
import { 
  Star, 
  Clock, 
  ShoppingCart, 
  Flame, 
  Leaf, 
  WheatOff,
  ChevronRight,
  Plus
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

interface MealCardProps {
  meal: Meal;
  index?: number;
}

export default function MealCard({ meal, index = 0 }: MealCardProps) {
  const [added, setAdded] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
    await addToCart({ mealId: meal.id, quantity: 1 });
    
    setAdded(true);
    toast.success(`${meal.name} added to cart!`);
    setTimeout(() => setAdded(false), 2000);
  } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to add to cart";
      toast.error(message);
    }
  };

  const getDietaryIcon = (tag: string) => {
    const lower = tag.toLowerCase();
    if (lower.includes("spicy")) return <Flame className="w-3 h-3 text-red-500" />;
    if (lower.includes("veg")) return <Leaf className="w-3 h-3 text-green-500" />;
    if (lower.includes("gluten")) return <WheatOff className="w-3 h-3 text-orange-500" />;
    return null;
  };

  return (
    <Link
      href={`/meals/${meal.id}`}
      className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 block"
    >
      {/* Image Section */}
      <div className="relative aspect-4/3 bg-gray-100 overflow-hidden">
        {meal.imageUrl ? (
          <Image
            src={meal.imageUrl}
            alt={meal.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-orange-50 to-red-50">
            <span className="text-5xl">🍽️</span>
          </div>
        )}
        
        {/* HOT Badge */}
        {index < 3 && (
          <div className="absolute top-3 left-3 z-10">
            <span className="px-2 py-1 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
              <Flame className="w-3 h-3" />
              HOT
            </span>
          </div>
        )}

        {/* Sold Out Badge */}
        {!meal.isAvailable && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
            <span className="px-3 py-1 bg-gray-800 text-white text-sm font-bold rounded-full">
              SOLD OUT
            </span>
          </div>
        )}

        {/* Quick Add Button */}
        <button
          onClick={handleAddToCart}
          disabled={!meal.isAvailable}
          className={`absolute bottom-3 right-3 p-3 rounded-full shadow-lg transition-all transform translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 z-20 ${
            added
              ? "bg-green-500 text-white"
              : "bg-white text-gray-900 hover:bg-orange-500 hover:text-white"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {added ? <ShoppingCart className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
        </button>
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Restaurant Name */}
        {meal.provider?.providerProfile?.restaurantName && (
          <p className="text-xs text-orange-600 font-medium mb-1 flex items-center gap-1">
            {meal.provider.providerProfile.restaurantName}
            <ChevronRight className="w-3 h-3" />
          </p>
        )}

        <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1 group-hover:text-orange-600 transition-colors">
          {meal.name}
        </h3>

        <p className="text-gray-500 text-sm line-clamp-2 mb-3 h-10">
          {meal.description || "Delicious meal prepared with fresh ingredients"}
        </p>

        {/* Tags */}
        {meal.dietaryTags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {meal.dietaryTags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full font-medium"
              >
                {getDietaryIcon(tag)}
                <span className="capitalize">{tag}</span>
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <span className="text-xl font-bold text-orange-600">
            BDT {Number(meal.price).toFixed(0)}
          </span>

          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="font-medium text-gray-900">{meal.averageRating || "4.5"}</span>
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              25-35m
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}