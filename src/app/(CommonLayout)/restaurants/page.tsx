import { getAllRestaurants, getTopRatedRestaurants } from "@/lib/api-restaurants";
import { Restaurant } from "@/types/restaurant";
import { 
  Star, 
  MapPin, 
  UtensilsCrossed,
  ChevronRight,
  TrendingUp,
  Store,
  Search,
  BadgeCheck
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";

export const metadata = {
  title: "All Restaurants | Food Delivery",
  description: "Discover the best restaurants near you",
};

// Loading Skeleton
function RestaurantCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="relative h-40 bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="w-28 h-28 rounded-full bg-gray-200 animate-pulse border-4 border-white shadow-xl" />
      </div>
      <div className="p-5">
        <div className="flex items-center justify-center -mt-8 mb-4">
          <div className="h-10 w-32 bg-gray-200 rounded-full animate-pulse" />
        </div>
        <div className="text-center space-y-3">
          <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto animate-pulse" />
          <div className="h-10 bg-gray-200 rounded w-full animate-pulse" />
        </div>
        <div className="mt-4 h-12 bg-gray-200 rounded-xl animate-pulse" />
      </div>
    </div>
  );
}

function TopRatedSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200">
          <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
          <div className="w-16 h-16 rounded-full bg-gray-200 animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
            <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Restaurant Card Component
function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  const imageUrl = restaurant.logoUrl || restaurant.user?.image || "/default-restaurant.png";
  const rating = restaurant.averageRating || 0;
  const reviewCount = restaurant.totalReviews || 0;
  const mealCount = restaurant.user?._count?.meals || 0;
  console.log(restaurant);

  return (
    <Link
      href={`/restaurants/${restaurant.userId}`}
      className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 block"
    >
      {/* Cover Image Section */}
      <div className="relative h-40 bg-gradient-to-br from-orange-50 to-red-50 overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-200 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-red-200 rounded-full translate-y-1/2 -translate-x-1/2" />
        </div>

        <div className="relative z-10">
          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-xl bg-white group-hover:scale-105 transition-transform duration-300">
            <Image
              src={imageUrl}
              alt={restaurant.restaurantName}
              width={112}
              height={112}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {restaurant.isVerified && (
          <div className="absolute top-4 right-4">
            <BadgeCheck className="w-6 h-6 text-orange-600 bg-white rounded-full shadow-md" />
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-center justify-center -mt-8 mb-4">
          <div className="flex items-center gap-1 px-4 py-2 bg-white rounded-full shadow-lg border border-orange-100 z-10">
            <Star className="w-5 h-5 text-orange-500 fill-orange-500" />
            <div className="font-bold text-gray-900 text-lg">
              {rating > 0 ? rating.toFixed(1) : "New"}
            </div>
            <span className="text-gray-500 text-sm">
              ({reviewCount} reviews)
            </span>
          </div>
        </div>

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

        <div className="mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-orange-50 rounded-xl text-orange-700 font-semibold group-hover:bg-orange-100 transition-colors">
          <UtensilsCrossed className="w-5 h-5" />
          <span>{mealCount} Items Available</span>
        </div>
      </div>
    </Link>
  );
}

// Top Rated Card
function TopRatedCard({ restaurant, rank }: { restaurant: Restaurant; rank: number }) {
  const imageUrl = restaurant.logoUrl || restaurant.user?.image || "/default-restaurant.png";
  const rating = restaurant.averageRating || 0;

  return (
    <Link
      href={`/restaurants/${restaurant.userId}`}
      className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-all group"
    >
      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
        rank === 1 ? "bg-yellow-100 text-yellow-700" :
        rank === 2 ? "bg-gray-100 text-gray-700" :
        rank === 3 ? "bg-orange-100 text-orange-700" :
        "bg-gray-50 text-gray-500"
      }`}>
        {rank}
      </div>

      <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden flex-shrink-0 border-2 border-white shadow">
        <Image
          src={imageUrl}
          alt={restaurant.restaurantName}
          width={48}
          height={48}
          className="object-cover w-full h-full"
        />
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-gray-900 truncate text-sm group-hover:text-orange-600 transition-colors">
          {restaurant.restaurantName}
        </h4>
        <div className="flex items-center gap-1 mt-0.5 text-xs text-gray-500">
          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
          <span className="font-medium text-gray-900">{rating > 0 ? rating.toFixed(1) : "New"}</span>
          <span>({restaurant.totalReviews || 0})</span>
        </div>
      </div>

      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-orange-500" />
    </Link>
  );
}

// Main Content Component
async function RestaurantsContent() {
  const [restaurants, topRated] = await Promise.all([
    getAllRestaurants(),
    getTopRatedRestaurants(),
  ]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Left Column */}
      <div className="lg:col-span-3">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Store className="w-5 h-5 text-orange-500" />
            All Restaurants
            <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {restaurants.length}
            </span>
          </h2>
        </div>

        {restaurants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-200">
            <Store className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">No restaurants found</h3>
          </div>
        )}
      </div>

      {/* Right Column */}
      <div className="lg:col-span-1">
        <div className="sticky top-8">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-orange-500" />
            Top Rated
          </h2>

          <div className="bg-gray-50 rounded-2xl p-3 space-y-2">
            {topRated.length > 0 ? (
              topRated.slice(0, 5).map((restaurant, index) => (
                <TopRatedCard 
                  key={restaurant.id} 
                  restaurant={restaurant} 
                  rank={index + 1}
                />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 text-sm">
                No ratings yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AllRestaurantsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="lg:container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-orange-600 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Restaurants</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Store className="w-6 h-6 text-orange-500" />
                <span className="text-orange-500 font-semibold text-sm uppercase tracking-wide">
                  Discover
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                All Restaurants
              </h1>
              <p className="text-gray-600 mt-2">
                Find the best food from top restaurants
              </p>
            </div>

            <Link
              href="/meals"
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-colors"
            >
              <Search className="w-5 h-5" />
              Browse Meals
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content with Suspense */}
      <div className="lg:container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-6" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <RestaurantCardSkeleton key={i} />
                ))}
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mb-4" />
              <TopRatedSkeleton />
            </div>
          </div>
        }>
          <RestaurantsContent />
        </Suspense>
      </div>
    </div>
  );
}