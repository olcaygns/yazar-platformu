-- Drop existing trigger and function
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- Create improved function
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, full_name, email, role)
  values (
    new.id, 
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'İsimsiz Kullanıcı'),
    new.email,
    coalesce(new.raw_user_meta_data->>'role', 'user')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Add email column to users table if it doesn't exist
do $$
begin
  if not exists (
    select 1 from information_schema.columns 
    where table_schema = 'public' 
    and table_name = 'users' 
    and column_name = 'email'
  ) then
    alter table public.users add column email text;
  end if;
end $$;

-- Update existing users with email from auth.users
update public.users
set email = auth.users.email
from auth.users
where public.users.id = auth.users.id
and public.users.email is null;

-- Create policy for admins to view all users
create policy "Admins can view all users"
  on public.users for select
  using (
    exists (
      select 1 from public.users
      where users.id = auth.uid()
      and users.role = 'admin'
    )
  ); 