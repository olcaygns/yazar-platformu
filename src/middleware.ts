import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Eğer kullanıcı giriş yapmamışsa ve korumalı bir sayfaya erişmeye çalışıyorsa
  if (!session && (request.nextUrl.pathname.startsWith('/admin') || request.nextUrl.pathname.startsWith('/profil'))) {
    return NextResponse.redirect(new URL('/giris', request.url))
  }

  // Eğer kullanıcı giriş yapmışsa ve giriş/kayıt sayfalarına erişmeye çalışıyorsa
  if (session && (request.nextUrl.pathname === '/giris' || request.nextUrl.pathname === '/kayit')) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return res
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
} 