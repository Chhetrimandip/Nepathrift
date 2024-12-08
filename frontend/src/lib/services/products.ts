"use client"

import { storage, db } from "@/lib/firebase"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  deleteDoc, 
  doc, 
  getDoc, 
  updateDoc, 
  orderBy 
} from "firebase/firestore"
import { getAuth } from 'firebase/auth'

export interface Product {
  id: string
  name: string
  description: string
  price: number
  condition: string
  category: string
  brand?: string
  size?: string
  imageUrls: string[]
  sellerId: string
  createdAt: Date
}

export const productsService = {
  async getProduct(id: string): Promise<Product | null> {
    try {
      const productRef = doc(db, 'products', id)
      const productSnap = await getDoc(productRef)
      
      if (!productSnap.exists()) {
        return null
      }
      
      return {
        id: productSnap.id,
        ...productSnap.data()
      } as Product
    } catch (error) {
      console.error('Error getting product:', error)
      throw error
    }
  },

  async create(data: Omit<Product, 'id' | 'createdAt'>, images: File[]) {
    const auth = getAuth()
    const user = auth.currentUser
    if (!user) throw new Error('Not authenticated')

    const imageUrls: string[] = []
    
    // Upload images
    for (const image of images) {
      const storageRef = ref(storage, `products/${Date.now()}-${image.name}`)
      await uploadBytes(storageRef, image)
      const url = await getDownloadURL(storageRef)
      imageUrls.push(url)
    }

    // Create product document
    const productData = {
      ...data,
      sellerId: user.uid,
      imageUrls,
      createdAt: new Date(),
      status: 'available'
    }

    const docRef = await addDoc(collection(db, "products"), productData)
    return docRef.id
  },

  async getBySeller(sellerId: string) {
    const q = query(
      collection(db, "products"),
      where("sellerId", "==", sellerId)
    )
    
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[]
  },

  async getAll() {
    const productsRef = collection(db, 'products')
    const q = query(productsRef, orderBy('createdAt', 'desc'))
    const snapshot = await getDocs(q)
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[]
  },

  async getByCategory(category: string) {
    if (category === 'All') {
      return this.getAll()
    }
    
    const productsRef = collection(db, 'products')
    const q = query(
      productsRef, 
      where('category', '==', category),
      orderBy('createdAt', 'desc')
    )
    const snapshot = await getDocs(q)
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[]
  },

  async getById(id: string) {
    const docRef = doc(db, "products", id)
    const docSnap = await getDoc(docRef)
    
    if (!docSnap.exists()) return null
    
    return {
      id: docSnap.id,
      ...docSnap.data()
    } as Product
  },

  async update(id: string, data: Partial<Product>, newImages?: File[]) {
    const auth = getAuth()
    const user = auth.currentUser
    if (!user) throw new Error('Not authenticated')

    const docRef = doc(db, "products", id)
    const docSnap = await getDoc(docRef)
    
    if (!docSnap.exists() || docSnap.data().sellerId !== user.uid) {
      throw new Error('Unauthorized')
    }

    const imageUrls = data.imageUrls || []

    // Upload new images if any
    if (newImages?.length) {
      for (const image of newImages) {
        const storageRef = ref(storage, `products/${Date.now()}-${image.name}`)
        await uploadBytes(storageRef, image)
        const url = await getDownloadURL(storageRef)
        imageUrls.push(url)
      }
    }

    await updateDoc(docRef, {
      ...data,
      imageUrls,
      updatedAt: new Date()
    })

    const updated = await getDoc(docRef)
    return {
      id: updated.id,
      ...updated.data()
    } as Product
  },

  async delete(id: string) {
    const auth = getAuth()
    const user = auth.currentUser
    if (!user) throw new Error('Not authenticated')

    const docRef = doc(db, "products", id)
    const docSnap = await getDoc(docRef)
    
    if (!docSnap.exists() || docSnap.data().sellerId !== user.uid) {
      throw new Error('Unauthorized')
    }

    await deleteDoc(docRef)
    return id
  }
} 