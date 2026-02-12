import { Category } from "@/types/meal";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const getTrendingCategories = async (limit: number = 10): Promise<Category[]> => {
  const response = await fetch(`${API_URL}/categories?limit=${limit}`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }

  const result = await response.json();
  const categories = Array.isArray(result) ? result : result.data;
  return categories.sort((a: Category, b: Category) => 
    (b._count?.meals || 0) - (a._count?.meals || 0)
  ).slice(0, limit);
};