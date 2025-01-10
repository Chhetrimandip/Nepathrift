import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  try {
    const path = request.nextUrl.pathname
    
    // Paths that require authentication
    const protectedPaths = ['/dashboard', '/sell', '/orders', '/payment']
    
    // Public paths that should bypass auth check
    const publicPaths = ['/auth/signin', '/auth/signup', '/', '/shop']
    
    // If it's a public path, allow access
    if (publicPaths.some(prefix => path.startsWith(prefix))) {
      return NextResponse.next()
    }

    // Check if the current path is protected
    if (protectedPaths.some(prefix => path.startsWith(prefix))) {
      const session = request.cookies.get('__session')
      
      if (!session) {
        const signInUrl = new URL('/auth/signin', request.url)
        signInUrl.searchParams.set('redirect', path)
        return NextResponse.redirect(signInUrl)
      }
    }

    return NextResponse.next()
  } catch (error) {
    console.error('Middleware error:', error)
    // Redirect to error page or home page in case of error
    return NextResponse.redirect(new URL('/', request.url))
  }
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