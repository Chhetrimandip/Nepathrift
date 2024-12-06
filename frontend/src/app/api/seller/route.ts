import { NextResponse } from 'next/server'
import { db } from '@/backend/db'
import { sellers } from '@/backend/db/schema'
import { auth } from '@clerk/nextjs'
import { eq } from 'drizzle-orm'

export async function POST(req: Request) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await req.json()
    const seller = await db.insert(sellers).values({
      userId,
      ...data,
    }).returning()

    return NextResponse.json(seller[0])
  } catch (error) {
    console.error('Error creating seller profile:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const seller = await db
      .select()
      .from(sellers)
      .where(eq(sellers.userId, userId))
      .limit(1)

    if (!seller.length) {
      return NextResponse.json({ error: 'Seller profile not found' }, { status: 404 })
    }

    return NextResponse.json(seller[0])
  } catch (error) {
    console.error('Error fetching seller profile:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await req.json()
    const seller = await db
      .update(sellers)
      .set(data)
      .where(eq(sellers.userId, userId))
      .returning()

    return NextResponse.json(seller[0])
  } catch (error) {
    console.error('Error updating seller profile:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
} 