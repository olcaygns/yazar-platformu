'use client'

import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface User {
  id: string
  full_name: string
  email: string
  role: string
  created_at: string
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  async function fetchUsers() {
    try {
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()
      if (authError) throw authError

      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .select('*')

      if (profileError) throw profileError

      // Auth ve profil verilerini birleştir
      const mergedUsers = authUsers.users.map(authUser => {
        const profile = profileData?.find(p => p.id === authUser.id)
        return {
          id: authUser.id,
          email: authUser.email,
          full_name: profile?.full_name || 'İsimsiz Kullanıcı',
          role: profile?.role || 'user',
          created_at: authUser.created_at,
        }
      })

      setUsers(mergedUsers)
    } catch (error) {
      console.error('Kullanıcılar yüklenirken hata:', error)
    } finally {
      setLoading(false)
    }
  }

  async function toggleRole(userId: string, currentRole: string) {
    const newRole = currentRole === 'admin' ? 'user' : 'admin'

    try {
      const { error } = await supabase
        .from('users')
        .update({ role: newRole })
        .eq('id', userId)

      if (error) throw error

      // Listeyi güncelle
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ))
    } catch (error) {
      console.error('Kullanıcı güncellenirken hata:', error)
    }
  }

  if (loading) {
    return <div>Yükleniyor...</div>
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Kullanıcılar</h2>

      <div className="rounded-md border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ad Soyad
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                E-posta
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rol
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kayıt Tarihi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {user.full_name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {user.email}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                    user.role === 'admin'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {user.role === 'admin' ? 'Admin' : 'Kullanıcı'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(user.created_at).toLocaleDateString('tr-TR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => toggleRole(user.id, user.role)}
                    className="text-primary hover:text-primary/80"
                  >
                    {user.role === 'admin' ? 'Kullanıcı Yap' : 'Admin Yap'}
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