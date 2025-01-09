import { db } from '@/lib/firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'

export const adminService = {
  isAdmin: async (userId: string): Promise<boolean> => {
    if (!userId) return false
    
    try {
      const adminRef = collection(db, 'admins')
      const q = query(adminRef, where('userId', '==', userId))
      const querySnapshot = await getDocs(q)
      return !querySnapshot.empty
    } catch (error) {
      console.error('Error checking admin status:', error)
      return false
    }
  }
}