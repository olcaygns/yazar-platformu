create table public.announcements (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  content text not null,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Politikaları
alter table public.announcements enable row level security;

create policy "Herkes duyuruları okuyabilir"
  on public.announcements for select
  using (true);

create policy "Sadece adminler duyuru ekleyebilir/düzenleyebilir/silebilir"
  on public.announcements for all
  using (
    auth.uid() in (
      select id from public.users where role = 'admin'
    )
  ); 