"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { productsService, Product } from "@/lib/services/products"
import Link from "next/link"
import { Edit, Trash2 } from "lucide-react"

export default function SellerDashboard() {
  const { user, isLoaded } = useUser()
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user?.id) return

    const fetchProducts = async () => {
      try {
        const products = await productsService.getBySeller(user.id)
        setProducts(products)
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [user?.id])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      await productsService.delete(id)
      setProducts(products.filter(p => p.id !== id))
    } catch (error) {
      console.error('Error deleting product:', error)
    }
  }

  if (!isLoaded || isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Please sign in to access your dashboard</h1>
        <Link href="/sign-in" className="text-purple-600 hover:text-purple-800">
          Sign In
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Seller Dashboard</h1>
        <Link 
          href="/sell" 
          className="bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition duration-300"
        >
          List New Product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">You haven't listed any products yet.</p>
          <Link 
            href="/sell" 
            className="text-purple-600 hover:text-purple-800"
          >
            Start selling now
          </Link>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img 
                          className="h-10 w-10 rounded-full object-cover" 
                          src={product.imageUrls[0] || '/placeholder.svg'} 
                          alt="" 
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${product.status === 'available' ? 'bg-green-100 text-green-800' : 
                        product.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-gray-100 text-gray-800'}`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link 
                      href={`/edit-product/${product.id}`}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      <Edit className="inline-block" size={18} />
                    </Link>
                    <button 
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="inline-block" size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
} 