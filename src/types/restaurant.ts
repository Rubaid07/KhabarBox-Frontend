// types/restaurant.ts
export interface Restaurant {
  id: string;
  userId: string;
  restaurantName: string;
  description: string;
  address: string;
  logoUrl?: string;
  isVerified: boolean;
  openingHours: string;
  averageRating: number; 
  totalReviews: number;
  user: {
    email: string;
    name: string;
    image?: string;
    _count: {
      meals: number;
    };
  };
}

export interface RestaurantProfile {
  id: string;
  restaurantName: string;
  description?: string;
  address: string;
  logoUrl?: string;
  openingHours?: string;
  isVerified: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    name: string;
    image?: string;
    email?: string;
    phone?: string;
  };
}