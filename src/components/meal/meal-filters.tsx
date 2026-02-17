"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Hash, Search, SlidersHorizontal, X, Clock, TrendingUp, ChevronRight } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";
import { useState, useRef, useEffect } from "react";
import { getSuggestions, SuggestionResponse } from "@/lib/api-suggestions";
import Link from "next/link";

// Recent searches from localStorage
const getRecentSearches = (): string[] => {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem("recentSearches") || "[]");
};

const addRecentSearch = (term: string) => {
  if (typeof window === "undefined" || !term.trim()) return;
  const recent = getRecentSearches();
  const updated = [term, ...recent.filter(t => t !== term)].slice(0, 5);
  localStorage.setItem("recentSearches", JSON.stringify(updated));
};

export default function MealFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<SuggestionResponse>({ meals: [], tags: [] });
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState(searchParams.get("search") || "");
  const [tagValue, setTagValue] = useState(searchParams.get("dietaryTags") || "");
  
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Load recent searches on mount
  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch suggestions with debounce
  const fetchSuggestions = useDebouncedCallback(async (term: string) => {
    if (term.length < 2) {
      setSuggestions({ meals: [], tags: [] });
      return;
    }
    setIsLoading(true);
    try {
      const data = await getSuggestions(term);
      setSuggestions(data);
    } catch (error) {
      console.error("Suggestion fetch failed:", error);
    } finally {
      setIsLoading(false);
    }
  }, 300);

  const handleSearchInput = (value: string) => {
    setSearchValue(value);
    setShowSuggestions(true);
    setActiveIndex(-1);
    fetchSuggestions(value);
  };

  const executeSearch = (term: string) => {
    if (!term.trim()) return;
    
    addRecentSearch(term);
    setRecentSearches(getRecentSearches());
    setShowSuggestions(false);
    
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    params.set("search", term);
    setSearchValue(term);
    
    router.push(`/meals?${params.toString()}`);
  };

  const executeTagSearch = (tag: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    params.set("dietaryTags", tag);
    setTagValue(tag);
    setShowSuggestions(false);
    router.push(`/meals?${params.toString()}`);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const items = [
      ...recentSearches.map(r => ({ type: "recent" as const, value: r })),
      ...suggestions.meals.map(m => ({ type: "meal" as const, value: m.name, id: m.id })),
      ...suggestions.tags.map(t => ({ type: "tag" as const, value: t })),
    ];

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex(prev => (prev < items.length - 1 ? prev + 1 : prev));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex(prev => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (activeIndex >= 0 && items[activeIndex]) {
          const item = items[activeIndex];
          if (item.type === "meal") {
            router.push(`/meals/${item.id}`);
          } else if (item.type === "tag") {
            executeTagSearch(item.value);
          } else {
            executeSearch(item.value);
          }
        } else {
          executeSearch(searchValue);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        break;
    }
  };

  const updateFilters = (updates: Record<string, string | null> | string, value?: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (typeof updates === "string") {
      if (value) params.set(updates, value);
      else params.delete(updates);
    } else {
      Object.entries(updates).forEach(([key, val]) => {
        if (val) params.set(key, val);
        else params.delete(key);
      });
    }
    params.set("page", "1");
    router.push(`/meals?${params.toString()}`);
  };

  const hasFilters =
    searchParams.get("search") ||
    searchParams.get("categoryId") ||
    searchParams.get("minPrice") ||
    searchParams.get("maxPrice") ||
    searchParams.get("dietaryTags");

  // Combine all suggestion items for rendering
  const allSuggestions = [
    ...recentSearches.map(r => ({ type: "recent" as const, value: r })),
    ...suggestions.meals.map(m => ({ type: "meal" as const, value: m.name, id: m.id, image: m.imageUrl })),
    ...suggestions.tags.map(t => ({ type: "tag" as const, value: t })),
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
          {/* Main Search with Suggestions */}
          <div className="relative" ref={searchRef}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search meals..."
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
              value={searchValue}
              onChange={(e) => handleSearchInput(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={handleKeyDown}
            />
            
            {/* Suggestions Dropdown */}
            {showSuggestions && (searchValue.length >= 2 || recentSearches.length > 0) && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                {/* Loading State */}
                {isLoading && (
                  <div className="p-4 text-center text-gray-500">
                    <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    Searching...
                  </div>
                )}

                {/* Recent Searches Section */}
                {!isLoading && recentSearches.length > 0 && searchValue.length < 2 && (
                  <div className="p-2">
                    <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      Recent Searches
                    </div>
                    {recentSearches.map((term, idx) => (
                      <button
                        key={term}
                        onClick={() => executeSearch(term)}
                        className={`w-full px-3 py-2 text-left rounded-lg flex items-center gap-3 transition-colors ${
                          activeIndex === idx ? "bg-orange-50 text-orange-700" : "hover:bg-gray-50"
                        }`}
                      >
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="flex-1">{term}</span>
                        <span className="text-xs text-gray-400">Search</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Suggestions Section */}
                {!isLoading && allSuggestions.filter(s => s.type !== "recent" || searchValue.length >= 2).length > 0 && (
                  <div className="p-2">
                    {/* Meals */}
                    {suggestions.meals.length > 0 && (
                      <>
                        <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          Meals
                        </div>
                        {suggestions.meals.map((meal, idx) => {
                          const globalIdx = recentSearches.length + idx;
                          return (
                            <Link
                              key={meal.id}
                              href={`/meals/${meal.id}`}
                              onClick={() => setShowSuggestions(false)}
                              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                                activeIndex === globalIdx ? "bg-orange-50" : "hover:bg-gray-50"
                              }`}
                            >
                              {meal.imageUrl ? (
                                <img src={meal.imageUrl} alt="" className="w-10 h-10 rounded-lg object-cover" />
                              ) : (
                                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-lg">
                                  🍽️
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 truncate">{meal.name}</p>
                                <p className="text-xs text-gray-500">View meal</p>
                              </div>
                              <ChevronRight className="w-4 h-4 text-gray-400" />
                            </Link>
                          );
                        })}
                      </>
                    )}

                    {/* Tags */}
                    {suggestions.tags.length > 0 && (
                      <>
                        <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2 mt-2">
                          <TrendingUp className="w-3 h-3" />
                          Popular Tags
                        </div>
                        {suggestions.tags.map((tag, idx) => {
                          const globalIdx = recentSearches.length + suggestions.meals.length + idx;
                          return (
                            <button
                              key={tag}
                              onClick={() => executeTagSearch(tag)}
                              className={`w-full px-3 py-2 text-left rounded-lg flex items-center gap-3 transition-colors ${
                                activeIndex === globalIdx ? "bg-orange-50 text-orange-700" : "hover:bg-gray-50"
                              }`}
                            >
                              <Hash className="w-4 h-4 text-orange-500" />
                              <span className="capitalize">{tag}</span>
                              <span className="text-xs text-gray-400 ml-auto">Filter by tag</span>
                            </button>
                          );
                        })}
                      </>
                    )}
                  </div>
                )}

                {/* No Results */}
                {!isLoading && searchValue.length >= 2 && allSuggestions.length === 0 && (
                  <div className="p-4 text-center text-gray-500">
                    <p>No results found for &quot;{searchValue}&quot;</p>
                    <button
                      onClick={() => executeSearch(searchValue)}
                      className="mt-2 text-orange-600 hover:underline"
                    >
                      Search anyway
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Tag Search - Simple version without suggestions */}
          <div className="relative">
            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Filter by tags (e.g. Spicy, Vegan)"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
              value={tagValue}
              onChange={(e) => setTagValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  executeTagSearch(tagValue);
                }
              }}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors ${
              showAdvanced || hasFilters
                ? "bg-orange-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <SlidersHorizontal className="w-5 h-5" />
            <span>Filters</span>
          </button>

          {hasFilters && (
            <button
              onClick={() => {
                router.push("/meals");
                setSearchValue("");
                setTagValue("");
              }}
              className="px-4 py-3 text-gray-500 hover:text-red-500 font-medium transition-colors"
              title="Clear all filters"
            >
              <X className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>

      {showAdvanced && (
        <div className="pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-2">
          {/* Price Range */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Price Range (BDT)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
                defaultValue={searchParams.get("minPrice") || ""}
                onBlur={(e) => updateFilters("minPrice", e.target.value)}
              />
              <span className="text-gray-400">-</span>
              <input
                type="number"
                placeholder="Max"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
                defaultValue={searchParams.get("maxPrice") || ""}
                onBlur={(e) => updateFilters("maxPrice", e.target.value)}
              />
            </div>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Sort By
            </label>
            <select
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
              value={`${searchParams.get("sortBy") || "createdAt"}_${searchParams.get("sortOrder") || "desc"}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split("_");
                updateFilters({ sortBy, sortOrder });
              }}
            >
              <option value="createdAt_desc">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}