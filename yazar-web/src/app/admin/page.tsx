'use client'

import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Stats {
  totalBooks: number
  totalUsers: number
  publishedBooks: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalBooks: 0,
    totalUsers: 0,
    publishedBooks: 0,
  })

  useEffect(() => {
    async function fetchStats() {
      try {
        // Toplam kitap sayısı
        const { count: totalBooks } = await supabase
          .from('books')
          .select('*', { count: 'exact', head: true })

        // Yayınlanmış kitap sayısı
        const { count: publishedBooks } = await supabase
          .from('books')
          .select('*', { count: 'exact', head: true })
          .eq('published', true)

        // Toplam kullanıcı sayısı
        const { count: totalUsers } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true })

        setStats({
          totalBooks: totalBooks || 0,
          publishedBooks: publishedBooks || 0,
          totalUsers: totalUsers || 0,
        })
      } catch (error) {
        console.error('İstatistikler yüklenirken hata:', error)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border p-6 shadow-sm">
          <h3 className="text-lg font-medium">Toplam Kitap</h3>
          <p className="text-3xl font-bold">{stats.totalBooks}</p>
        </div>
        
        <div className="rounded-lg border p-6 shadow-sm">
          <h3 className="text-lg font-medium">Yayınlanan Kitap</h3>
          <p className="text-3xl font-bold">{stats.publishedBooks}</p>
        </div>
        
        <div className="rounded-lg border p-6 shadow-sm">
          <h3 className="text-lg font-medium">Toplam Kullanıcı</h3>
          <p className="text-3xl font-bold">{stats.totalUsers}</p>
        </div>
      </div>
    </div>
  )
} 