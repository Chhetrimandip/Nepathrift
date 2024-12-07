import { db } from '@/lib/firebase'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'

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

export async function getSeller(userId: string): Promise<Seller | null> {
  const sellerRef = doc(db, 'sellers', userId)
  const sellerSnap = await getDoc(sellerRef)
  
  if (!sellerSnap.exists()) {
    return null
  }
  
  const data = sellerSnap.data()
  if (!data) {
    return null
  }

  return {
    id: sellerSnap.id,
    userId: data.userId,
    name: data.name,
    email: data.email,
    phone: data.phone,
    address: data.address,
    createdAt: data.createdAt.toDate(),
    updatedAt: data.updatedAt?.toDate(),
  } as Seller
}

export async function createSeller(seller: Omit<Seller, 'id' | 'createdAt'>) {
  const sellerRef = doc(db, 'sellers', seller.userId)
  const now = new Date()
  const sellerData = {
    ...seller,
    createdAt: now
  }
  
  await setDoc(sellerRef, sellerData)
  
  return {
    id: seller.userId,
    ...sellerData
  } as Seller
}

export async function updateSeller(userId: string, data: Partial<Omit<Seller, 'id' | 'userId' | 'createdAt'>>): Promise<Seller> {
  const sellerRef = doc(db, 'sellers', userId)
  const now = new Date()
  const updateData = {
    ...data,
    updatedAt: now
  }
  
  await updateDoc(sellerRef, updateData)
  
  const updated = await getDoc(sellerRef)
  const updatedData = updated.data()
  if (!updatedData) {
    throw new Error('Failed to get updated seller data')
  }

  return {
    id: updated.id,
    userId: updatedData.userId,
    name: updatedData.name,
    email: updatedData.email,
    phone: updatedData.phone,
    address: updatedData.address,
    createdAt: updatedData.createdAt.toDate(),
    updatedAt: updatedData.updatedAt?.toDate(),
  } as Seller
}
