"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import Image from "next/image"
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

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [newImages, setNewImages] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [product, setProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    condition: "",
    category: "",
    size: "",
    brand: ""
  })

  useEffect(() => {
    if (!user) {
      router.push("/auth/signin")
      return
    }

    const fetchProduct = async () => {
      try {
        const productData = await productsService.getById(params.id as string)
        if (!productData) {
          setError("Product not found")
          return
        }
        if (productData.sellerId !== user.uid) {
          setError("Unauthorized")
          return
        }
        setProduct(productData)
        setFormData({
          name: productData.name,
          description: productData.description,
          price: productData.price.toString(),
          condition: productData.condition,
          category: productData.category,
          size: productData.size,
          brand: productData.brand
        })
        setPreviews(productData.imageUrls)
      } catch (error) {
        console.error("Error fetching product:", error)
        setError("Error loading product")
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [params.id, user, router])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setNewImages(prev => [...prev, ...files])
    
    // Create preview URLs for new images
    const newPreviews = files.map(file => URL.createObjectURL(file))
    setPreviews(prev => [...prev, ...newPreviews])
  }

  const removeImage = (index: number) => {
    // If it's an existing image
    if (index < (product?.imageUrls.length || 0)) {
      const updatedUrls = product?.imageUrls.filter((_, i) => i !== index) || []
      setProduct(prev => prev ? { ...prev, imageUrls: updatedUrls } : null)
      setPreviews(prev => prev.filter((_, i) => i !== index))
    } 
    // If it's a new image
    else {
      const newIndex = index - (product?.imageUrls.length || 0)
      setNewImages(prev => prev.filter((_, i) => i !== newIndex))
      setPreviews(prev => prev.filter((_, i) => i !== index))
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !product) return

    try {
      setSaving(true)
      await productsService.update(params.id as string, {
        ...formData,
        price: parseFloat(formData.price),
        imageUrls: product.imageUrls // Pass current imageUrls
      }, newImages)
      router.push("/dashboard")
    } catch (error) {
      console.error("Error updating product:", error)
      setError("Failed to update product")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => router.back()}
          className="text-purple-600 hover:text-purple-800"
        >
          Go Back
        </button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className={`${playfair.className} text-2xl font-bold mb-8 text-gray-800 dark:text-gray-100`}>
        Edit Item
      </h1>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
        {/* Image Upload */}
        <div className="mb-6">
          <label className={`${poppins.className} block mb-2 font-semibold text-gray-800 dark:text-gray-100`}>
            Images (up to 5)
          </label>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-4 mb-4">
            {previews.map((url, index) => (
              <div key={url} className="relative aspect-square">
                <Image
                  src={url}
                  alt={`Preview ${index + 1}`}
                  fill
                  className="object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
            {previews.length < 5 && (
              <label className="aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-purple-600 dark:hover:border-purple-400 text-gray-600 dark:text-gray-300">
                <Camera className="mb-2" />
                <span className="text-sm">Add Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          <div>
            <label className={`${poppins.className} block mb-2 font-semibold text-gray-800 dark:text-gray-100`}>
              Title
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600"
              required
            />
          </div>

          <div>
            <label className={`${poppins.className} block mb-2 font-semibold text-gray-800 dark:text-gray-100`}>
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600"
              rows={4}
              required
            />
          </div>

          <div>
            <label className={`${poppins.className} block mb-2 font-semibold text-gray-800 dark:text-gray-100`}>
              Price
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              min="0"
              className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`${poppins.className} block mb-2 font-semibold text-gray-800 dark:text-gray-100`}>
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                required
              >
                <option value="">Select category</option>
                {categories.map(category => (
                  <option key={category} value={category.toLowerCase()}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={`${poppins.className} block mb-2 font-semibold text-gray-800 dark:text-gray-100`}>
                Condition
              </label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                required
              >
                <option value="">Select condition</option>
                {conditions.map(condition => (
                  <option key={condition} value={condition.toLowerCase()}>
                    {condition}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={`${poppins.className} block mb-2 font-semibold text-gray-800 dark:text-gray-100`}>
                Size
              </label>
              <input
                type="text"
                name="size"
                value={formData.size}
                onChange={handleChange}
                className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                required
              />
            </div>

            <div>
              <label className={`${poppins.className} block mb-2 font-semibold text-gray-800 dark:text-gray-100`}>
                Brand
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                required
              />
            </div>
          </div>
        </div>

        {error && (
          <p className="text-red-600 dark:text-red-400 mt-4">{error}</p>
        )}

        <div className="mt-8 flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 disabled:opacity-50 dark:bg-purple-500 dark:hover:bg-purple-600"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  )
} 