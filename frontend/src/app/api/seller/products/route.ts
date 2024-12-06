import { NextResponse } from 'next/server'
import { db } from '@/backend/db'
import { products } from '@/backend/db/schema'
import { auth } from '@clerk/nextjs'
import { eq } from 'drizzle-orm'

export async function GET(req: Request) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const sellerProducts = await db
      .select()
      .from(products)
      .where(eq(products.sellerId, userId))

    return NextResponse.json(sellerProducts)
  } catch (error) {
    console.error('Error fetching seller products:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const productId = searchParams.get('id')

    if (!productId) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 })
    }

    const result = await db
      .delete(products)
      .where(eq(products.id, parseInt(productId)))
      .returning()

    return NextResponse.json(result[0])
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
} 