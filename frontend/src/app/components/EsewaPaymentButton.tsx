"use client"

import { paymentService } from "@/lib/services/payment"

interface EsewaPaymentButtonProps {
  orderId: string
  amount: number
  className?: string
}

export default function EsewaPaymentButton({ orderId, amount, className = "" }: EsewaPaymentButtonProps) {
  const handlePayment = () => {
    paymentService.initiateEsewaPayment(orderId, amount)
  }

  return (
    <button
      onClick={handlePayment}
      className={`bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition-colors flex items-center justify-center ${className}`}
    >
      Pay with eSewa
    </button>
  )
} 