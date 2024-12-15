"use client"

import { db } from '@/lib/firebase'
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore'
import { CartItem } from '@/contexts/CartContext'
import { paymentService } from "@/lib/services/payment";

export interface ShippingAddress {
  fullName: string
  address: string
  city: string
  state: string
  postalCode: string
  phone: string
}

export interface Order {
  id?: string
  userId: string
  items: CartItem[]
  total: number
  shippingAddress: ShippingAddress
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  paymentStatus: 'pending' | 'paid' | 'failed'
  createdAt: Date
}

export const checkoutService = {
  async createOrder(userId: string, items: CartItem[], shippingAddress: ShippingAddress, total: number): Promise<string> {
    const order: Omit<Order, 'id'> = {
      userId,
      items,
      total,
      shippingAddress,
      status: 'pending',
      paymentStatus: 'pending',
      createdAt: new Date()
    }

    const docRef = await addDoc(collection(db, 'orders'), order)

    // Update product status to 'pending'
    for (const item of items) {
      const productRef = doc(db, 'products', item.id)
      await updateDoc(productRef, {
        status: 'pending'
      })
    }

    return docRef.id
  },

  async updatePaymentStatus(orderId: string, status: 'paid' | 'failed') {
    const orderRef = doc(db, 'orders', orderId)
    await updateDoc(orderRef, {
      paymentStatus: status,
      status: status === 'paid' ? 'processing' : 'cancelled'
    })
  },

  initiateEsewaPayment: async (orderId: string, amount: number) => {
    try {
      await paymentService.initiateEsewaPayment(orderId, amount);
    } catch (error) {
      console.error("Error initiating eSewa payment:", error);
      throw error;
    }
  }
} 