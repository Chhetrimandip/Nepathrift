"use client"

import { db, storage } from '@/lib/firebase'
import { collection, query, where, getDocs, deleteDoc, doc, addDoc, updateDoc, getDoc } from 'firebase/firestore'

export const dynamicConfig = 'force-dynamic'

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
  const productsRef = collection(db, 'products')
  const q = query(productsRef, where('sellerId', '==', sellerId))
  const querySnapshot = await getDocs(q)
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Product[]
}

export async function getProduct(productId: string) {
  const productRef = doc(db, 'products', productId)
  const productSnap = await getDoc(productRef)
  
  if (!productSnap.exists()) {
    return null
  }
  
  return {
    id: productSnap.id,
    ...productSnap.data()
  } as Product
}

export async function createProduct(product: CreateProductInput) {
  const productsRef = collection(db, 'products')
  const docRef = await addDoc(productsRef, {
    ...product,
    createdAt: new Date().toISOString()
  })
  
  return {
    id: docRef.id,
    ...product,
    createdAt: new Date().toISOString()
  } as Product
}

export async function updateProduct(productId: string, data: Partial<Product>) {
  const productRef = doc(db, 'products', productId)
  await updateDoc(productRef, {
    ...data,
    updatedAt: new Date().toISOString()
  })
  
  const updated = await getDoc(productRef)
  return {
    id: updated.id,
    ...updated.data()
  } as Product
}

export async function deleteProduct(productId: string) {
  const productRef = doc(db, 'products', productId)
  await deleteDoc(productRef)
  return productId
}