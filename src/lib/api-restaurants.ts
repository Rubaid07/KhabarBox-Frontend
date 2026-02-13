import { Restaurant } from "@/types/restaurant";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const getFeaturedRestaurants = async (): Promise<Restaurant[]> => {
  const response = await fetch(`${API_URL}/provider/profile`);

  if (!response.ok) {
    throw new Error("Failed to fetch restaurants");
  }

  const result = await response.json();
  return result.success ? result.data : [];
};

export const getRestaurantById = async (userId: string): Promise<Restaurant> => {
  const response = await fetch(`${API_URL}/provider/profile/${userId}`);
  
  if (!response.ok) throw new Error("Restaurant not found");
  
  const result = await response.json();
  return result.data;
};

export const getTopRatedRestaurants = async (): Promise<Restaurant[]> => {
  const response = await fetch(`${API_URL}/provider/profile/top-rated`);
  const result = await response.json();
  return result.success ? result.data : [];
};