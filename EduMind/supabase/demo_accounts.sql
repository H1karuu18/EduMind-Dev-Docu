-- First create educator.demo@example.com and reviewer.demo@example.com in
-- Supabase Authentication > Users, then run this script in the SQL Editor.
-- Set their passwords in Supabase; passwords must not be stored in frontend code.

insert into public.profiles (id, auth_user_id, full_name, email, role)
select
  u.id,
  u.id,
  case lower(u.email)
    when 'educator.demo@example.com' then 'Demo Educator'
    when 'reviewer.demo@example.com' then 'Demo Executive Director'
  end,
  u.email,
  case lower(u.email)
    when 'educator.demo@example.com' then 'Educator'::public.edumind_role
    when 'reviewer.demo@example.com' then 'Reviewer'::public.edumind_role
  end
from auth.users u
where lower(u.email) in ('educator.demo@example.com', 'reviewer.demo@example.com')
on conflict (auth_user_id) do update
set
  full_name = excluded.full_name,
  email = excluded.email,
  role = excluded.role;
