# Yapılacaklar Listesi

## Güvenlik İyileştirmeleri

1. **[ÖNCELİKLİ] RLS Politikalarının İyileştirilmesi**
   - Mevcut Durum: Tüm authenticated kullanıcılar users tablosunu okuyabiliyor
   - Hedef: Row Level Security politikalarını, döngüsel bağımlılık oluşturmadan daha güvenli hale getirmek
   - Çözüm Önerileri:
     - PostgreSQL fonksiyonları kullanarak daha karmaşık yetkilendirme mantığı oluşturmak
     - Kullanıcı rollerini ayrı bir tabloda tutmak
     - Supabase'in sunduğu güvenlik best practice'lerini uygulamak

## Teknik Borç

- [ ] RLS politikalarının iyileştirilmesi
- [ ] Kullanıcı rollerinin yönetimi için daha güvenli bir yapı kurulması
- [ ] Veritabanı şemasının gözden geçirilmesi ve optimize edilmesi

## Notlar
- RLS politikaları şu an basit tutuldu (authenticated kullanıcılar okuyabilir)
- Admin kontrolü uygulama seviyesinde yapılıyor
- Bu geçici bir çözüm ve proje tamamlanmadan önce düzeltilmeli 