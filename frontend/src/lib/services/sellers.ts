import { db } from "@/lib/firebase"
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs 
} from "firebase/firestore"
import { getAuth } from 'firebase/auth'

export interface Seller {
  id?: string
  userId: string
  name: string
  email: string
  phone?: string
  address?: string
  createdAt: Date
  updatedAt?: Date
}

export const sellersService = {
  async create(data: Omit<Seller, 'id' | 'createdAt' | 'userId'>) {
    const auth = getAuth()
    const user = auth.currentUser
    if (!user) throw new Error('Not authenticated')

    const sellerData = {
      userId: user.uid,
      ...data,
      createdAt: new Date(),
    }

    await setDoc(doc(db, "sellers", user.uid), sellerData)
    return {
      id: user.uid,
      ...sellerData
    }
  },

  async getCurrent() {
    const auth = getAuth()
    const user = auth.currentUser
    if (!user) throw new Error('Not authenticated')

    const docRef = doc(db, "sellers", user.uid)
    const docSnap = await getDoc(docRef)
    
    if (!docSnap.exists()) return null
    
    return {
      id: docSnap.id,
      ...docSnap.data()
    } as Seller
  },

  async update(data: Partial<Omit<Seller, 'id' | 'userId'>>) {
    const auth = getAuth()
    const user = auth.currentUser
    if (!user) throw new Error('Not authenticated')

    const docRef = doc(db, "sellers", user.uid)
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date()
    })

    const updated = await getDoc(docRef)
    return {
      id: updated.id,
      ...updated.data()
    } as Seller
  },

  async getById(id: string) {
    const docRef = doc(db, "sellers", id)
    const docSnap = await getDoc(docRef)
    
    if (!docSnap.exists()) return null
    
    return {
      id: docSnap.id,
      ...docSnap.data()
    } as Seller
  },

  async getByUserId(userId: string) {
    const docRef = doc(db, "sellers", userId)
    const docSnap = await getDoc(docRef)
    
    if (!docSnap.exists()) return null
    
    return {
      id: docSnap.id,
      ...docSnap.data()
    } as Seller
  },

  async getSeller(id: string): Promise<Seller | null> {
    try {
      const sellerRef = doc(db, 'sellers', id)
      const sellerSnap = await getDoc(sellerRef)
      
      if (!sellerSnap.exists()) {
        return null
      }
      
      return {
        id: sellerSnap.id,
        ...sellerSnap.data()
      } as Seller
    } catch (error) {
      console.error('Error getting seller:', error)
      throw error
    }
  },

  async updateSeller(id: string, data: Partial<Seller>) {
    const sellerRef = doc(db, 'sellers', id)
    await updateDoc(sellerRef, data)
  }
} 