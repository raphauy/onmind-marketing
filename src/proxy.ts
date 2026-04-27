import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { prisma } from '@/lib/prisma'

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const publicRoutes = ['/', '/login', '/api/auth', '/api/cron']
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || (route !== '/' && pathname.startsWith(`${route}/`))
  )

  // Endpoint público que sirve la imagen de una pieza (proxy del Blob).
  // Necesario para publicar en Instagram: Meta no puede fetchear directo del Blob.
  const isPublicPieceImage =
    pathname.startsWith('/api/piezas/') && pathname.endsWith('/image')

  if (isPublicRoute || isPublicPieceImage) {
    return NextResponse.next()
  }

  const useSecureCookies = process.env.NEXTAUTH_URL?.startsWith('https://') ?? process.env.NODE_ENV === 'production'
  const cookieName = useSecureCookies
    ? '__Secure-authjs.session-token'
    : 'authjs.session-token'

  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
    cookieName,
  })

  if (!token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  const user = await prisma.user.findUnique({
    where: { id: token.id as string },
    select: { isActive: true },
  })

  if (!user || !user.isActive) {
    const response = NextResponse.redirect(new URL('/login', request.url))
    response.cookies.delete('authjs.session-token')
    response.cookies.delete('__Secure-authjs.session-token')
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|pdf)$).*)',
  ],
}
