const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  image?: string;
  phone?: string;
  role: string;
  restaurantName?: string;
  restaurantDescription?: string;
  restaurantAddress?: string;
  logoUrl?: string;
  openingHours?: string; 
}

export const getMyProfile = async (): Promise<UserProfile> => {
  const res = await fetch(`${API_URL}/users/me`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch profile");
  const json = await res.json();
  const rawData = json.data;

  // 🔥 ম্যাপিং: ডাটাবেস থেকে আসা নামগুলোকে ফ্রন্টএন্ডের নামের সাথে মিলিয়ে দেওয়া
  return {
    ...rawData,
    restaurantDescription: rawData.description || "", // DB 'description' -> Frontend 'restaurantDescription'
    restaurantAddress: rawData.address || "",         // DB 'address' -> Frontend 'restaurantAddress'
    openingHours: rawData.openingHours || "",         // Null হলে খালি স্ট্রিং দেওয়া যাতে ইনপুট ফিল্ডে এরর না আসে
  };
};

export const updateProfile = async (data: Partial<UserProfile>): Promise<UserProfile> => {
  // 🔥 রিভার্স ম্যাপিং: ফ্রন্টএন্ডের নামগুলোকে আবার ডাটাবেসের নামের মতো সাজানো
  const payload = {
    name: data.name,
    image: data.image,
    phone: data.phone,
    restaurantName: data.restaurantName,
    description: data.restaurantDescription, // 'restaurantDescription' থেকে 'description' এ ফেরত নেওয়া
    address: data.restaurantAddress,         // 'restaurantAddress' থেকে 'address' এ ফেরত নেওয়া
    logoUrl: data.logoUrl,
    openingHours: data.openingHours,
  };

  const res = await fetch(`${API_URL}/users/me`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to update profile");
  const json = await res.json();
  const updatedData = json.data;

  // আপডেট হওয়ার পর আবার ম্যাপ করে রিটার্ন করা যাতে UI সাথে সাথে আপডেট হয়
  return {
    ...updatedData,
    restaurantDescription: updatedData.description || "",
    restaurantAddress: updatedData.address || "",
    openingHours: updatedData.openingHours || "",
  };
};