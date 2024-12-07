"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ordersService } from "@/lib/services/orders"

export const runtime = 'edge'
export const revalidate = 0

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  useEffect(() => {
    const verifyPayment = async () => {
      const oid = searchParams.get("oid")      // Order ID
      const amt = searchParams.get("amt")      // Amount
      const refId = searchParams.get("refId")  // eSewa reference ID
      
      if (oid && amt && refId) {
        try {
          // Verify payment with the backend
          await ordersService.verify(oid, refId)
          // Redirect to order confirmation
          router.push(`/orders/${oid}/confirmation`)
        } catch (error) {
          console.error("Payment verification failed:", error)
          router.push("/payment/failed")
        }
      }
    }
    
    verifyPayment()
  }, [router, searchParams])

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-2xl font-bold mb-4">Processing your payment...</h1>
      <p>Please wait while we verify your payment.</p>
    </div>
  )
} 