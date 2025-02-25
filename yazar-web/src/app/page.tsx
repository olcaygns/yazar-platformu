'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface Book {
  id: string
  title: string
  description: string
  cover_image: string
  created_at: string
}

interface Announcement {
  id: string
  title: string
  content: string
  created_at: string
  image_url?: string
}

export default function HomePage() {
  const [latestBooks, setLatestBooks] = React.useState<Book[]>([])
  const [announcements, setAnnouncements] = React.useState<Announcement[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    async function fetchData() {
      try {
        // Son kitapları getir
        const { data: books, error: booksError } = await supabase
          .from('books')
          .select('id, title, description, cover_image, created_at')
          .eq('published', true)
          .order('created_at', { ascending: false })
          .limit(3)

        if (booksError) throw booksError
        setLatestBooks(books || [])

        // Son duyuruları getir
        const { data: announcements, error: announcementsError } = await supabase
          .from('announcements')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(3)

        if (announcementsError) throw announcementsError
        setAnnouncements(announcements || [])
      } catch (error) {
        console.error('Veri yüklenirken hata:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full min-h-[80vh] flex items-center justify-center bg-gradient-to-b from-purple-50 via-white to-white overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-[url('/images/hero-pattern.png')] opacity-10"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-purple-50/80 via-white/95 to-white"></div>
          </div>
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center space-y-8 text-center">
              <div className="space-y-4 max-w-3xl">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-400 pb-2">
                  Yazar Adı'nın Platformu'na Hoşgeldiniz
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-600 md:text-xl mt-8">
                  Kelimelerin büyülü dünyasında yolculuğa çıkmaya hazır mısınız?
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 min-w-[200px]">
                <Link
                  className="inline-flex h-11 items-center justify-center rounded-full bg-purple-600 px-8 text-sm font-medium text-white shadow-lg shadow-purple-600/20 transition-all hover:bg-purple-700 hover:shadow-purple-600/30 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                  href="/kitaplar"
                >
                  Kitapları Keşfet
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Son Kitaplar Section */}
        <section className="w-full py-12 bg-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center mb-8">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-4">Son Kitaplar</h2>
              <div className="w-20 h-1 bg-purple-600 rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 justify-items-center max-w-5xl mx-auto">
              {latestBooks.map((book) => (
                <Link 
                  key={book.id} 
                  href={`/kitaplar/${book.id}`}
                  className="group flex flex-col bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-200 w-full max-w-[200px]"
                >
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100">
                    <Image
                      src={book.cover_image || '/images/default-book-cover.jpg'}
                      alt={book.title}
                      fill
                      className="object-cover transform group-hover:scale-105 transition-transform duration-200"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-sm text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2">
                      {book.title}
                    </h3>
                    <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                      {book.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Duyurular Section */}
        <section className="w-full py-16 bg-gray-50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-4">Duyurular</h2>
              <div className="w-20 h-1 bg-purple-600 rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {announcements.map((announcement) => (
                <div 
                  key={announcement.id} 
                  className="group bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-200"
                >
                  <div className="relative h-40 w-full overflow-hidden">
                    <Image
                      src={announcement.image_url || '/images/default-announcement.jpg'}
                      alt={announcement.title}
                      fill
                      className="object-cover transform group-hover:scale-105 transition-transform duration-200"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="font-medium text-white text-lg group-hover:text-purple-200 transition-colors">
                        {announcement.title}
                      </h3>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {announcement.content}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {new Date(announcement.created_at).toLocaleDateString('tr-TR')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
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