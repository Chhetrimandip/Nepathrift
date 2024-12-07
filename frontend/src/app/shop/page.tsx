"use client"

import { Playfair_Display, Poppins } from "next/font/google"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { productsService, Product } from "@/lib/services/products"

const playfair = Playfair_Display({ subsets: ["latin"] })
const poppins = Poppins({ 
  weight: ['400', '600'],
  subsets: ["latin"] 
})

const categories = [
  "All",
  "Clothing",
  "Shoes",
  "Accessories",
  "Bags",
  "Jewelry",
  "Other"
]

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("All")

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await productsService.getAll()
        setProducts(fetchedProducts)
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const filteredProducts = selectedCategory === "All"
    ? products
    : products.filter(product => 
        product.category.toLowerCase() === selectedCategory.toLowerCase()
      )

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className={`${playfair.className} text-4xl font-bold mb-8 text-gray-800 dark:text-gray-100`}>
        Shop Our Collection
      </h1>

      {/* Categories */}
      <div className="flex flex-wrap gap-4 mb-8">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`${poppins.className} px-4 py-2 rounded-full text-sm font-medium transition-colors
              ${selectedCategory === category
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'
              }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <h3 className={`${poppins.className} text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2`}>
            {selectedCategory === "All" 
              ? "Everything is sold out!" 
              : `No ${selectedCategory} available right now`}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Check back soon for new arrivals or try a different category
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className="group"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <Image
                    src={product.imageUrls[0] || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="p-4">
                  <h3 className={`${poppins.className} font-semibold text-gray-800 dark:text-gray-200`}>
                    {product.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">${product.price.toFixed(2)}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 capitalize">
                    {product.condition}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
} 