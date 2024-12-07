'use client'

import { Playfair_Display, Poppins } from "next/font/google"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { productsService, Product } from "@/lib/services/products"

const playfair = Playfair_Display({ subsets: ["latin"] })
const poppins = Poppins({ 
  weight: ['400', '600'],
  subsets: ["latin"] 
})

export default function CategoryContent() {
  const params = useParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const allProducts = await productsService.getAll()
        const filteredProducts = allProducts.filter(
          product => product.category.toLowerCase() === params.category
        )
        setProducts(filteredProducts)
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [params.category])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className={`${playfair.className} text-3xl font-bold mb-8 capitalize`}>
        {params.category} Collection
      </h1>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <h3 className={`${poppins.className} text-xl font-semibold mb-2`}>
            No items available in this category
          </h3>
          <p className="text-gray-600 mb-4">
            Check back soon for new arrivals
          </p>
          <Link
            href="/shop"
            className={`${poppins.className} text-purple-600 hover:text-purple-800 font-medium`}
          >
            Browse all items →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className="group"
            >
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <Image
                    src={product.imageUrls[0] || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="p-4">
                  <h3 className={`${poppins.className} font-semibold`}>
                    {product.name}
                  </h3>
                  <p className="text-gray-700">${product.price.toFixed(2)}</p>
                  <p className="text-sm text-gray-600 mt-1 capitalize">
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