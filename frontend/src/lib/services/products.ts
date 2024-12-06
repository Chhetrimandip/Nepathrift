import { storage, db } from "@/lib/firebase"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { collection, addDoc, query, where, getDocs, deleteDoc, doc } from "firebase/firestore"

export interface Product {
  id?: string
  name: string
  description: string
  price: number
  condition: string
  category: string
  size: string
  brand: string
  sellerId: string
  status: 'available' | 'sold' | 'pending'
  imageUrls: string[]
  createdAt: Date
}

export const productsService = {
  async create(data: Omit<Product, 'id' | 'createdAt'>, images: File[]) {
    const imageUrls = []
    
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

  async delete(productId: string) {
    await deleteDoc(doc(db, "products", productId))
  }
} 