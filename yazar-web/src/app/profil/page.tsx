'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface UserProfile {
  full_name: string
  email: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = React.useState<UserProfile | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [showPasswordReset, setShowPasswordReset] = React.useState(false)
  const [email, setEmail] = React.useState('')
  const [currentPassword, setCurrentPassword] = React.useState('')
  const [newPassword, setNewPassword] = React.useState('')
  const [message, setMessage] = React.useState({ type: '', text: '' })

  React.useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push('/giris')
        return
      }

      const { data: profile, error } = await supabase
        .from('users')
        .select('full_name, email')
        .eq('id', session.user.id)
        .single()

      if (error) throw error

      setProfile(profile)
      setEmail(session.user.email || '')
    } catch (error) {
      console.error('Profil yüklenirken hata:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage({ type: '', text: '' })

    try {
      // Önce mevcut şifre ile giriş yapalım
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: currentPassword,
      })

      if (signInError) {
        setMessage({ type: 'error', text: 'Mevcut şifreniz hatalı.' })
        return
      }

      // Şifre doğruysa yeni şifreyi güncelleyelim
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (updateError) throw updateError

      setMessage({ type: 'success', text: 'Şifreniz başarıyla güncellendi.' })
      setShowPasswordReset(false)
      setCurrentPassword('')
      setNewPassword('')
    } catch (error) {
      console.error('Şifre güncellenirken hata:', error)
      setMessage({ type: 'error', text: 'Şifre güncellenirken bir hata oluştu.' })
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Profilim</h1>

        {/* Profil Bilgileri */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Kullanıcı Bilgileri</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Ad Soyad</label>
              <p className="text-gray-900">{profile?.full_name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">E-posta</label>
              <p className="text-gray-900">{profile?.email}</p>
            </div>
          </div>
        </div>

        {/* Şifre Değiştirme */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Şifre Değiştir</h2>
            {!showPasswordReset && (
              <button
                onClick={() => setShowPasswordReset(true)}
                className="text-sm text-purple-600 hover:text-purple-700"
              >
                Şifremi değiştirmek istiyorum
              </button>
            )}
          </div>

          {message.text && (
            <div className={`p-4 rounded-md mb-4 ${
              message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
            }`}>
              {message.text}
            </div>
          )}

          {showPasswordReset && (
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Mevcut Şifre
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                  minLength={6}
                />
              </div>
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Yeni Şifre
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                  minLength={6}
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                >
                  Şifreyi Güncelle
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordReset(false)
                    setCurrentPassword('')
                    setNewPassword('')
                    setMessage({ type: '', text: '' })
                  }}
                  className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                >
                  İptal
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
} 