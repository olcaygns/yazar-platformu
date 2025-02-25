# Yazar Platformu

Modern ve kullanıcı dostu bir platform ile yazarların kitaplarını okuyucularıyla buluşturmasını sağlayan web uygulaması.

## Özellikler

- 🔐 Kullanıcı Yönetimi (Kayıt, Giriş, Rol Bazlı Yetkilendirme)
- 📚 Kitap Yönetimi
- 👥 Admin Paneli
- 🎨 Modern ve Responsive Tasarım

## Teknolojiler

- **Frontend**
  - Next.js 14 (React Framework)
  - TypeScript
  - Tailwind CSS
  - Shadcn/ui

- **Backend**
  - Supabase (PostgreSQL + Authentication)
  - Row Level Security (RLS)

## Kurulum

1. Repoyu klonlayın
```bash
git clone https://github.com/kullaniciadi/yazar-platformu.git
cd yazar-platformu
```

2. Bağımlılıkları yükleyin
```bash
npm install
# veya
yarn install
```

3. `.env.local` dosyası oluşturun ve gerekli değişkenleri ekleyin
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Geliştirme sunucusunu başlatın
```bash
npm run dev
# veya
yarn dev
```

5. Tarayıcıda http://localhost:3000 adresini açın

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

## Güvenlik

- Supabase Authentication ile güvenli kullanıcı yönetimi
- Row Level Security (RLS) ile veri güvenliği
- Input validasyonu
- XSS ve CSRF koruması

## Katkıda Bulunma

1. Bu repoyu fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'feat: add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## İletişim

Proje Sahibi - [@olcaygunes](https://github.com/olcaygunes)

Proje Linki: [https://github.com/olcaygunes/yazar-platformu](https://github.com/olcaygunes/yazar-platformu) 