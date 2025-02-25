'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface Book {
  id: string
  title: string
  description: string
  content: string
  cover_image: string
  published: boolean
}

interface EditBookFormProps {
  book: Book
}

export default function EditBookForm({ book }: EditBookFormProps) {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: book.title,
    description: book.description || '',
    content: book.content || '',
    cover_image: book.cover_image || '',
    published: book.published
  })
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error: updateError } = await supabase
        .from('books')
        .update({
          title: formData.title,
          description: formData.description,
          content: formData.content,
          cover_image: formData.cover_image,
          published: formData.published,
          updated_at: new Date().toISOString()
        })
        .eq('id', book.id)

      if (updateError) throw updateError

      router.refresh()
      router.push('/admin/kitaplar')
    } catch (err) {
      console.error('Güncelleme hatası:', err)
      setError('Kitap güncellenirken bir hata oluştu.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')
  }

  const togglePublished = () => {
    setFormData(prev => ({ ...prev, published: !prev.published }))
    setError('')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-8">Kitap Düzenle</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium">
            Başlık
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium">
            Açıklama
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium">
            İçerik
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows={10}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="cover_image" className="block text-sm font-medium">
            Kapak Görseli URL
          </label>
          <input
            type="url"
            id="cover_image"
            name="cover_image"
            value={formData.cover_image}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={togglePublished}
            className={`px-4 py-2 rounded-md ${
              formData.published
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-yellow-600 text-white hover:bg-yellow-700'
            }`}
          >
            {formData.published ? 'Yayında' : 'Taslak'}
          </button>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          İptal
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Kaydediliyor...' : 'Kaydet'}
        </button>
      </div>
    </form>
  )
} 