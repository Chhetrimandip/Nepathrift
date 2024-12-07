import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { Loader2 } from 'lucide-react'

const OrderDetailsContent = dynamic(() => import('./OrderDetailsContent'), { 
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  )
})

export const runtime = 'edge'
export const revalidate = 0

export default function OrderPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    }>
      <OrderDetailsContent />
    </Suspense>
  )
}