'use client'

import { useEffect, useState } from 'react'
import { getAuth } from 'firebase/auth'
import { getSellerProducts, deleteProduct, Product } from '@/lib/firebase/products'
import Image from 'next/image'

export default function SellerProductsPage() {
  const auth = getAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const user = auth.currentUser
    if (user) {
      loadProducts(user.uid)
    }
  }, [auth.currentUser])

  const loadProducts = async (userId: string) => {
    setLoading(true)
    try {
      const products = await getSellerProducts(userId)
      setProducts(products)
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    
    try {
      await deleteProduct(productId)
      setProducts(products.filter(p => p.id !== productId))
    } catch (error) {
      console.error('Error deleting product:', error)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product.id} className="border rounded-lg p-4">
            {product.images?.[0] && (
              <Image 
                src={product.images[0]} 
                alt={product.name}
                width={200}
                height={200}
                className="w-full h-48 object-cover rounded-lg mb-2"
              />
            )}
            <h3 className="font-semibold">{product.name}</h3>
            <p className="text-gray-600">{product.description}</p>
            <p className="text-lg font-bold mt-2">${product.price}</p>
            <div className="mt-4 flex gap-2">
              <button 
                onClick={() => handleDelete(product.id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Delete
              </button>
              {/* Add edit button and functionality as needed */}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 