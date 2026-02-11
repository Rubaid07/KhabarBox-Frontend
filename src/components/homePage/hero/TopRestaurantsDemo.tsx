"use client"

import { AnimatedList } from "@/components/ui/animated-list"
import { cn } from "@/lib/utils"
import { Star } from "lucide-react"

interface Restaurant {
  name: string
  cuisine: string
  rating: number
  orders: string
  image: string
}

const restaurants = [
  {
    name: "Bella Italia Kitchen",
    cuisine: "Italian Cuisine",
    rating: 4.9,
    orders: "2.5k orders",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=100&h=100&fit=crop",
  },
  {
    name: "Tokyo Sushi Bar",
    cuisine: "Japanese Sushi",
    rating: 4.8,
    orders: "1.8k orders",
    image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=100&h=100&fit=crop",
  },
  {
    name: "Spice Garden",
    cuisine: "Indian Curry",
    rating: 4.7,
    orders: "3.2k orders",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=100&h=100&fit=crop",
  },
  {
    name: "Burger Paradise",
    cuisine: "American Fast Food",
    rating: 4.9,
    orders: "4.1k orders",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100&h=100&fit=crop",
  },
  {
    name: "La Paella House",
    cuisine: "Spanish Tapas",
    rating: 4.6,
    orders: "1.5k orders",
    image: "https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=100&h=100&fit=crop",
  },
]

const RestaurantNotification = ({ name, cuisine, rating, orders, image }: Restaurant) => {
  return (
    <figure
      className={cn(
        "relative w-full cursor-pointer overflow-hidden rounded-2xl p-4",
        "border border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
        "transition-all duration-200 ease-in-out hover:scale-[1.02]",
        "shadow-sm hover:shadow-md"
      )}
    >
      <div className="flex flex-row items-center gap-3">
        {/* Restaurant Image */}
        <div className="flex h-12 w-12 items-center justify-center rounded-xl overflow-hidden ring-2 ring-gray-100">
          <img 
            src={image} 
            alt={name}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Restaurant Info */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <figcaption className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white">
            <span className="truncate">{name}</span>
            <span className="inline-flex items-center gap-0.5 rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-semibold text-yellow-800">
              <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
              {rating}
            </span>
          </figcaption>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {cuisine}
          </p>
        </div>

        {/* Orders Badge */}
        <div className="text-right">
          <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
            {orders}
          </span>
        </div>
      </div>
    </figure>
  )
}

export function TopRestaurantsDemo({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative flex max-h-[260px] min-h-[260px] w-full flex-col overflow-hidden",
        className
      )}
    >
      <AnimatedList delay={2500}>
        {restaurants.map((restaurant, idx) => (
          <RestaurantNotification {...restaurant} key={idx} />
        ))}
      </AnimatedList>
    </div>
  )
}