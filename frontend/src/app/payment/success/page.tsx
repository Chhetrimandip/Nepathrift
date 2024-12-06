"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { productsService } from "@/lib/services/products"

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
          // Update order status in your backend
          await productsService.updateOrderStatus(oid, "paid", refId)
          // Redirect to order confirmation
          router.push(`/orders/${oid}`)
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