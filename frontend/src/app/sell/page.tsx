"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import Image from "next/image"
import { productsService } from "@/lib/services/products"
import { Camera, X } from "lucide-react"

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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
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
    const newPreviews = files.map(file => URL.createObjectURL(file))
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      setLoading(true)
      await productsService.create({
        ...formData,
        price: parseFloat(formData.price),
        sellerId: user.uid,
        status: "available"
      }, images)
      router.push("/dashboard")
    } catch (error) {
      console.error("Error creating product:", error)
      setError("Failed to create product")
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    router.push("/auth/signin")
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">List an Item</h1>

      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block mb-2 font-semibold">Images (up to 5)</label>
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
                <label className="aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-purple-600">
                  <Camera className="mb-2" />
                  <span className="text-sm text-gray-600">Add Image</span>
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

          <div>
            <label className="block mb-2 font-semibold">Title</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full rounded-md"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full rounded-md"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 font-semibold">Price</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full rounded-md"
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full rounded-md"
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
                required
                className="w-full rounded-md"
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
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? "Creating..." : "List Item"}
          </button>
        </form>
      </div>
    </div>
  )
}

