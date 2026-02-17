import { CreateMealInput, Meal, MealFilterParams, UpdateMealInput } from "@/types/meal";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

// Get providers meals
export const getProviderMeals = async (): Promise<Meal[]> => {
  const token = getToken();
  
  const response = await fetch(`${API_URL}/provider/dashboard/meals`, {
    headers: {
      "Authorization": token ? `Bearer ${token}` : "",
    },
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to fetch meals");
  }

  const result = await response.json();
  return Array.isArray(result) ? result : result.data;
};

// Get single meal
export const getMealById = async (id: string): Promise<Meal> => {
  const response = await fetch(`${API_URL}/meals/${id}`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch meal");
  }
  
  return response.json();
};

// Create meal
export const createMeal = async (mealData: CreateMealInput): Promise<Meal> => {
  const token = getToken();
  
  const response = await fetch(`${API_URL}/meals`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token ? `Bearer ${token}` : "",
    },
    credentials: "include",
    body: JSON.stringify(mealData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to create meal");
  }

  return response.json();
};

// Update meal
export const updateMeal = async (id: string, mealData: UpdateMealInput): Promise<Meal> => {
  const token = getToken();
  
  const response = await fetch(`${API_URL}/meals/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token ? `Bearer ${token}` : "",
    },
    credentials: "include",
    body: JSON.stringify(mealData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to update meal");
  }

  return response.json();
};

// Delete meal
export const deleteMeal = async (id: string): Promise<void> => {
  const token = getToken();
  
  const response = await fetch(`${API_URL}/meals/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": token ? `Bearer ${token}` : "",
    },
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to delete meal");
  }
};

// Get categories
export const getCategories = async () => {
  const response = await fetch(`${API_URL}/categories`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }
  
  return response.json();
};

// popular meals
export const getPopularMeals = async (limit: number = 8): Promise<Meal[]> => {
  const response = await fetch(
    `${API_URL}/meals?sortBy=createdAt&sortOrder=desc&limit=${limit}&isAvailable=true`
  );
  
  if (!response.ok) {
    throw new Error("Failed to fetch popular meals");
  }

  const result = await response.json();
  return Array.isArray(result) ? result : result.data;
};

export const getAllMeals = async (filters: MealFilterParams) => {
  const query = new URLSearchParams();

  query.set("page", (filters.page || 1).toString());
  query.set("limit", (filters.limit || 12).toString());

  if (filters.search) query.set("search", filters.search);
  if (filters.categoryId) query.set("categoryId", filters.categoryId);

  if (filters.minPrice !== undefined && filters.minPrice !== null) {
    query.set("minPrice", filters.minPrice.toString());
  }
  if (filters.maxPrice !== undefined && filters.maxPrice !== null) {
    query.set("maxPrice", filters.maxPrice.toString());
  }

  if (filters.dietaryTags && filters.dietaryTags.length > 0) {
    query.set("dietaryTags", filters.dietaryTags.join(","));
  }

  if (filters.sortBy) query.set("sortBy", filters.sortBy);
  if (filters.sortOrder) query.set("sortOrder", filters.sortOrder);

  if (filters.isAvailable !== undefined) {
    query.set("isAvailable", filters.isAvailable.toString());
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const url = `${baseUrl}/meals?${query.toString()}`;
  
  console.log("Fetching from:", url);

  const res = await fetch(url, {
    cache: "no-store",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    console.error("Backend Error:", errorData);
    throw new Error(errorData.message || "Failed to fetch meals");
  }

  return res.json();
};