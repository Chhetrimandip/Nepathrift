import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  
  // Paths that require authentication
  const protectedPaths = ['/dashboard', '/sell']
  
  // Public paths that should bypass auth check
  const publicPaths = ['/auth/signin', '/auth/signup', '/']
  
  // If it's a public path, allow access
  if (publicPaths.some(prefix => path.startsWith(prefix))) {
    return NextResponse.next()
  }

  // Check if the current path is protected
  if (protectedPaths.some(prefix => path.startsWith(prefix))) {
    // Get the Firebase auth session cookie
    const session = request.cookies.get('__session')
    
    if (!session) {
      // Redirect to sign in if no session is present
      const signInUrl = new URL('/auth/signin', request.url)
      signInUrl.searchParams.set('redirect', path)
      return NextResponse.redirect(signInUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/sell/:path*',
    '/auth/:path*',
    '/orders/:path*',
    '/payment/:path*'
  ]
}