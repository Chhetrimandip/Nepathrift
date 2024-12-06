"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function SellPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    condition: "",
    image: null as File | null,
  })
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setFormData(prev => ({ ...prev, image: file }))
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the data to your backend API
    console.log("'Submitting product:'", formData)
    // For now, we'll just show an alert and redirect to the dashboard
    alert("'Product submitted successfully!'")
    router.push("'/dashboard'")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Sell Your Product</h1>
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
        <div className="mb-4">
          <label htmlFor="title" className="block mb-2 font-semibold">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full border border-gray-200 rounded-md p-2 dark:border-gray-800"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block mb-2 font-semibold">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full border border-gray-200 rounded-md p-2 dark:border-gray-800"
            rows={4}
          ></textarea>
        </div>
        <div className="mb-4">
          <label htmlFor="price" className="block mb-2 font-semibold">Price ($)</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="w-full border border-gray-200 rounded-md p-2 dark:border-gray-800"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="category" className="block mb-2 font-semibold">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full border border-gray-200 rounded-md p-2 dark:border-gray-800"
          >
            <option value="">Select a category</option>
            <option value="clothing">Clothing</option>
            <option value="accessories">Accessories</option>
            <option value="home-decor">Home Decor</option>
            <option value="books">Books</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="condition" className="block mb-2 font-semibold">Condition</label>
          <select
            id="condition"
            name="condition"
            value={formData.condition}
            onChange={handleChange}
            required
            className="w-full border border-gray-200 rounded-md p-2 dark:border-gray-800"
          >
            <option value="">Select condition</option>
            <option value="new">New</option>
            <option value="like-new">Like New</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
            <option value="poor">Poor</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="image" className="block mb-2 font-semibold">Product Image</label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleImageChange}
            accept="image/*"
            required
            className="w-full border border-gray-200 rounded-md p-2 dark:border-gray-800"
          />
          {imagePreview && (
            <div className="mt-4">
              <Image src={imagePreview} alt="Product preview" width={200} height={200} className="rounded-md" />
            </div>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-red-600 text-white py-2 px-4 rounded-full hover:bg-red-700 transition duration-300"
        >
          List Product
        </button>
      </form>
    </div>
  )
}

