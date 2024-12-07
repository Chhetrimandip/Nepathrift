'use client'

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import Image from "next/image"
import Link from "next/link"
import { productsService, Product } from "@/lib/services/products"
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

export default function EditProductContent() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [product, setProduct] = useState<Product | null>(null)
  const [previews, setPreviews] = useState<string[]>([])
  const [files, setFiles] = useState<File[]>([])

  useEffect(() => {
    const fetchProduct = async () => {
      if (!user || !params.id) return
      try {
        const fetchedProduct = await productsService.getById(params.id as string)
        if (fetchedProduct) {
          setProduct(fetchedProduct)
          setPreviews(fetchedProduct.imageUrls || [])
        }
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [params.id, user])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    if (selectedFiles.length + previews.length > 4) {
      alert('Maximum 4 images allowed')
      return
    }

    setFiles(prev => [...prev, ...selectedFiles])
    
    selectedFiles.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviews(prev => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    setPreviews(prev => prev.filter((_, i) => i !== index))
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!product?.id) return

    const formData = new FormData(e.currentTarget)
    const updatedProduct = {
      ...product,
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string),
      category: formData.get('category') as string,
      condition: formData.get('condition') as string,
    }

    try {
      await productsService.update(product.id, updatedProduct, files)
      router.push('/shop')
    } catch (error) {
      console.error('Error updating product:', error)
      alert('Failed to update product')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Product not found</h1>
        <Link href="/shop" className="text-purple-600 hover:text-purple-800">
          Return to Shop
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className={`${playfair.className} text-3xl font-bold mb-8 text-gray-800 dark:text-gray-100`}>
        Edit Product
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
            Name
          </label>
          <input
            type="text"
            name="name"
            defaultValue={product.name}
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
              focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent
              dark:bg-gray-700 dark:text-gray-100"
          />
        </div>

        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
            Description
          </label>
          <textarea
            name="description"
            defaultValue={product.description}
            required
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
              focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent
              dark:bg-gray-700 dark:text-gray-100"
          />
        </div>

        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
            Price
          </label>
          <input
            type="number"
            name="price"
            defaultValue={product.price}
            required
            min="0"
            step="0.01"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
              focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent
              dark:bg-gray-700 dark:text-gray-100"
          />
        </div>

        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
            Category
          </label>
          <select
            name="category"
            defaultValue={product.category}
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
              focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent
              dark:bg-gray-700 dark:text-gray-100"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
            Condition
          </label>
          <select
            name="condition"
            defaultValue={product.condition}
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
              focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent
              dark:bg-gray-700 dark:text-gray-100"
          >
            {conditions.map(condition => (
              <option key={condition} value={condition}>{condition}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-medium
            hover:bg-purple-700 transition-colors"
        >
          Update Product
        </button>
      </form>
    </div>
  )
} 