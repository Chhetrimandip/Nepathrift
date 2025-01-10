'use client'

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import Image from "next/image"
import Link from "next/link"
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

export default function EditProductContent() {
  const { id } = useParams()
  const router = useRouter()
  const { user } = useAuth()

  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    condition: '',
    size: '',
    brand: ''
  })

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const productData = await productsService.getProduct(id as string)
        if (!productData) {
          setError("Product not found")
          return
        }
        setProduct(productData)
        setFormData({
          name: productData.name,
          description: productData.description,
          price: productData.price.toString(),
          category: productData.category,
          condition: productData.condition,
          size: productData.size || '',
          brand: productData.brand || ''
        })
        setPreviews(productData.imageUrls || [])
      } catch (error) {
        console.error("Error loading product:", error)
        setError("Failed to load product details")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      loadProduct()
    }
  }, [id])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    setFiles(prev => [...prev, ...selectedFiles])
    
    const newPreviews = selectedFiles.map(file => URL.createObjectURL(file))
    setPreviews(prev => [...prev, ...newPreviews])
  }

  const removeImage = (index: number) => {
    setPreviews(prev => prev.filter((_, i) => i !== index))
    setFiles(prev => prev.filter((_, i) => i !== index))
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
    if (!product?.id) return

    const updatedProduct = {
      ...product,
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category,
      condition: formData.condition,
      size: formData.size,
      brand: formData.brand
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

  if (error || !product) {
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
            value={formData.name}
            onChange={handleChange}
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
            value={formData.description}
            onChange={handleChange}
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
            value={formData.price}
            onChange={handleChange}
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
            value={formData.category}
            onChange={handleChange}
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
            value={formData.condition}
            onChange={handleChange}
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

        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
            Size
          </label>
          <input
            type="text"
            name="size"
            value={formData.size}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
              focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent
              dark:bg-gray-700 dark:text-gray-100"
          />
        </div>

        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
            Brand
          </label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
              focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent
              dark:bg-gray-700 dark:text-gray-100"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 
          transition-colors"
        >
          Update Product
        </button>
      </form>
    </div>
  )
} 