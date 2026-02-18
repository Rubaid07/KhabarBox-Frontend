export interface CartItem {
  id: string;
  customerId: string;
  mealId: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  meal: {
    id: string;
    name: string;
    description?: string;
    price: number;
    imageUrl?: string;
    provider: {
      providerProfile?: {
        restaurantName: string;
      };
    };
  };
}

export interface CartMeta {
  totalItems: number;
  totalAmount: number;
}

export interface CartResponse {
  items: CartItem[];
  meta: CartMeta;
}

export interface AddToCartInput {
  mealId: string;
  quantity: number;
}