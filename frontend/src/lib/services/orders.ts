import { getFunctions, httpsCallable } from 'firebase/functions'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { getAuth } from 'firebase/auth'
import { addDoc, collection } from 'firebase/firestore'

export interface Order {
  id: string;
  productId: string;
  buyerId: string;
  sellerId: string;
  status: 'pending' | 'confirmed' | 'sent' | 'received' | 'damaged' | 'cancelled';
  price: number;
  shippingInfo: {
    fullName: string;
    address: string;
    phone: string;
  };
  timeline: {
    confirmedAt?: Date;
    sentAt?: Date;
    receivedAt?: Date;
    cancelledAt?: Date;
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

    try {
      const order = {
        ...orderData,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      const docRef = await addDoc(collection(db, 'orders'), order)
      return { id: docRef.id, ...order }
    } catch (error) {
      console.error('Order creation failed:', error)
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