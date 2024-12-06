import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const orderData = await request.json()
    
    // Create order in database
    const order = await db.order.create({
      data: {
        ...orderData,
        userId: session.user.id,
        status: 'pending',
      }
    })

    return NextResponse.json(order)
  } catch (error) {
    console.error('Order creation failed:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
} 