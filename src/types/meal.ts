export interface Meal {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  dietaryTags: string[];
  isAvailable: boolean;
  providerId: string;
  categoryId?: string;
  createdAt: string;
  updatedAt: string;
  category?: Category;
  averageRating?: number;
  totalReviews?: number;
  
  reviews?: Review[];
  provider?: {
    id: string;
    name: string;
    providerProfile?: {
      restaurantName: string;
      address: string;
      logoUrl?: string;
      isVerified: boolean;
    };
  };
}

export interface Review {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
  customer: {
    id: string;
    name: string;
    image?: string;
  };
}

export interface CreateMealInput {
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  dietaryTags: string[];
  isAvailable: boolean;
  categoryId: string;
}

export interface Category {
  id: string;
  name: string;
  _count?: {
    meals: number;
  };
}

export interface UpdateMealInput {
  name?: string;
  description?: string;
  price?: number;
  imageUrl?: string;
  dietaryTags?: string[];
  isAvailable?: boolean;
  categoryId?: string;
}