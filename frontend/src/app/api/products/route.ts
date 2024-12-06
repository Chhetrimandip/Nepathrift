import { NextResponse } from 'next/server'
import { productsService } from '@/lib/services/products'
import { auth } from '@clerk/nextjs'

export async function POST(req: Request) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await req.json()
    const { images, ...productData } = data
    
    const product = await productsService.create({
      ...productData,
      sellerId: userId,
      status: 'available'
    }, images)

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const sellerId = searchParams.get('sellerId')
    
    if (sellerId) {
      const products = await productsService.getBySeller(sellerId)
      return NextResponse.json(products)
    }
    
    const products = await productsService.getAll()
    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
} 