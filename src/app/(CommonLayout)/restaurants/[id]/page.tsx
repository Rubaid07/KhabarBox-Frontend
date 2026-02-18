"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getRestaurantById } from "@/lib/api-restaurants";
import { getPopularMeals } from "@/lib/api-meals";
import { Restaurant } from "@/types/restaurant";
import { Meal } from "@/types/meal";
import { toast } from "sonner";
import {
  Star,
  Bike,
  MapPin,
  BadgeCheck,
  ChevronLeft,
  Search,
  ShoppingCart,
  Mail,
  Clock3,
  UtensilsCrossed,
  Info,
  Plus,
  Minus,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function RestaurantProfilePage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    if (userId) loadData();
  }, [userId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [restaurantData, allMeals] = await Promise.all([
        getRestaurantById(userId),
        getPopularMeals(50),
      ]);

      setRestaurant(restaurantData);
      const restaurantMeals = allMeals.filter((m) => m.providerId === userId);
      setMeals(restaurantMeals);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load restaurant";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const filteredMeals = meals.filter((meal) => {
    const matchesSearch =
      meal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meal.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === "all" || meal.category?.name === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    "all",
    ...new Set(meals.map((m) => m.category?.name).filter(Boolean)),
  ];

  const rating = restaurant?.averageRating;
  const reviewCount = restaurant?.totalReviews || 0;
  console.log(restaurant);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <UtensilsCrossed className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">
            Restaurant not found
          </h2>
          <Link
            href="/"
            className="text-orange-600 mt-4 inline-block hover:underline"
          >
            Go back home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Navigation */}
      <nav className="sticky top-22 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="lg:container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="inline font-medium">Back</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative h-64 md:h-80 lg:h-96 bg-gradient-to-br from-orange-400 to-red-500">
        <div className="absolute inset-0 bg-black/20" />

        {/* Restaurant Info */}
        <div className="absolute bottom-0 left-0 right-0">
          <div className="lg:container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 md:pb-8">
            <div className="flex items-end gap-4 md:gap-6">
              {/* Logo */}
              <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-full shadow-2xl flex items-center justify-center overflow-hidden border-4 border-white shrink-0">
                {restaurant.logoUrl || restaurant.user?.image ? (
                  <img
                    src={restaurant.logoUrl || restaurant.user?.image}
                    alt={restaurant.restaurantName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl md:text-5xl">🏪</span>
                )}
              </div>

              <div className="flex-1 text-white pb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl md:text-4xl font-bold">
                    {restaurant.restaurantName}
                  </h1>
                  {restaurant.isVerified && (
                    <BadgeCheck className="w-6 h-6 md:w-8 md:h-8 text-white fill-blue-500" />
                  )}
                </div>
                <p className="text-white/90 text-sm md:text-base mt-1">
                  {restaurant.address}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Bar */}
      <div className="bg-white border-b border-gray-200 z-40">
        <div className="lg:container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center gap-4 md:gap-8 text-sm">
            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-orange-50 px-3 py-1.5 rounded-lg">
                <Star className="w-4 h-4 text-orange-500 fill-orange-500" />
                <span className="font-bold text-orange-700">
                  {rating?.toFixed(1)}
                </span>
              </div>
              <span className="text-gray-500">({reviewCount} reviews)</span>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <Bike className="w-4 h-4 text-orange-400" />
              <span>Free delivery</span>
            </div>

            {restaurant.openingHours && (
              <div className="flex items-center gap-2 text-gray-600">
                <Clock3 className="w-4 h-4 text-orange-400" />
                <span>{restaurant.openingHours}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
          {/* Sidebar */}
          <aside className="lg:w-72 shrink-0 space-y-6">
            {/* About Card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Info className="w-5 h-5 text-orange-500" />
                About
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {restaurant.description ||
                  `${restaurant.restaurantName} serves delicious food made with fresh ingredients.`}
              </p>

              <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-orange-500" />
                  </div>
                  <span className="line-clamp-2">{restaurant.address}</span>
                </div>
                {restaurant.user?.email && (
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
                      <Mail className="w-4 h-4 text-orange-500" />
                    </div>
                    <span>{restaurant.user.email}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm lg:sticky lg:top-40">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <UtensilsCrossed className="w-5 h-5 text-orange-500" />
                Categories
              </h3>
              <div className="flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat!)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                      activeCategory === cat
                        ? "bg-orange-500 text-white shadow-md"
                        : "bg-gray-50 text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                    }`}
                  >
                    {cat === "all" ? "All Items" : cat}
                    <span
                      className={`ml-2 ${activeCategory === cat ? "text-orange-100" : "text-gray-400"}`}
                    >
                      {cat === "all"
                        ? meals.length
                        : meals.filter((m) => m.category?.name === cat).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Menu Items */}
          <main className="flex-1">
            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search menu items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white shadow-sm"
                />
              </div>
            </div>

            {/* Results */}
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">
                {activeCategory === "all" ? "All Items" : activeCategory}
                <span className="text-gray-400 font-normal ml-2">
                  ({filteredMeals.length})
                </span>
              </h2>
            </div>

            {/* Meals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMeals.map((meal) => (
                <Link
                  key={meal.id}
                  href={`/meals/${meal.id}`}
                  className="bg-white rounded-2xl border border-gray-200 p-4 transition-shadow flex gap-4 group cursor-pointer"
                >
                  {/* Image */}
                  <div className="w-24 h-24 shrink-0 bg-gray-100 rounded-xl overflow-hidden relative">
                    {meal.imageUrl ? (
                      <Image
                        src={meal.imageUrl}
                        alt={meal.name}
                        fill
                        className="object-cover "
                        style={{ objectPosition: "center center" }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl">
                        🍽️
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-gray-900 line-clamp-1 group-hover:text-orange-600 transition-colors">
                          {meal.name}
                        </h4>
                        <p className="text-gray-500 text-sm line-clamp-2 mt-1">
                          {meal.description || "Delicious meal"}
                        </p>
                      </div>
                     
                    </div>

                    {/* Tags */}
                    {meal.dietaryTags?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {meal.dietaryTags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 bg-green-50 text-green-700 text-xs rounded-full font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* View Details Button */}
                    <div className="mt-3 flex items-center justify-between">
                      <button className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors flex items-center gap-1">
                        View Details
                        <ChevronLeft className="w-3 h-3 rotate-180" />
                      </button>
                       <span className="font-bold text-orange-600">
                        BDT {Number(meal.price)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
