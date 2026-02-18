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
  totalAmount: number;
  deliveryAddress: string;
  phone: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  items: Array<{
    id: string;
    quantity: number;
    price: number;
    meal: {
      id: string;
      name: string;
      imageUrl?: string;
    };
  }>;
}