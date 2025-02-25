'use client'

import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClientComponentClient()
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // URL'den gelen başarılı kayıt mesajını kontrol et
  const successMessage = searchParams.get('message')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError(null) // Input değiştiğinde hata mesajını temizle
  }

  const getErrorMessage = (error: any): string => {
    console.error('Hata detayı:', error) // Hata detayını konsola yazdır

    if (error?.message) {
      switch (error.message) {
        case 'Invalid login credentials':
          return 'E-posta veya şifre hatalı'
        case 'Email not confirmed':
          return 'E-posta adresiniz henüz onaylanmamış. Lütfen e-postanızı kontrol edin.'
        case 'Too many requests':
          return 'Çok fazla deneme yaptınız. Lütfen daha sonra tekrar deneyin'
        case 'Invalid email':
          return 'Geçersiz e-posta adresi'
        case 'Invalid password':
          return 'Geçersiz şifre formatı'
        default:
          return `Giriş hatası: ${error.message}`
      }
    }

    if (error?.code) {
      switch (error.code) {
        case 'auth/invalid-email':
          return 'Geçersiz e-posta formatı'
        case '23505':
          return 'Bu e-posta adresi zaten kullanımda'
        default:
          return `Sistem hatası (${error.code})`
      }
    }

    return 'Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Form validasyonu
      if (!formData.email || !formData.password) {
        throw new Error('Lütfen tüm alanları doldurun')
      }

      if (!formData.email.includes('@')) {
        throw new Error('Lütfen geçerli bir e-posta adresi girin')
      }

      if (formData.password.length < 6) {
        throw new Error('Şifre en az 6 karakter olmalıdır')
      }

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (signInError) {
        throw signInError
      }

      if (!data?.user) {
        throw new Error('Kullanıcı bilgileri alınamadı')
      }

      router.refresh()
      router.push('/')
    } catch (error) {
      setError(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Hata! </strong>
          <span className="block sm:inline">{error}</span>
          {process.env.NODE_ENV === 'development' && (
            <pre className="mt-2 text-xs text-red-600">
              {JSON.stringify(error, null, 2)}
            </pre>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium leading-none">
            E-posta
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="ornek@email.com"
            required
            autoComplete="email"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium leading-none">
            Şifre
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            required
            autoComplete="current-password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Giriş yapılıyor...
            </>
          ) : (
            'Giriş Yap'
          )}
        </button>
      </form>
    </div>
  )
} 