'use client'

import dynamic from 'next/dynamic'
import { db } from '@/lib/firebase'

const EditProductContent = dynamic(() => import('./EditProductContent'), { ssr: false })

export default function EditProductPage() {
  return <EditProductContent />
} 