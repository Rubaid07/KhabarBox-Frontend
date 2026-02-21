"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Loader2,
  Utensils,
  Tag,
  Store,
  ChefHat,
  Grid3X3,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { getSuggestions, SuggestionResponse } from "@/lib/api-suggestions";
import { useDebounce } from "@/hooks/use-debounce";

export function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SuggestionResponse | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const debouncedQuery = useDebounce(query, 300);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedQuery.length < 2) {
        setSuggestions(null);
        setHighlightedIndex(-1);
        return;
      }
      setIsLoading(true);
      try {
        const data = await getSuggestions(debouncedQuery);
        setSuggestions(data);
        setIsOpen(true);
        setHighlightedIndex(-1);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSuggestions();
  }, [debouncedQuery]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      const items = getAllItems();
      const totalItems = items.length;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev < totalItems - 1 ? prev + 1 : prev,
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;
        case "Enter":
          e.preventDefault();
          if (highlightedIndex >= 0) {
            handleSelectItem(items[highlightedIndex]);
          } else {
            handleSearch(query);
          }
          break;
        case "Escape":
          setIsOpen(false);
          inputRef.current?.blur();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, highlightedIndex, suggestions, query]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  type SuggestionItem =
    | {
        type: "restaurant";
        data: Exclude<SuggestionResponse["restaurants"], undefined>[number];
      }
    | {
        type: "category";
        data: Exclude<SuggestionResponse["categories"], undefined>[number];
      }
    | { type: "tag"; data: string }
    | {
        type: "meal";
        data: Exclude<SuggestionResponse["meals"], undefined>[number];
      };

  const getAllItems = (): SuggestionItem[] => {
    const items: SuggestionItem[] = [];
    if (suggestions?.restaurants?.length) {
      suggestions.restaurants.forEach((r) =>
        items.push({ type: "restaurant", data: r }),
      );
    }
    if (suggestions?.categories?.length) {
      suggestions.categories.forEach((c) =>
        items.push({ type: "category", data: c }),
      );
    }
    if (suggestions?.tags?.length) {
      suggestions.tags.forEach((t) => items.push({ type: "tag", data: t }));
    }
    if (suggestions?.meals?.length) {
      suggestions.meals.forEach((m) => items.push({ type: "meal", data: m }));
    }
    return items;
  };

  const handleSelectItem = (item: SuggestionItem) => {
    switch (item.type) {
      case "restaurant":
        handleSelect("restaurant", item.data.id, item.data.name);
        break;
      case "category":
        handleSelect("category", item.data.id, item.data.name);
        break;
      case "tag":
        handleSelect("tag", item.data, item.data);
        break;
      case "meal":
        handleSelect("meal", item.data.id, item.data.name);
        break;
    }
  };

  const handleSelect = (
    type: "meal" | "tag" | "restaurant" | "category",
    value: string,
    displayValue?: string,
  ) => {
    setIsOpen(false);
    setQuery("");
    setHighlightedIndex(-1);

    switch (type) {
      case "meal":
        router.push(`/meals/${value}`);
        break;
      case "tag":
        router.push(`/meals?tag=${encodeURIComponent(value)}`);
        break;
      case "restaurant":
        router.push(`/restaurants/${value}`);
        break;
      case "category":
        router.push(`/meals?category=${encodeURIComponent(value)}`);
        break;
    }
  };

  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setIsOpen(false);
    router.push(`/meals?search=${encodeURIComponent(searchQuery)}`);
    setQuery("");
  };

  const getItemStyle = (index: number) => {
    return index === highlightedIndex
      ? "bg-orange-100 ring-1 ring-orange-300"
      : "hover:bg-orange-50";
  };

  let currentIndex = 0;

  const hasResults =
    suggestions?.restaurants?.length ||
    suggestions?.categories?.length ||
    suggestions?.tags?.length ||
    suggestions?.meals?.length;

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative flex items-center rounded-sm overflow-hidden focus-within:ring-2 focus-within:ring-orange-500 focus-within:border-transparent transition-all">
        <Search className="absolute left-4 h-5 w-5 text-gray-400" />
        <Input
          ref={inputRef}
          type="search"
          placeholder="Search dishes, restaurants, categories or tags..."
          className="pl-12 pr-12 w-full border-none focus-visible:ring-0 h-12 text-base bg-transparent"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
        />
        {isLoading && (
          <Loader2 className="absolute right-4 h-5 w-5 animate-spin text-gray-400" />
        )}
      </div>

      {/* Suggestions Dropdown */}
      {isOpen && hasResults && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-[100] max-h-[600px] overflow-y-auto">
          {/* Restaurants Section */}
          {suggestions?.restaurants && suggestions.restaurants.length > 0 && (
            <div className="p-3 border-b border-gray-50">
              <p className="text-xs font-bold text-gray-400 uppercase px-2 mb-2 flex items-center gap-1.5">
                <Store className="h-3.5 w-3.5" /> Restaurants
              </p>
              <div className="space-y-1">
                {suggestions.restaurants.map((restaurant) => {
                  const index = currentIndex++;
                  return (
                    <button
                      key={restaurant.id}
                      onClick={() =>
                        handleSelect(
                          "restaurant",
                          restaurant.id,
                          restaurant.name,
                        )
                      }
                      className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-all ${getItemStyle(index)}`}
                    >
                      <div className="relative h-9 w-9 rounded-full overflow-hidden shrink-0 bg-gray-100 border border-gray-200">
                        {restaurant.logoUrl ? (
                          <Image
                            src={restaurant.logoUrl}
                            alt={restaurant.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <Store className="h-4 w-4 m-2.5 text-gray-400" />
                        )}
                      </div>
                      <span className="font-medium text-gray-800">
                        {restaurant.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Categories Section */}
          {suggestions?.categories && suggestions.categories.length > 0 && (
            <div className="p-3 border-b border-gray-50">
              <p className="text-xs font-bold text-gray-400 uppercase px-2 mb-2 flex items-center gap-1.5">
                <Grid3X3 className="h-3.5 w-3.5" /> Categories
              </p>
              <div className="flex flex-wrap gap-2 px-2">
                {suggestions.categories.map((category) => {
                  const index = currentIndex++;
                  return (
                    <button
                      key={category.id}
                      onClick={() =>
                        handleSelect("category", category.id, category.name)
                      }
                      className={`px-3 py-1.5 text-sm bg-blue-50 text-blue-700 rounded-full border border-blue-100 hover:bg-blue-100 transition-colors ${
                        index === highlightedIndex
                          ? "ring-2 ring-blue-400 bg-blue-100"
                          : ""
                      }`}
                    >
                      {category.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tags Section */}
          {suggestions?.tags && suggestions.tags.length > 0 && (
            <div className="p-3 border-b border-gray-50">
              <p className="text-xs font-bold text-gray-400 uppercase px-2 mb-2 flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5" /> Dietary Tags
              </p>
              <div className="flex flex-wrap gap-2 px-2">
                {suggestions.tags.map((tag) => {
                  const index = currentIndex++;
                  return (
                    <button
                      key={tag}
                      onClick={() => handleSelect("tag", tag, tag)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-sm bg-green-50 text-green-700 rounded-full border border-green-100 hover:bg-green-100 transition-colors ${
                        index === highlightedIndex
                          ? "ring-2 ring-green-400 bg-green-100"
                          : ""
                      }`}
                    >
                      <ChefHat className="h-3 w-3" />
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Meals Section */}
          {suggestions?.meals && suggestions.meals.length > 0 && (
            <div className="p-3">
              <p className="text-xs font-bold text-gray-400 uppercase px-2 mb-2 flex items-center gap-1.5">
                <Utensils className="h-3.5 w-3.5" /> Dishes
              </p>
              <div className="space-y-1">
                {suggestions.meals.map((meal) => {
                  const index = currentIndex++;
                  return (
                    <button
                      key={meal.id}
                      onClick={() => handleSelect("meal", meal.id, meal.name)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-all text-left ${getItemStyle(index)}`}
                    >
                      <div className="relative h-10 w-10 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                        {meal.imageUrl ? (
                          <Image
                            src={meal.imageUrl}
                            alt={meal.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <Utensils className="h-5 w-5 m-2.5 text-gray-400" />
                        )}
                      </div>
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="font-medium text-gray-800 truncate">
                          {meal.name}
                        </span>
                        <span className="text-xs text-gray-500 truncate">
                          {meal.restaurantName && (
                            <span className="text-orange-600">
                              {meal.restaurantName}
                            </span>
                          )}
                          {meal.price && (
                            <span className="ml-2 text-gray-400">
                              ৳{meal.price}
                            </span>
                          )}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* View All Results */}
          <div className="p-3 border-t border-gray-100 bg-gray-50">
            <button
              onClick={() => handleSearch(query)}
              className="w-full text-center text-sm text-orange-600 font-semibold hover:text-orange-700 py-2 transition-colors"
            >
              View all results for &quot;{query}&quot;
            </button>
          </div>
        </div>
      )}

      {/* No Results State */}
      {isOpen && query.length >= 2 && !isLoading && !hasResults && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-100 p-6 text-center z-100">
          <p className="text-gray-500 text-sm">
            No results found for &quot;{query}&quot;
          </p>
          <button
            onClick={() => handleSearch(query)}
            className="mt-2 text-orange-600 text-sm font-medium hover:underline"
          >
            Search anyway
          </button>
        </div>
      )}
    </div>
  );
}
