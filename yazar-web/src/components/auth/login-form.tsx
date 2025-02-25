'use client'

import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface ValidationError {
  field: string
  message: string
}

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClientComponentClient()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState<ValidationError[]>([])

  // URL'den gelen başarılı kayıt mesajını kontrol et
  const successMessage = searchParams.get('message')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setErrors([])
  }

  const validateForm = () => {
    const newErrors: ValidationError[] = []

    if (!formData.email) {
      newErrors.push({ field: 'email', message: 'E-posta adresi gerekli' })
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.push({ field: 'email', message: 'Geçersiz e-posta formatı' })
    }

    if (!formData.password) {
      newErrors.push({ field: 'password', message: 'Şifre gerekli' })
    }

    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    setErrors([])

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (signInError) {
        console.error('Giriş hatası:', signInError)
        
        // Hata kodlarına göre özel mesajlar
        switch(signInError.status) {
          case 400:
            setErrors([{ field: 'form', message: 'E-posta adresi veya şifre hatalı.' }])
            break
          case 422:
            setErrors([{ field: 'form', message: 'Lütfen geçerli bir e-posta adresi ve şifre girin.' }])
            break
          case 429:
            setErrors([{ field: 'form', message: 'Çok fazla deneme yapıldı. Lütfen birkaç dakika bekleyip tekrar deneyin.' }])
            break
          default:
            if (signInError.message.includes('Email not confirmed')) {
              setErrors([{ field: 'form', message: 'E-posta adresiniz henüz onaylanmamış. Lütfen e-postanızı kontrol edin.' }])
            } else if (signInError.message.includes('Invalid login credentials')) {
              setErrors([{ field: 'form', message: 'E-posta adresi veya şifre hatalı.' }])
            } else {
              setErrors([{ field: 'form', message: 'Giriş yapılırken bir sorun oluştu. Lütfen daha sonra tekrar deneyin.' }])
            }
        }
        return
      }

      if (!data?.user) {
        setErrors([{ field: 'form', message: 'Giriş yapılırken bir sorun oluştu. Lütfen daha sonra tekrar deneyin.' }])
        return
      }

      router.refresh()
      router.push('/')
    } catch (error: any) {
      console.error('Giriş hatası:', error)
      setErrors([{ 
        field: 'form', 
        message: 'Beklenmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin.'
      }])
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

      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          {errors.map((error, index) => (
            <div key={index} className="mb-1">
              {error.field === 'form' ? (
                <p>{error.message}</p>
              ) : (
                <p>
                  <strong className="font-medium">
                    {error.field === 'email' ? 'E-posta: ' : 
                     error.field === 'password' ? 'Şifre: ' : ''}
                  </strong>
                  {error.message}
                </p>
              )}
            </div>
          ))}
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
            className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm ${
              errors.some(e => e.field === 'email') 
                ? 'border-red-500 focus-visible:ring-red-500' 
                : 'border-input focus-visible:ring-ring'
            } bg-background ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
            placeholder="ornek@email.com"
            disabled={loading}
            required
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
            className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm ${
              errors.some(e => e.field === 'password') 
                ? 'border-red-500 focus-visible:ring-red-500' 
                : 'border-input focus-visible:ring-ring'
            } bg-background ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
            disabled={loading}
            required
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