import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('firebase-token')
  const path = request.nextUrl.pathname
  
  // Paths that require authentication
  const protectedPaths = ['/dashboard', '/sell']
  
  // Check if the current path is protected
  if (protectedPaths.some(prefix => path.startsWith(prefix))) {
    if (!token) {
      // Redirect to sign in if no token is present
      return NextResponse.redirect(new URL('/auth/signin', request.url))
    }
  }

  return NextResponse.next()
}

// Update the matcher to include all protected paths
export const config = {
  matcher: ['/dashboard/:path*', '/sell/:path*']
}