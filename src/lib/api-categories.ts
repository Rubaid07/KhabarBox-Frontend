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

export const getAllCategories = async (): Promise<Category[]> => {
  const response = await fetch(`${API_URL}/categories`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }

  const result = await response.json();
  return result.success ? result.data : [];
};

export const getCategoryById = async (id: string): Promise<Category> => {
  const response = await fetch(`${API_URL}/categories/${id}`);
  
  if (!response.ok) throw new Error("Category not found");
  
  const result = await response.json();
  return result.data;
};