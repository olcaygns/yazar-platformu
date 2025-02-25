'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'

interface Book {
  id: string
  title: string
  description: string
  content: string
  cover_image: string
  published: boolean
  created_at: string
  author: {
    full_name: string
  }
}

export default function BookDetailPage({ params }: { params: { id: string } }) {
  const [book, setBook] = useState<Book | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBook()
  }, [])

  async function fetchBook() {
    try {
      const { data, error } = await supabase
        .from('books')
        .select(`
          *,
          author:users(full_name)
        `)
        .eq('id', params.id)
        .single()

      if (error) throw error

      if (data && !data.published) {
        throw new Error('Bu kitap henüz yayınlanmamış')
      }

      setBook(data)
    } catch (error) {
      console.error('Kitap yüklenirken hata:', error)
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

  if (!book) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Kitap bulunamadı</h2>
          <p className="text-gray-500 mt-2">
            Bu kitap mevcut değil veya henüz yayınlanmamış.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sol Taraf - Kapak ve Meta Bilgiler */}
        <div className="md:col-span-1">
          <div className="sticky top-8">
            <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden shadow-lg">
              {book.cover_image ? (
                <Image
                  src={book.cover_image}
                  alt={book.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400">Kapak yok</span>
                </div>
              )}
            </div>
            <div className="mt-6 space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Yazar</h3>
                <p className="mt-1">{book.author?.full_name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Yayın Tarihi
                </h3>
                <p className="mt-1">
                  {new Date(book.created_at).toLocaleDateString('tr-TR')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sağ Taraf - İçerik */}
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold">{book.title}</h1>
          
          {book.description && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-3">Kitap Hakkında</h2>
              <p className="text-gray-600 leading-relaxed">
                {book.description}
              </p>
            </div>
          )}

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">İçerik</h2>
            <div className="prose prose-lg max-w-none">
              {book.content}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 