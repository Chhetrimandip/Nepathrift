import { db } from '@/lib/firebase'
import { collection, addDoc, query, where, getDocs, orderBy, doc, getDoc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

export interface Comment {
  id: string
  productId: string
  userId: string
  userName: string
  userPhoto?: string
  comment: string
  createdAt: Date
}

export const commentsService = {
  async create(productId: string, comment: string) {
    const auth = getAuth()
    const user = auth.currentUser
    if (!user) throw new Error('Not authenticated')

    const commentData = {
      productId,
      userId: user.uid,
      userName: user.displayName || 'Anonymous',
      userPhoto: user.photoURL || '',
      comment,
      createdAt: new Date()
    }

    const commentsRef = collection(db, `products/${productId}/comments`)
    const docRef = await addDoc(commentsRef, commentData)
    
    return {
      id: docRef.id,
      ...commentData
    }
  },

  async getProductComments(productId: string) {
    const commentsRef = collection(db, `products/${productId}/comments`)
    const q = query(commentsRef, orderBy('createdAt', 'desc'))
    const snapshot = await getDocs(q)
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Comment[]
  }
} 