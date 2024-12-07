"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { sellersService, Seller } from '@/lib/services/sellers'
import { productsService, Product } from '@/lib/services/products'
import Link from 'next/link'
import Image from 'next/image'

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [seller, setSeller] = useState<Seller | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push('/auth/signin')
      return
    }

    const loadData = async () => {
      try {
        const sellerData = await sellersService.getCurrent()
        setSeller(sellerData)

        if (sellerData) {
          const productsData = await productsService.getBySeller(sellerData.id!)
          setProducts(productsData)
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [user, router])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!seller) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to NepaThrift!</h2>
          <p className="text-gray-600 mb-8">Complete your seller profile to start selling.</p>
          <Link
            href="/seller/profile"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
          >
            Complete Profile
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {seller.name}!</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Active Listings</h3>
          <p className="text-3xl font-bold text-purple-600">
            {products.filter(p => p.status === 'available').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Sold Items</h3>
          <p className="text-3xl font-bold text-green-600">
            {products.filter(p => p.status === 'sold').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Pending Sales</h3>
          <p className="text-3xl font-bold text-yellow-600">
            {products.filter(p => p.status === 'pending').length}
          </p>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Recent Listings</h2>
          <Link
            href="/sell"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
          >
            Add New Listing
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 4).map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {product.imageUrls?.[0] && (
                <div className="relative h-48">
                  <Image
                    src={product.imageUrls[0]}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                <p className="text-purple-600 font-bold">${product.price}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Status: {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 