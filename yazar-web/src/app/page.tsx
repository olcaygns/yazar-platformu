'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { FaTwitter, FaInstagram, FaLinkedin, FaGithub } from 'react-icons/fa'

interface Book {
  id: string
  title: string
  description: string
  cover_image: string
  created_at: string
  genre: string
}

export default function HomePage() {
  const [books, setBooks] = React.useState<Book[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    async function fetchData() {
      try {
        // Tüm kitapları getir
        const { data: books, error: booksError } = await supabase
          .from('books')
          .select('id, title, description, cover_image, created_at, genre')
          .eq('published', true)
          .order('created_at', { ascending: false })

        if (booksError) throw booksError
        setBooks(books || [])
      } catch (error) {
        console.error('Veri yüklenirken hata:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Kitap sayısına göre grid sütun sayısını belirle
  const getGridCols = (length: number) => {
    if (length % 4 === 0) return 'sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
    if (length % 3 === 0) return 'sm:grid-cols-2 md:grid-cols-3'
    return 'sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
  }

  // Tür badge'ının rengini belirle
  const getGenreColor = (genre: string) => {
    const colors: { [key: string]: string } = {
      'Bilim Kurgu': 'bg-blue-100 text-blue-800',
      'Fantastik': 'bg-purple-100 text-purple-800',
      'Macera': 'bg-green-100 text-green-800',
      'Polisiye': 'bg-red-100 text-red-800',
      'Roman': 'bg-yellow-100 text-yellow-800',
      'Romantik': 'bg-pink-100 text-pink-800'
    }
    return colors[genre] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="h-16"></div> {/* Navbar için boşluk */}
      <main className="flex-1">
        {/* Hero Section */}
        <section id="hero" className="relative w-full min-h-[80vh] flex items-center justify-center bg-gradient-to-b from-purple-50 via-white to-white overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-[url('/images/hero-pattern.png')] opacity-10"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-purple-50/80 via-white/95 to-white"></div>
          </div>
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center space-y-8 text-center">
              <div className="space-y-4 max-w-3xl">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-400 pb-2 pt-2">
                  Özdemir Kitap Platformu'na Hoşgeldiniz
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-600 md:text-xl mt-8">
                  Kelimelerin büyülü dünyasında yolculuğa çıkmaya hazır mısınız?
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 min-w-[200px]">
                <Link
                  className="inline-flex h-11 items-center justify-center rounded-full bg-purple-600 px-8 text-sm font-medium text-white shadow-lg shadow-purple-600/20 transition-all hover:bg-purple-700 hover:shadow-purple-600/30 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                  href="#kitaplar"
                >
                  Kitapları Keşfet
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Kitaplar Section */}
        <section id="kitaplar" className="w-full py-24 bg-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-4">Kitaplar</h2>
              <div className="w-20 h-1 bg-purple-600 rounded-full"></div>
            </div>
            <div className={`grid grid-cols-1 ${getGridCols(books.length)} gap-6 max-w-7xl mx-auto`}>
              {books.map((book) => (
                <div 
                  key={book.id}
                  className="group relative bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl hover:border-purple-100 transition-all duration-300"
                >
                  <div className="aspect-[3/4] relative overflow-hidden rounded-t-xl">
                    <Image
                      src={book.cover_image || '/images/default-book-cover.jpg'}
                      alt={book.title}
                      fill
                      className="object-cover transform group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className={`absolute top-3 right-3 px-3 py-1.5 rounded-full text-xs font-medium shadow-sm backdrop-blur-sm bg-white/70 ${getGenreColor(book.genre)}`}>
                      {book.genre}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-lg text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2 mb-3">
                      {book.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-5">
                      {book.description}
                    </p>
                    <Link
                      href={`/kitaplar/${book.id}`}
                      className="inline-flex items-center justify-center w-full px-4 py-2.5 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors duration-300 shadow-sm hover:shadow-md"
                    >
                      Kitaba Git
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Hakkımda Section */}
        <section id="hakkimda" className="w-full py-24 bg-gray-50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-4">Hakkımda</h2>
              <div className="w-20 h-1 bg-purple-600 rounded-full"></div>
            </div>
            <div className="max-w-3xl mx-auto text-center">
              <div className="relative w-48 h-48 mx-auto mb-8 rounded-full overflow-hidden ring-4 ring-purple-600 ring-offset-4">
                <Image
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3"
                  alt="Profil"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Özdemir</h3>
              <p className="text-gray-600 leading-relaxed mb-8">
                Merhaba! Ben Özdemir. 15 yıldır yazarlık yapıyorum. Özellikle bilim kurgu ve fantastik edebiyat alanında eserler veriyorum. 
                Şimdiye kadar 10'dan fazla kitap yayınladım ve çeşitli edebiyat ödüllerine layık görüldüm.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Bu platform üzerinden kitaplarımı sizlerle paylaşıyor ve yeni projelerimi duyuruyorum. 
                Ayrıca yazarlık yolculuğuma dair deneyimlerimi ve düşüncelerimi de burada bulabilirsiniz.
              </p>
            </div>
          </div>
        </section>

        {/* İletişim Section */}
        <section id="iletisim" className="w-full py-24 bg-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-4">İletişim</h2>
              <div className="w-20 h-1 bg-purple-600 rounded-full"></div>
            </div>
            <div className="max-w-3xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* İletişim Formu */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold mb-6">Mesaj Gönder</h3>
                  <form className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Ad Soyad
                      </label>
                      <input
                        type="text"
                        id="name"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        E-posta
                      </label>
                      <input
                        type="email"
                        id="email"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                        Mesaj
                      </label>
                      <textarea
                        id="message"
                        rows={4}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      className="w-full rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                    >
                      Gönder
                    </button>
                  </form>
                </div>

                {/* Sosyal Medya ve İletişim Bilgileri */}
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-6">Sosyal Medya</h3>
                    <div className="flex space-x-4">
                      <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-purple-600">
                        <FaTwitter size={24} />
                      </a>
                      <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-purple-600">
                        <FaInstagram size={24} />
                      </a>
                      <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-purple-600">
                        <FaLinkedin size={24} />
                      </a>
                      <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-purple-600">
                        <FaGithub size={24} />
                      </a>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-6">İletişim Bilgileri</h3>
                    <div className="space-y-2 text-gray-600">
                      <p>Email: iletisim@ozdemir.com</p>
                      <p>Adres: İstanbul, Türkiye</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
} 