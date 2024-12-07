"use client"

import { db } from '@/lib/firebase'
import { collection, getDocs } from 'firebase/firestore'
import { Product } from './products'

export const searchService = {
  async searchProducts(searchTerm: string): Promise<Product[]> {
    const termLower = searchTerm.toLowerCase()
    const productsRef = collection(db, 'products')
    const querySnapshot = await getDocs(productsRef)
    
    return querySnapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      }) as Product)
      .filter(product => 
        product.name.toLowerCase().includes(termLower) ||
        product.description.toLowerCase().includes(termLower) ||
        product.brand.toLowerCase().includes(termLower) ||
        product.category.toLowerCase().includes(termLower)
      )
  }
} 