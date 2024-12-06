import { storage, db } from "@/lib/firebase"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { collection, addDoc } from "firebase/firestore"

interface ProductData {
  name: string
  description: string
  price: number
  condition: string
  category: string
  size: string
  brand: string
  sellerId: string
  status: string
  imageUrls: string[]
}

export const productsService = {
  async create(data: ProductData, images: File[]) {
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
    }

    const docRef = await addDoc(collection(db, "products"), productData)
    return docRef.id
  }
} 