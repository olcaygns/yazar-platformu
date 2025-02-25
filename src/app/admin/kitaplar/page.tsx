'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

interface Book {
  id: string
  title: string
  description: string
  published: boolean
  created_at: string
  author: {
    full_name: string
  }
}

export default function AdminBooks() {
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
        .order('created_at', { ascending: false })

      if (error) throw error

      setBooks(data || [])
    } catch (error) {
      console.error('Kitaplar yüklenirken hata:', error)
    } finally {
      setLoading(false)
    }
  }

  async function togglePublished(id: string, currentStatus: boolean) {
    try {
      const { error } = await supabase
        .from('books')
        .update({ published: !currentStatus })
        .eq('id', id)

      if (error) throw error

      // Listeyi güncelle
      setBooks(books.map(book => 
        book.id === id ? { ...book, published: !currentStatus } : book
      ))
    } catch (error) {
      console.error('Kitap güncellenirken hata:', error)
    }
  }

  async function deleteBook(id: string) {
    if (!window.confirm('Bu kitabı silmek istediğinizden emin misiniz?')) {
      return
    }

    try {
      const { error } = await supabase
        .from('books')
        .delete()
        .eq('id', id)

      if (error) throw error

      // Listeyi güncelle
      setBooks(books.filter(book => book.id !== id))
    } catch (error) {
      console.error('Kitap silinirken hata:', error)
    }
  }

  if (loading) {
    return <div>Yükleniyor...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Kitaplar</h2>
        <Link
          href="/admin/kitaplar/ekle"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Yeni Kitap Ekle
        </Link>
      </div>

      <div className="rounded-md border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Başlık
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Yazar
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Durum
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {books.map((book) => (
              <tr key={book.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {book.title}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {book.author?.full_name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => togglePublished(book.id, book.published)}
                    className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                      book.published
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {book.published ? 'Yayında' : 'Taslak'}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <Link
                    href={`/admin/kitaplar/${book.id}`}
                    className="text-primary hover:text-primary/80"
                  >
                    Düzenle
                  </Link>
                  <button
                    onClick={() => deleteBook(book.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Sil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 