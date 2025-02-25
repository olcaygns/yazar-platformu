import React from 'react'
import EditBookForm from './edit-book-form'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

interface PageProps {
  params: {
    id: string
  }
}

export default async function EditBookPage({ params }: PageProps) {
  const id = React.use(Promise.resolve(params.id))
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })

  try {
    const { data: book, error } = await supabase
      .from('books')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !book) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Kitap bulunamadı</h2>
            <p className="text-muted-foreground">Bu kitap silinmiş veya mevcut değil.</p>
          </div>
        </div>
      )
    }

    return <EditBookForm book={book} />
  } catch (error) {
    console.error('Kitap yüklenirken hata:', error)
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Bir hata oluştu</h2>
          <p className="text-muted-foreground">Kitap bilgileri yüklenirken bir hata oluştu.</p>
        </div>
      </div>
    )
  }
} 