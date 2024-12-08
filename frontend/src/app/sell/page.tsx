"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import Image from "next/image"
import { productsService } from "@/lib/services/products"
import { Camera, X } from "lucide-react"
import { Playfair_Display, Poppins } from "next/font/google"

const playfair = Playfair_Display({ subsets: ["latin"] })
const poppins = Poppins({ 
  weight: ['400', '600'],
  subsets: ["latin"] 
})

const categories = [
  "Clothing",
  "Shoes",
  "Accessories",
  "Bags",
  "Jewelry",
  "Other"
]

const conditions = [
  "New with tags",
  "Like new",
  "Good",
  "Fair",
  "Poor"
]

export default function SellPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [images, setImages] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    condition: "",
    category: "",
    size: "",
    brand: ""
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setImages(prev => [...prev, ...files])
    
    // Create preview URLs for new images
    const newPreviews = files.map(file => file ? URL.createObjectURL(file) : '')
    setPreviews(prev => [...prev, ...newPreviews])
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
    setPreviews(prev => prev.filter((_, i) => i !== index))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!user) return
    
    try {
      const price = parseFloat(formData.price)
      if (isNaN(price) || price <= 0) {
        throw new Error('Please enter a valid price')
      }

      const productData = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        condition: formData.condition,
        price: price,
        size: formData.size,
        brand: formData.brand,
        sellerId: user.uid,
        status: 'available' as const,
        imageUrls: []
      }

      // Create product with images
      await productsService.create(productData, images)
      router.push('/seller/products')
    } catch (error) {
      console.error('Error creating product:', error)
      alert(error instanceof Error ? error.message : 'Failed to create product')
    }
  }

  if (!user) {
    router.push("/auth/signin")
    return null
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className={`${playfair.className} text-3xl font-bold mb-8 text-gray-800 dark:text-gray-100`}>
        Sell Your Item
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
            Photos
          </label>
          <div className="grid grid-cols-4 gap-4">
            {previews.map((url, index) => (
              <div key={index} className="relative aspect-square">
                <Image
                  src={url}
                  alt={`Product image ${index + 1}`}
                  fill
                  className="object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
            {previews.length < 4 && (
              <label className="aspect-square flex items-center justify-center border-2 border-dashed 
                border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-purple-500 
                dark:hover:border-purple-400 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <Camera className="text-gray-400 dark:text-gray-500" />
              </label>
            )}
          </div>
        </div>

        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
            Item Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
            bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        </div>

        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
            bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
              bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="">Select Category</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
              Condition
            </label>
            <select
              name="condition"
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
              bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="">Select Condition</option>
              {conditions.map(condition => (
                <option key={condition} value={condition}>
                  {condition}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
              Price
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              min="0"
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
              bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
              Size
            </label>
            <input
              type="text"
              name="size"
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
              bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 
          transition-colors font-medium dark:bg-purple-500 dark:hover:bg-purple-600"
        >
          List Item
        </button>
      </form>
    </div>
  )
}

