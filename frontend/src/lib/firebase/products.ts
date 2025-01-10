"use client"

import { db, storage } from '@/lib/firebase'
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  deleteDoc, 
  doc, 
  addDoc, 
  updateDoc, 
  getDoc 
} from 'firebase/firestore'

export interface Product {
  id: string
  sellerId: string
  name: string
  description: string
  price: number
  images: string[]
  category: string
  condition: string
  size?: string
  brand?: string
  createdAt: string
  updatedAt?: string
}

export type CreateProductInput = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>

export async function getSellerProducts(sellerId: string) {
  try {
    if (!sellerId) throw new Error('Seller ID is required')
    
    const productsRef = collection(db, 'products')
    const q = query(productsRef, where('sellerId', '==', sellerId))
    const querySnapshot = await getDocs(q)
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[]
  } catch (error) {
    console.error('Error fetching seller products:', error)
    throw error
  }
}

export async function getProduct(productId: string) {
  try {
    if (!productId) throw new Error('Product ID is required')
    
    const productRef = doc(db, 'products', productId)
    const productSnap = await getDoc(productRef)
    
    if (!productSnap.exists()) {
      return null
    }
    
    return {
      id: productSnap.id,
      ...productSnap.data()
    } as Product
  } catch (error) {
    console.error('Error fetching product:', error)
    throw error
  }
}

export async function createProduct(product: CreateProductInput) {
  try {
    if (!product) throw new Error('Product data is required')
    if (!product.sellerId) throw new Error('Seller ID is required')
    if (!product.name) throw new Error('Product name is required')
    if (!product.description) throw new Error('Product description is required')
    if (!product.price || product.price <= 0) throw new Error('Valid price is required')
    if (!product.images || product.images.length === 0) throw new Error('At least one image is required')
    if (!product.category) throw new Error('Category is required')
    if (!product.condition) throw new Error('Condition is required')
    
    const productsRef = collection(db, 'products')
    const now = new Date().toISOString()
    
    const docRef = await addDoc(productsRef, {
      ...product,
      createdAt: now,
      updatedAt: now
    })
    
    return {
      id: docRef.id,
      ...product,
      createdAt: now,
      updatedAt: now
    } as Product
  } catch (error) {
    console.error('Error creating product:', error)
    throw error
  }
}

export async function updateProduct(productId: string, data: Partial<Product>) {
  try {
    if (!productId) throw new Error('Product ID is required')
    if (!data || Object.keys(data).length === 0) throw new Error('Update data is required')
    
    const productRef = doc(db, 'products', productId)
    const now = new Date().toISOString()
    
    await updateDoc(productRef, {
      ...data,
      updatedAt: now
    })
    
    const updated = await getDoc(productRef)
    return {
      id: updated.id,
      ...updated.data()
    } as Product
  } catch (error) {
    console.error('Error updating product:', error)
    throw error
  }
}

export async function deleteProduct(productId: string) {
  try {
    if (!productId) throw new Error('Product ID is required')
    
    const productRef = doc(db, 'products', productId)
    
    // Get the product data before deletion to handle image cleanup if needed
    const productSnap = await getDoc(productRef)
    if (!productSnap.exists()) {
      throw new Error('Product not found')
    }
    
    await deleteDoc(productRef)
    return productId
  } catch (error) {
    console.error('Error deleting product:', error)
    throw error
  }
}