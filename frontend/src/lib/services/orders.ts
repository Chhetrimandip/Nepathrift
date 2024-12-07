import { getFunctions, httpsCallable } from 'firebase/functions'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { getAuth } from 'firebase/auth'

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
    const auth = getAuth()
    if (!auth.currentUser) {
      throw new Error('Authentication required')
    }

    const functions = getFunctions()
    const createOrder = httpsCallable(functions, 'createOrder')
    
    try {
      const result = await createOrder(orderData)
      return result.data
    } catch (error: any) {
      console.error('Order creation failed:', error)
      if (error.code === 'unauthenticated') {
        throw new Error('Authentication required')
      }
      throw new Error('Failed to create order')
    }
  },

  verify: async (orderId: string, refId: string) => {
    const auth = getAuth()
    if (!auth.currentUser) {
      throw new Error('Authentication required')
    }

    const functions = getFunctions()
    const verifyPayment = httpsCallable(functions, 'verifyPayment')
    
    try {
      const result = await verifyPayment({ orderId, refId })
      return result.data
    } catch (error: any) {
      console.error('Payment verification failed:', error)
      if (error.code === 'unauthenticated') {
        throw new Error('Authentication required')
      }
      throw new Error('Payment verification failed')
    }
  },

  getById: async (orderId: string) => {
    const auth = getAuth()
    if (!auth.currentUser) {
      throw new Error('Authentication required')
    }

    const docRef = doc(db, 'orders', orderId)
    const docSnap = await getDoc(docRef)
    if (!docSnap.exists()) {
      throw new Error('Order not found')
    }
    return { id: docSnap.id, ...docSnap.data() }
  }
} 