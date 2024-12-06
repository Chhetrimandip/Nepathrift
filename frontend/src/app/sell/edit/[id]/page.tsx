"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import Image from "next/image"
import { productsService, Product } from "@/lib/services/products"
import { Camera } from "lucide-react"

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
    setNewImages(files)
    
    // Create preview URLs for new images
    const newPreviews = files.map(file => URL.createObjectURL(file))
    setPreviews(prev => [...prev, ...newPreviews])
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
        sellerId: user.uid,
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
      <h1 className="text-2xl font-bold mb-8">Edit Item</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
        {/* Image Upload */}
        <div className="mb-6">
          <label className="block mb-2 font-semibold">Images</label>
          <div className="grid grid-cols-4 gap-4 mb-4">
            {previews.map((url, index) => (
              <div key={url} className="relative aspect-square">
                <Image
                  src={url}
                  alt={`Preview ${index + 1}`}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
          <label className="block w-full p-4 border-2 border-dashed rounded-lg text-center cursor-pointer hover:border-purple-600">
            <Camera className="mx-auto mb-2" />
            <span className="text-sm text-gray-600">Add More Images</span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <div>
            <label className="block mb-2 font-semibold">Title</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-md"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full rounded-md"
              rows={4}
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              min="0"
              className="w-full rounded-md"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 font-semibold">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full rounded-md"
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
              <label className="block mb-2 font-semibold">Condition</label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                className="w-full rounded-md"
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
              <label className="block mb-2 font-semibold">Size</label>
              <input
                type="text"
                name="size"
                value={formData.size}
                onChange={handleChange}
                className="w-full rounded-md"
                required
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold">Brand</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="w-full rounded-md"
                required
              />
            </div>
          </div>
        </div>

        {error && (
          <p className="text-red-600 mt-4">{error}</p>
        )}

        <div className="mt-8 flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  )
} 