import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    console.log('middleware')
  const path = request.nextUrl.pathname
  const isPublicPath = path === '/' || path === '/auth/sign-in' || path === '/auth/sign-up'

  const token = request.cookies.get('auth_token')?.value || ''

  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/auth/sign-in', request.url))
  }
}

// export const config = {
//   matcher: ['/', '/dashboard/:path*', '/auth/:path*'],
// }
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
  }