import { Category } from "@/types/meal";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface CreateCategoryInput {
  name: string;
  description?: string;
  icon?: string;
}

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

export const createCategory = async (data: CreateCategoryInput): Promise<Category> => {
  const response = await fetch(`${API_URL}/categories`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create category");
  }

  const result = await response.json();
  return result.data;
};

export const updateCategory = async (
  id: string, 
  data: CreateCategoryInput
): Promise<Category> => {
  const response = await fetch(`${API_URL}/categories/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update category");
  }

  const result = await response.json();
  return result.data;
};

export const deleteCategory = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/categories/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete category");
  }
};