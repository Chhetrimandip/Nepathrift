import { useState } from 'react'
import { generateReactHelpers } from '@uploadthing/react'
import { OurFileRouter } from '@/utils/uploadthing'

const { useUploadThing } = generateReactHelpers<OurFileRouter>()

export const useProductUpload = () => {
  const [isUploading, setIsUploading] = useState(false)
  const { startUpload } = useUploadThing("productImage")

  const uploadProduct = async (
    productData: any,
    images: File[]
  ) => {
    try {
      setIsUploading(true)
      
      // Upload images first
      const uploadedImages = await startUpload(images)
      if (!uploadedImages) {
        throw new Error("Failed to upload images")
      }

      // Create product with image URLs
      const imageUrls = uploadedImages.map(img => img.url)
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...productData,
          imageUrl: imageUrls.join(','),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create product')
      }

      return await response.json()
    } catch (error) {
      console.error('Error uploading product:', error)
      throw error
    } finally {
      setIsUploading(false)
    }
  }

  return { uploadProduct, isUploading }
} 