'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface MenuItem {
  title: string
  href: string
  icon?: string
}

const menuItems: MenuItem[] = [
  {
    title: 'Dashboard',
    href: '/admin',
  },
  {
    title: 'Kitaplar',
    href: '/admin/kitaplar',
  },
  {
    title: 'Duyurular',
    href: '/admin/duyurular',
  },
  {
    title: 'Kullanıcılar',
    href: '/admin/kullanicilar',
  },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="grid min-h-screen grid-cols-[240px_1fr]">
      {/* Sol Menü */}
      <div className="border-r bg-gray-50/40">
        <div className="flex h-full w-full flex-col">
          <div className="flex h-14 items-center border-b px-4">
            <Link
              href="/admin"
              className="flex items-center gap-2 font-semibold"
            >
              Admin Paneli
            </Link>
          </div>
          <nav className="grid items-start px-4 text-sm font-medium">
            {menuItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-gray-900 ${
                    isActive 
                      ? 'bg-gray-100 text-gray-900' 
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {item.title}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Ana İçerik */}
      <div className="flex flex-col">
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
} 