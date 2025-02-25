import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  try {
    const res = NextResponse.next()
    const supabase = createMiddlewareClient({ req: request, res })

    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Admin paneli kontrolü
    if (request.nextUrl.pathname.startsWith('/admin')) {
      if (!session) {
        return NextResponse.redirect(new URL('/giris', request.url))
      }

      // Kullanıcının rolünü kontrol et
      const { data: userData, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', session.user.id)
        .single()

      if (error) {
        console.error('Rol kontrolü hatası:', error)
        return NextResponse.redirect(new URL('/', request.url))
      }

      if (!userData || userData.role !== 'admin') {
        return NextResponse.redirect(new URL('/', request.url))
      }
    }

    // Profil sayfası kontrolü
    if (!session && request.nextUrl.pathname.startsWith('/profil')) {
      return NextResponse.redirect(new URL('/giris', request.url))
    }

    // Giriş yapan kullanıcıyı giriş/kayıt sayfalarından ana sayfaya yönlendir
    if (session && (request.nextUrl.pathname === '/giris' || request.nextUrl.pathname === '/kayit')) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    return res
  } catch (error) {
    console.error('Middleware hatası:', error)
    return NextResponse.redirect(new URL('/giris', request.url))
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
} 