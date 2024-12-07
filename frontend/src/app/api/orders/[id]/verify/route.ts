import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const orderRef = adminDb.collection('orders').doc(params.id)
    const orderSnap = await orderRef.get()
    
    if (!orderSnap.exists) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const orderData = orderSnap.data()
    return NextResponse.json({ 
      id: orderSnap.id,
      ...orderData
    })
  } catch (error) {
    console.error('Error verifying order:', error)
    return NextResponse.json({ error: 'Failed to verify order' }, { status: 500 })
  }
} 