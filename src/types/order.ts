export interface CreateOrderInput {
  items: Array<{
    mealId: string;
    quantity: number;
  }>;
  deliveryAddress: string;
  phone: string;
  notes?: string;
}

export interface Order {
  id: string;
  customerId: string;
  status: 'PLACED' | 'PREPARING' | 'READY' | 'DELIVERED' | 'CANCELLED';
  totalAmount: number | string;
  deliveryAddress: string;
  phone?: string;
  notes?: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  orderItems: Array<{
    id: string;
    quantity: number;
    price: number | string;
    priceAtTime?: number | string;
    meal: {
      id: string;
      name: string;
      imageUrl?: string;
      provider?: {
        providerProfile?: {
          restaurantName: string;
        };
      };
    };
  }>;
  items?: Array<any>;
  customer?: {
    id: string;
    name: string;
    phone?: string;
  };
  provider?: {
    id: string;
    providerProfile?: {
      restaurantName: string;
      address?: string;
      logoUrl?: string;
    };
  };
}