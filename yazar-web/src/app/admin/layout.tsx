'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const navigation = [
    {
      name: 'Dashboard',
      href: '/admin',
      current: pathname === '/admin',
    },
    {
      name: 'Kitaplar',
      href: '/admin/kitaplar',
      current: pathname === '/admin/kitaplar',
    },
    {
      name: 'Kullanıcılar',
      href: '/admin/kullanicilar',
      current: pathname === '/admin/kullanicilar',
    },
  ]

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white">
        <div className="flex h-16 items-center border-b border-gray-800 px-4">
          <Link href="/admin" className="text-lg font-bold">
            Admin Paneli
          </Link>
        </div>
        <nav className="space-y-1 p-4">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-2 text-sm rounded-md ${
                item.current
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1">
        <header className="border-b">
          <div className="container flex h-16 items-center justify-between">
            <h1 className="text-2xl font-bold">Admin Paneli</h1>
          </div>
        </header>
        <main className="container py-6">
          {children}
        </main>
      </div>
    </div>
  )
} 