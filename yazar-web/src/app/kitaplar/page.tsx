'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'

interface Book {
  id: string
  title: string
  description: string
  cover_image: string
  published: boolean
  created_at: string
  author: {
    full_name: string
  }
}

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBooks()
  }, [])

  async function fetchBooks() {
    try {
      const { data, error } = await supabase
        .from('books')
        .select(`
          *,
          author:users(full_name)
        `)
        .eq('published', true)
        .order('created_at', { ascending: false })

      if (error) throw error

      setBooks(data || [])
    } catch (error) {
      console.error('Kitaplar yüklenirken hata:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Yükleniyor...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Kitaplar</h1>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {books.map((book) => (
          <Link href={`/kitaplar/${book.id}`} key={book.id} className="group">
            <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="relative aspect-[3/4] w-full">
                {book.cover_image ? (
                  <Image
                    src={book.cover_image}
                    alt={book.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-400 text-sm">Kapak yok</span>
                  </div>
                )}
              </div>
              <div className="p-3">
                <h2 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-2">
                  {book.title}
                </h2>
                <p className="text-xs text-gray-600 mt-1 line-clamp-1">
                  {book.author?.full_name}
                </p>
                {book.description && (
                  <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                    {book.description}
                  </p>
                )}
                <div className="mt-2 text-[10px] text-gray-400">
                  {new Date(book.created_at).toLocaleDateString('tr-TR')}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {books.length === 0 && (
        <div className="text-center py-8">
          <h3 className="text-lg font-medium text-gray-900">Henüz kitap yok</h3>
          <p className="mt-2 text-sm text-gray-500">
            Şu anda yayınlanmış kitap bulunmuyor.
          </p>
        </div>
      )}
    </div>
  )
} 