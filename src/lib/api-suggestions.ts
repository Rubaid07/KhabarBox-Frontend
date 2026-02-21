const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// ✅ Updated interface matching backend
export interface SuggestionResponse {
  meals: Array<{
    id: string;
    name: string;
    imageUrl?: string;
    restaurantName?: string;
    price?: number;
  }>;
  tags: string[];
  restaurants: Array<{
    id: string;
    name: string;
    logoUrl?: string;
  }>;
  categories?: Array<{
    id: string;
    name: string;
  }>;
}

// Simple in-memory cache
const cache = new Map<string, { data: SuggestionResponse; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const getSuggestions = async (query: string): Promise<SuggestionResponse> => {
  if (!query || query.length < 2) return { meals: [], tags: [], restaurants: [] };
  
  // Check cache
  const cached = cache.get(query);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  const res = await fetch(
    `${API_URL}/meals/suggestions?query=${encodeURIComponent(query)}`
  );
  
  if (!res.ok) throw new Error("Failed to fetch suggestions");
  
  const data = await res.json();
  cache.set(query, { data, timestamp: Date.now() });
  return data;
};