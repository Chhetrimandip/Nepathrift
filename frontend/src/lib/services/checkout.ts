"use client"

import { db } from '@/lib/firebase'
import { collection, addDoc, doc, updateDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { CartItem } from '@/contexts/CartContext'
import { paymentService } from "@/lib/services/payment";
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ordersService } from "@/lib/services/orders";

export interface ShippingAddress {
  fullName: string
  address: string
  city: string
  state: string
  postalCode: string
  phone: string
}

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

export const checkoutService = {
  async createOrder(userId: string, items: CartItem[], shippingAddress: ShippingAddress, total: number): Promise<string> {
    try {
      const productRef = doc(db, 'products', items[0].id);
      const productSnap = await getDoc(productRef);
      if (!productSnap.exists()) {
        throw new Error('Product not found');
      }
      const productData = productSnap.data();

      // Create order with required fields
      const order = {
        buyerId: userId,  // This must match request.auth.uid in rules
        sellerId: productData.sellerId,
        productId: items[0].id,
        price: total,
        status: 'pending',
        shippingInfo: {
          fullName: shippingAddress.fullName,
          address: `${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.postalCode}`,
          phone: shippingAddress.phone
        },
        timeline: {},
        createdAt: serverTimestamp(), // Use server timestamp
        updatedAt: serverTimestamp()
      };

      // Create order in Firestore
      const ordersRef = collection(db, 'orders');
      const docRef = await addDoc(ordersRef, order);

      return docRef.id;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
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
  },

  async submitPaymentProof(orderId: string, proofImage: File) {
    const storage = getStorage();
    const storageRef = ref(storage, `payment-proofs/${orderId}-${Date.now()}`);
    
    try {
      // Upload proof image
      await uploadBytes(storageRef, proofImage);
      const imageUrl = await getDownloadURL(storageRef);

      // Update order with payment proof
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        paymentProof: imageUrl,
        paymentStatus: 'pending_verification',
        updatedAt: new Date()
      });

      return true;
    } catch (error) {
      console.error('Error submitting payment proof:', error);
      throw error;
    }
  }
} 