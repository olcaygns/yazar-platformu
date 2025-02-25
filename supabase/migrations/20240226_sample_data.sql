-- Örnek yazar
INSERT INTO auth.users (id, email, raw_user_meta_data)
VALUES (
  'b2d7d3a0-5c1a-4e1d-8d8a-7c9e7b956d8f',
  'ornek@yazar.com',
  '{"full_name": "Örnek Yazar"}'
);

INSERT INTO public.users (id, full_name, role)
VALUES (
  'b2d7d3a0-5c1a-4e1d-8d8a-7c9e7b956d8f',
  'Örnek Yazar',
  'user'
);

-- Örnek kitaplar
INSERT INTO public.books (title, description, cover_image, published, content, author_id) VALUES
('Zamanın İzinde', 'Genç bir arkeologun antik bir medeniyetin sırlarını keşfetme yolculuğu...', 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e', true, 'Kitap içeriği...', 'a1db8983-a855-493e-b13d-668c39f78ae5'),
('Gece Bahçesi', 'Gizemli bir bahçede geçen büyülü bir hikaye...', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c', true, 'Kitap içeriği...', 'a1db8983-a855-493e-b13d-668c39f78ae5'),
('Kristal Şehir', 'Distopik bir gelecekte geçen sürükleyici bir macera...', 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0', true, 'Kitap içeriği...', 'a1db8983-a855-493e-b13d-668c39f78ae5'),
('Mavi Rüya', 'Bir deniz yolculuğunda yaşanan unutulmaz anılar...', 'https://images.unsplash.com/photo-1551029506-0807df4e2031', true, 'Kitap içeriği...', 'a1db8983-a855-493e-b13d-668c39f78ae5'),
('Son Karar', 'Gerilim dolu bir mahkeme draması...', 'https://images.unsplash.com/photo-1505664194779-8beaceb93744', true, 'Kitap içeriği...', 'a1db8983-a855-493e-b13d-668c39f78ae5');

-- Örnek duyurular
INSERT INTO public.announcements (title, content, image_url) VALUES
('Yeni Kitap Festivali', 'Bu yaz gerçekleşecek olan kitap festivalimizde birbirinden değerli yazarlarla buluşuyoruz...', 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f'),
('Online Yazarlık Atölyesi', 'Deneyimli yazarlarımızla online yazarlık atölyemiz başlıyor. Katılım için acele edin...', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173'),
('Çocuk Kitapları Haftası', 'Çocuk kitapları haftası kapsamında düzenlediğimiz etkinliklere tüm aileleri bekliyoruz...', 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4'); 