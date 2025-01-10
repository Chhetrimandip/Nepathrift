import { db } from '@/lib/firebase'
import { collection, addDoc, query, where, getDocs, doc, getDoc, deleteDoc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

export interface Review {
  id: string
  sellerId: string
  userId: string
  rating: number
  comment: string
  createdAt: Date
}

export const reviewsService = {
  async create(sellerId: string, data: { rating: number; comment: string }) {
    const auth = getAuth()
    const user = auth.currentUser
    if (!user) throw new Error('Not authenticated')

    const reviewData = {
      sellerId,
      userId: user.uid,
      rating: data.rating,
      comment: data.comment,
      createdAt: new Date()
    }

    const reviewsRef = collection(db, `sellers/${sellerId}/reviews`)
    const docRef = await addDoc(reviewsRef, reviewData)
    
    return {
      id: docRef.id,
      ...reviewData
    }
  },

  async getSellerReviews(sellerId: string) {
    const reviewsRef = collection(db, `sellers/${sellerId}/reviews`)
    const snapshot = await getDocs(reviewsRef)
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Review[]
  },

  async delete(sellerId: string, reviewId: string) {
    const reviewRef = doc(db, `sellers/${sellerId}/reviews`, reviewId);
    await deleteDoc(reviewRef);
  },
} 