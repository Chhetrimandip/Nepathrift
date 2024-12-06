"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { productsService, Product } from "@/lib/services/products"

export default function ItemGrid() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await productsService.getAll()
        // Only show the first 8 products on the homepage
        setProducts(fetchedProducts.slice(0, 8))
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (loading) {
    return (
      <div className="py-12 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <section className="py-12">
      <h2 className="text-2xl font-bold text-center mb-8">Featured Items</h2>
      {products.length === 0 ? (
        <p className="text-center text-gray-600">No items available right now.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
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
                  <h3 className="font-semibold text-gray-800">{product.name}</h3>
                  <p className="text-gray-600">${product.price.toFixed(2)}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
      <div className="text-center mt-8">
        <Link
          href="/shop"
          className="text-purple-600 hover:text-purple-800 font-semibold"
        >
          View All Items →
        </Link>
      </div>
    </section>
  )
}

