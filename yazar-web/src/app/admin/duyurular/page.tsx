'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'

interface Announcement {
  id: string
  title: string
  content: string
  image_url: string | null
  created_at: string
}

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  async function fetchAnnouncements() {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setAnnouncements(data || [])
    } catch (error) {
      console.error('Duyurular yüklenirken hata:', error)
    } finally {
      setLoading(false)
    }
  }

  async function deleteAnnouncement(id: string) {
    if (!window.confirm('Bu duyuruyu silmek istediğinizden emin misiniz?')) {
      return
    }

    try {
      const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', id)

      if (error) throw error

      setAnnouncements(announcements.filter(announcement => announcement.id !== id))
    } catch (error) {
      console.error('Duyuru silinirken hata:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Duyurular</h2>
        <Link
          href="/admin/duyurular/ekle"
          className="inline-flex items-center justify-center rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          Yeni Duyuru Ekle
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {announcements.map((announcement) => (
          <div
            key={announcement.id}
            className="flex flex-col bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
          >
            {announcement.image_url ? (
              <div className="relative h-48 w-full">
                <Image
                  src={announcement.image_url}
                  alt={announcement.title}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="h-48 bg-gray-100 flex items-center justify-center">
                <span className="text-gray-400">Görsel Yok</span>
              </div>
            )}
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="font-semibold text-lg mb-2">{announcement.title}</h3>
              <p className="text-gray-600 text-sm flex-1 line-clamp-3">
                {announcement.content}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {new Date(announcement.created_at).toLocaleDateString('tr-TR')}
                </span>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/duyurular/${announcement.id}`}
                    className="text-sm font-medium text-purple-600 hover:text-purple-700"
                  >
                    Düzenle
                  </Link>
                  <button
                    onClick={() => deleteAnnouncement(announcement.id)}
                    className="text-sm font-medium text-red-600 hover:text-red-700"
                  >
                    Sil
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {announcements.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border">
          <h3 className="text-lg font-medium text-gray-900">Henüz duyuru yok</h3>
          <p className="mt-2 text-sm text-gray-500">
            Yeni bir duyuru ekleyerek başlayın.
          </p>
        </div>
      )}
    </div>
  )
} 