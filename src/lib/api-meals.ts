import { CreateMealInput, Meal, UpdateMealInput } from "@/types/meal";

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