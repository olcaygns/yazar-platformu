# Yazar Web Sitesi Projesi

## Kullanılan Teknolojiler

- **Next.js 14**: Modern React framework
- **TypeScript**: Tip güvenliği
- **Supabase**: Veritabanı ve Authentication
- **Tailwind CSS**: Stil kütüphanesi
- **Shadcn/ui**: Modern UI komponentleri
- **Zod**: Form validasyonu

## Proje Yapısı

```
src/
├── app/             # Next.js app router
├── components/      # Yeniden kullanılabilir komponentler
├── lib/            # Utility fonksiyonları
├── types/          # TypeScript tipleri
└── styles/         # Global stiller
```

## Veritabanı Şeması

### Users Tablosu
- id: uuid (primary key)
- email: string
- full_name: string
- role: enum ('admin', 'user')
- created_at: timestamp
- updated_at: timestamp

### Books Tablosu
- id: uuid (primary key)
- title: string
- description: text
- cover_image: string (URL)
- author_id: uuid (foreign key -> users.id)
- content: text
- published: boolean
- created_at: timestamp
- updated_at: timestamp

## Özellikler

### Admin Paneli
- Kitap ekleme/düzenleme/silme
- Kullanıcı yönetimi
- İstatistikler görüntüleme

### Kullanıcı Paneli
- Kitap okuma
- Profil yönetimi
- Kitap arama ve filtreleme

## Güvenlik Önlemleri
- Supabase RLS (Row Level Security) politikaları
  - NOT: Şu an için basit bir politika kullanılıyor (authenticated kullanıcılar okuyabilir)
  - TODO: Proje tamamlanmadan önce daha güvenli politikalar uygulanacak
- API rate limiting
- Input validasyonu
- XSS koruması
- CSRF koruması

## Değişiklik Geçmişi

### [Tarih: 2024-02-25]
- RLS politikaları geçici olarak basitleştirildi
  - Authenticated kullanıcıların users tablosunu okumasına izin verildi
  - Admin kontrolü uygulama seviyesinde yapılıyor
  - Bu geçici bir çözüm ve proje tamamlanmadan önce düzeltilecek
- Admin paneli sorunları giderildi
  - Kullanıcı rolü kontrolü düzgün çalışıyor
  - Debug logları eklendi ve temizlendi

### [Tarih: 2024-02-25]
- Veritabanı tetikleyicisi düzeltildi
  - Yeni kullanıcılar auth.users tablosundan public.users tablosuna otomatik olarak ekleniyor
  - Users tablosuna email alanı eklendi
  - Admin kullanıcıların tüm kullanıcıları görüntüleyebilmesi için yeni bir politika eklendi
- Admin kullanıcılar sayfası düzeltildi
  - `supabase.auth.admin.listUsers()` API'si client tarafında kullanılamadığı için kaldırıldı
  - Sadece users tablosundan kullanıcılar çekilerek listeleniyor
- Doğrulama sonrası yönlendirme sorunu düzeltildi
  - `/dashboard` sayfası olmadığı için doğrulama sonrası ana sayfaya yönlendirme yapıldı
- Admin kullanıcılar sayfası iyileştirildi
  - Supabase auth tablosundaki kullanıcılar ile users tablosundaki kullanıcılar birleştirildi
  - Yeni kayıt olan kullanıcıların admin panelinde görüntülenmesi sağlandı
  - Kullanıcı rolü değiştirme işlemi iyileştirildi (kullanıcı yoksa ekleme, varsa güncelleme)

### [Tarih: YYYY-MM-DD]
- Proje başlatıldı
- Next.js kurulumu yapıldı
- Temel proje yapısı oluşturuldu 