import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { refId } = await request.json()
    const orderId = params.id

    // Verify payment with eSewa
    const verificationResponse = await fetch('https://uat.esewa.com.np/epay/transrec', {
      method: 'GET',
      params: {
        rid: refId,
        amt: order.total,
        scd: process.env.ESEWA_MERCHANT_CODE,
        pid: orderId,
      },
    })

    if (verificationResponse.ok) {
      // Update order status
      const updatedOrder = await db.order.update({
        where: { id: orderId },
        data: {
          status: 'paid',
          paymentDetails: {
            method: 'esewa',
            refId,
            verifiedAt: new Date(),
          },
        },
      })

      return NextResponse.json(updatedOrder)
    } else {
      throw new Error('Payment verification failed')
    }
  } catch (error) {
    console.error('Payment verification failed:', error)
    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 500 }
    )
  }
} 