import { getAllMeals } from "@/lib/api-meals";
import { Meal } from "@/types/meal";
import PaginationControls from "@/components/ui/pagination-controls";
import { UtensilsCrossed, Flame, ChevronRight } from "lucide-react";
import MealFilters from "@/components/meal/meal-filters";
import MealCard from "@/components/meal/meal-card";
import Link from "next/link";

interface MealsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AllMealsPage({ searchParams }: MealsPageProps) {
  const resolvedParams = await searchParams;
  const filters = {
    page: Number(resolvedParams.page) || 1,
    limit: 12,
    search: resolvedParams.search as string,
    categoryId: resolvedParams.categoryId as string,
    minPrice: resolvedParams.minPrice ? Number(resolvedParams.minPrice) : undefined,
    maxPrice: resolvedParams.maxPrice ? Number(resolvedParams.maxPrice) : undefined,
    dietaryTags: resolvedParams.dietaryTags 
      ? (resolvedParams.dietaryTags as string).split(",") 
      : [],
    sortBy: (resolvedParams.sortBy as string) || "createdAt",
    sortOrder: (resolvedParams.sortOrder as "asc" | "desc") || "desc", 
  };

  const { data: meals, metaData } = await getAllMeals(filters);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="lg:container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-orange-600 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">All Meals</span>
          </div>

          {/* Title */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Flame className="w-6 h-6 text-orange-500" />
                <span className="text-orange-500 font-semibold text-sm uppercase tracking-wide">
                  Browse Menu
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                All Meals
              </h1>
              <p className="text-gray-600 mt-2">
                Discover delicious dishes from our top restaurants
              </p>
            </div>

            {/* Results Count */}
            <p className="text-gray-500 text-sm">
              Showing <span className="font-bold text-gray-900">{meals?.length || 0}</span> of{" "}
              <span className="font-bold text-gray-900">{metaData?.total || 0}</span> meals
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-8">
          <MealFilters />
        </div>

        {meals && meals.length > 0 ? (
          <>
            {/* Meals Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {meals.map((meal: Meal, index: number) => (
                <MealCard key={meal.id} meal={meal} index={index} />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-12">
              <PaginationControls meta={metaData} />
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-200">
            <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <UtensilsCrossed className="w-12 h-12 text-orange-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No meals found</h2>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              We couldn&apos;t find any meals matching your criteria. Try adjusting your search or filters.
            </p>
            <Link
              href="/meals"
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-colors"
            >
              Clear Filters
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}