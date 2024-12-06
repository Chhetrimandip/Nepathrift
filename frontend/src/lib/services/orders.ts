import { Product } from "./products"

export interface Order {
  id: string;
  userId: string;
  items: {
    productId: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  shippingInfo: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    province: string;
  };
  status: 'pending' | 'paid' | 'failed' | 'delivered';
  paymentDetails?: {
    method: 'esewa';
    transactionId?: string;
    refId?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export const ordersService = {
  create: async (orderData: Omit<Order, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    return response.json();
  },

  verify: async (orderId: string, refId: string) => {
    const response = await fetch(`/api/orders/${orderId}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refId }),
    });
    return response.json();
  },

  getById: async (orderId: string) => {
    const response = await fetch(`/api/orders/${orderId}`);
    return response.json();
  },
} 