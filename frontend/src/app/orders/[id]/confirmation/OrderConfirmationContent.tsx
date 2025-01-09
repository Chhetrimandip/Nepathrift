'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Order } from '@/lib/services/checkout'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

export default function OrderConfirmationContent(): JSX.Element {
  const params = useParams()
  const { user } = useAuth()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      if (!user) return
      try {
        const orderDoc = await getDoc(doc(db, 'orders', params.id as string))
        if (orderDoc.exists()) {
          setOrder({ id: orderDoc.id, ...orderDoc.data() } as Order)
        }
      } catch (error) {
        console.error('Error fetching order:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [params.id, user])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Order not found</h1>
        <Link href="/orders" className="text-purple-600 hover:text-purple-800">
          View All Orders
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="text-center mb-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            Order Confirmed!
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Thank you for your purchase. Your order has been confirmed.
          </p>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
            Order Details
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            Order ID: {order.id}
          </p>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Total: ${order.price.toFixed(2)}
          </p>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/orders"
            className="text-purple-600 hover:text-purple-800 font-medium"
          >
            View All Orders
          </Link>
        </div>
      </div>
    </div>
  )
} 