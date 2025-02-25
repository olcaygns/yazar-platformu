-- Create users table
create table public.users (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text,
  role text check (role in ('admin', 'user')) default 'user',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create books table
create table public.books (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  content text,
  cover_image text,
  author_id uuid references public.users(id) on delete cascade not null,
  published boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table public.users enable row level security;
alter table public.books enable row level security;

-- Create policies
create policy "Users can view their own profile"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.users for update
  using (auth.uid() = id);

create policy "Anyone can view published books"
  on public.books for select
  using (published = true);

create policy "Authors can manage their own books"
  on public.books for all
  using (auth.uid() = author_id);

create policy "Admins can manage all books"
  on public.books for all
  using (
    exists (
      select 1 from public.users
      where users.id = auth.uid()
      and users.role = 'admin'
    )
  );

-- Create functions
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, full_name, role)
  values (new.id, new.raw_user_meta_data->>'full_name', coalesce(new.raw_user_meta_data->>'role', 'user'));
  return new;
end;
$$ language plpgsql security definer;

-- Create triggers
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user(); 