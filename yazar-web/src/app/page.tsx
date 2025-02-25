'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const [session, setSession] = React.useState<any>(null)
  const [isAdmin, setIsAdmin] = React.useState(false)
  const router = useRouter()

  React.useEffect(() => {
    async function checkSession() {
      try {
        // 1. Oturum bilgisini al
        const { data: { session } } = await supabase.auth.getSession()
        console.log('DEBUG - Session:', session)
        setSession(session)

        if (session) {
          // 2. Kullanıcı bilgilerini al
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('role')
            .eq('id', session.user.id)
            .single()

          console.log('DEBUG - User Data:', userData)

          if (userData?.role === 'admin') {
            console.log('DEBUG - Admin rolü tespit edildi')
            setIsAdmin(true)
          }
        }
      } catch (error) {
        console.error('DEBUG - Genel Hata:', error)
      }
    }

    checkSession()

    // Oturum değişikliklerini dinle
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('DEBUG - Auth State Change:', _event, session)
      setSession(session)
      if (!session) {
        setIsAdmin(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      setSession(null)
      setIsAdmin(false)
      router.refresh()
    } catch (error) {
      console.error('DEBUG - Çıkış hatası:', error)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="text-2xl font-bold">
              Yazar Platformu
            </Link>
            <div className="text-xs text-gray-500">
              {session ? `Giriş yapıldı (${isAdmin ? 'Admin' : 'User'}) - ${session.user.email}` : 'Giriş yapılmadı'}
            </div>
            <nav className="flex gap-4">
              {session ? (
                <>
                  {isAdmin && (
                    <Link 
                      href="/admin" 
                      className="text-sm font-medium text-purple-600 hover:text-purple-700"
                    >
                      Admin Paneli
                    </Link>
                  )}
                  <Link 
                    href="/kitaplar" 
                    className="text-sm font-medium hover:text-primary"
                  >
                    Kitaplar
                  </Link>
                  <Link 
                    href="/profil" 
                    className="text-sm font-medium hover:text-primary"
                  >
                    Profilim
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="text-sm font-medium text-red-600 hover:text-red-700"
                  >
                    Çıkış Yap
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    href="/giris" 
                    className="text-sm font-medium hover:text-primary"
                  >
                    Giriş Yap
                  </Link>
                  <Link 
                    href="/kayit" 
                    className="text-sm font-medium hover:text-primary"
                  >
                    Kayıt Ol
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
              Kitaplarınızı Okuyucularınızla Buluşturun
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Modern ve kullanıcı dostu bir platform ile kitaplarınızı paylaşın ve okuyucularınızla buluşturun.
            </p>
            {!session && (
              <div className="flex justify-center gap-4">
                <Link 
                  href="/giris" 
                  className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Giriş Yap
                </Link>
                <Link 
                  href="/kayit" 
                  className="inline-flex items-center justify-center rounded-md bg-secondary px-8 py-3 text-sm font-medium text-secondary-foreground hover:bg-secondary/90"
                >
                  Kayıt Ol
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <p className="text-sm text-muted-foreground">
              © 2024 Yazar Platformu. Tüm hakları saklıdır.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
} 