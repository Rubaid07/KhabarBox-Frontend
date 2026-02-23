const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  image?: string;
  phone?: string;
  role: string;
  // Provider only
  restaurantName?: string;
  restaurantDescription?: string;
  restaurantAddress?: string;
  logoUrl?: string;
}

export const getMyProfile = async (): Promise<UserProfile> => {
  const res = await fetch(`${API_URL}/users/me`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch profile");
  const json = await res.json();
  return json.data;
};

export const updateProfile = async (data: Partial<UserProfile>): Promise<UserProfile> => {
  const res = await fetch(`${API_URL}/users/me`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update profile");
  const json = await res.json();
  return json.data;
};