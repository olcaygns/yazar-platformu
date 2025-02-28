'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export function Navbar() {
  const [session, setSession] = React.useState<any>(null)
  const [isAdmin, setIsAdmin] = React.useState(false)
  const router = useRouter()
  const [activeSection, setActiveSection] = React.useState('hero')

  React.useEffect(() => {
    async function checkSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setSession(session)

        if (session) {
          const { data: userData } = await supabase
            .from('users')
            .select('role')
            .eq('id', session.user.id)
            .single()

          if (userData?.role === 'admin') {
            setIsAdmin(true)
          }
        }
      } catch (error) {
        console.error('Hata:', error)
      }
    }

    checkSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session)
      if (!session) {
        setIsAdmin(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  React.useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'kitaplar', 'hakkimda', 'iletisim']
      const scrollPosition = window.scrollY + 100 // Navbar yüksekliği için offset

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const top = element.offsetTop
          const height = element.offsetHeight
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      setSession(null)
      setIsAdmin(false)
      router.refresh()
    } catch (error) {
      console.error('Çıkış hatası:', error)
    }
  }

  return (
    <header className="w-full border-b fixed top-0 bg-white z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link className="flex items-center space-x-2" href="/">
            <span className="inline-block text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-400">ÖZDEMİR</span>
          </Link>
          
          <div className="flex items-center space-x-8">
            <nav className="hidden md:flex space-x-6">
              <Link
                className={`text-sm font-medium transition-colors ${
                  activeSection === 'hero'
                    ? 'text-purple-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                href="/#hero"
              >
                Ana Sayfa
              </Link>
              <Link
                className={`text-sm font-medium transition-colors ${
                  activeSection === 'kitaplar'
                    ? 'text-purple-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                href="/#kitaplar"
              >
                Kitaplar
              </Link>
              <Link
                className={`text-sm font-medium transition-colors ${
                  activeSection === 'hakkimda'
                    ? 'text-purple-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                href="/#hakkimda"
              >
                Hakkımda
              </Link>
              <Link
                className={`text-sm font-medium transition-colors ${
                  activeSection === 'iletisim'
                    ? 'text-purple-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                href="/#iletisim"
              >
                İletişim
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
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
                    href="/profil" 
                    className="text-sm font-medium text-gray-600 hover:text-gray-900"
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
                <Link 
                  href="/giris" 
                  className="inline-flex h-9 items-center justify-center rounded-md bg-purple-600 px-4 text-sm font-medium text-white hover:bg-purple-700 transition-colors"
                >
                  Giriş Yap
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
} 