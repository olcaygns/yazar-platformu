'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface BookData {
  title: string
  description: string
  content: string
  cover_image: string
  published: boolean
}

export default function EditBook({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<BookData>({
    title: '',
    description: '',
    content: '',
    cover_image: '',
    published: false
  })

  useEffect(() => {
    fetchBook()
  }, [])

  async function fetchBook() {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('id', params.id)
        .single()

      if (error) throw error

      if (data) {
        setFormData({
          title: data.title,
          description: data.description || '',
          content: data.content || '',
          cover_image: data.cover_image || '',
          published: data.published
        })
      }
    } catch (error) {
      console.error('Kitap yüklenirken hata:', error)
      alert('Kitap yüklenirken bir hata oluştu')
      router.push('/admin/kitaplar')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from('books')
        .update(formData)
        .eq('id', params.id)

      if (error) throw error

      router.push('/admin/kitaplar')
    } catch (error) {
      console.error('Kitap güncellenirken hata:', error)
      alert('Kitap güncellenirken bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const togglePublished = () => {
    setFormData(prev => ({ ...prev, published: !prev.published }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Kitabı Düzenle</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Kitap Başlığı
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Açıklama
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="content" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            İçerik
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            className="flex min-h-[300px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="cover_image" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Kapak Görseli URL
          </label>
          <input
            id="cover_image"
            name="cover_image"
            type="url"
            value={formData.cover_image}
            onChange={handleChange}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={togglePublished}
            className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-sm font-medium ${
              formData.published
                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
            }`}
          >
            {formData.published ? 'Yayında' : 'Taslak'}
          </button>
          <span className="text-sm text-gray-500">
            Durumu değiştirmek için tıklayın
          </span>
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          >
            {loading ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/kitaplar')}
            className="inline-flex items-center justify-center rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            İptal
          </button>
        </div>
      </form>
    </div>
  )
} 