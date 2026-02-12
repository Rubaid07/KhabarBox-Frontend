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