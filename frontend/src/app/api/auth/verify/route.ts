import { NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebase-admin'

export async function POST(request: Request) {
  try {
    const { token } = await request.json()
    
    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 })
    }

    const decodedToken = await adminAuth.verifyIdToken(token)
    return NextResponse.json({ uid: decodedToken.uid })
  } catch (error) {
    console.error('Error verifying token:', error)
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }
} 