"use client";

import { useEffect, useState, useRef } from "react";
import { getTrendingCategories } from "@/lib/api-categories";
import { Category } from "@/types/meal";
import { ChevronLeft, ChevronRight, UtensilsCrossed } from "lucide-react";
import Link from "next/link";

const cuisineImages: Record<string, string> = {
  "italian": "https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=400",
  "chinese": "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400",
  "indian": "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400",
  "mexican": "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400",
  "japanese": "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400",
  "thai": "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400",
  "american": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
  "mediterranean": "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400",
  "korean": "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400",
  "vietnamese": "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400",
};

const defaultCuisineImage = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400";

export default function TrendingCuisines() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const getItemsPerView = () => {
    if (typeof window === "undefined") return 7;
    const width = window.innerWidth;
    if (width < 640) return 2;
    if (width < 768) return 3;
    if (width < 1024) return 4;
    if (width < 1280) return 5;
    return 7;
  };

  const [itemsPerView, setItemsPerView] = useState(7);

  useEffect(() => {
    const handleResize = () => setItemsPerView(getItemsPerView());
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (!isHovered && categories.length > itemsPerView) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prev) => {
          const maxIndex = Math.max(0, categories.length - itemsPerView);
          return prev >= maxIndex ? 0 : prev + 1;
        });
      }, 3000);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isHovered, categories.length, itemsPerView]);

  const loadCategories = async () => {
    try {
      const data = await getTrendingCategories(12);
      setCategories(data);
    } catch (error) {
      console.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const getCuisineImage = (name: string) => {
    const key = name.toLowerCase();
    return cuisineImages[key] || defaultCuisineImage;
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    const maxIndex = Math.max(0, categories.length - itemsPerView);
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
         <div className="lg:container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
            <div className="flex gap-2">
              <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
              <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
            </div>
          </div>
          <div className="flex gap-4">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="flex-1 h-40 bg-gray-200 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) return null;

  const maxIndex = Math.max(0, categories.length - itemsPerView);
  const canSlideLeft = currentIndex > 0;
  const canSlideRight = currentIndex < maxIndex;

  return (
    <section className="py-16 bg-gray-50">
      <div className="lg:container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Trending Cuisines</h2>
            <p className="text-gray-600 mt-2">Explore popular food categories</p>
          </div>
          
          {/* Navigation Arrows */}
          <div className="flex gap-2">
            <button
              onClick={handlePrev}
              disabled={!canSlideLeft}
              className={`p-3 rounded-full border-2 transition-all ${
                canSlideLeft
                  ? "border-gray-300 hover:border-orange-600 hover:bg-orange-50 text-gray-700 hover:text-orange-600 cursor-pointer"
                  : "border-gray-200 text-gray-300 cursor-not-allowed"
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              disabled={!canSlideRight}
              className={`p-3 rounded-full border-2 transition-all ${
                canSlideRight
                  ? "border-gray-300 hover:border-orange-600 hover:bg-orange-50 text-gray-700 hover:text-orange-600 cursor-pointer"
                  : "border-gray-200 text-gray-300 cursor-not-allowed"
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel Container */}
        <div 
          ref={containerRef}
          className="relative overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div 
            className="flex gap-4 transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / itemsPerView + 1.5)}%)`,
            }}
          >
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/meals?categoryId=${category.id}`}  // Redirect to meals with filter
                className="flex-shrink-0 group"
                style={{ width: `calc(${100 / itemsPerView}% - ${(itemsPerView - 1) * 16 / itemsPerView}px)` }}
              >
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-200">
                  {/* Image */}
                  <img
                    src={getCuisineImage(category.name)}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-bold text-lg capitalize">
                      {category.name}
                    </h3>
                    <div className="flex items-center gap-2 text-white/80 text-sm mt-1">
                      <UtensilsCrossed className="w-4 h-4" />
                      <span>{category._count?.meals || 0} meals</span>
                    </div>
                  </div>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-orange-600/0 group-hover:bg-orange-600/10 transition-colors" />
                  
                  {/* Click Hint */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="px-4 py-2 bg-white/90 text-gray-900 rounded-full text-sm font-medium">
                      Browse {category.name}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Progress Dots */}
        {maxIndex > 0 && (
          <div className="flex justify-center gap-2 mt-6">
            {[...Array(maxIndex + 1)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-2 rounded-full transition-all ${
                  i === currentIndex
                    ? "w-8 bg-orange-600"
                    : "w-2 bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}