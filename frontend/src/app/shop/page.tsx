"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"

type Product = {
  id: number
  name: string
  price: number
  image: string
  category: string
}

const products: Product[] = [
  {
    id: 1,
    name: "Vintage Denim Jacket",
    price: 39.99,
    image: "/placeholder.svg",
    category: "clothing"
  },
  {
    id: 2,
    name: "Classic Leather Bag",
    price: 45.99,
    image: "/placeholder.svg",
    category: "accessories"
  },
  // Add more products as needed
]

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const filteredProducts = selectedCategory === "all" 
    ? products 
    : products.filter(p => p.category === selectedCategory)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shop</h1>
      
      {/* Category Filter */}
      <div className="mb-8 flex gap-4">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-4 py-2 rounded-full ${
            selectedCategory === "all" ? "bg-purple-600 text-white" : "bg-gray-200"
          }`}
        >
          All
        </button>
        {["clothing", "accessories", "shoes", "vintage"].map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full capitalize ${
              selectedCategory === category ? "bg-purple-600 text-white" : "bg-gray-200"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.id}`}
            className="group"
          >
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-48">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800">{product.name}</h3>
                <p className="text-gray-600">${product.price.toFixed(2)}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
} 