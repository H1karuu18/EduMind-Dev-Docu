-- Provision EduMind application profiles for three demo Auth users.
--
-- Before running:
--   1. Create these users under Supabase Dashboard > Authentication > Users.
--   2. Set a password for each user there and confirm the email.
--   3. Replace these demo addresses if you use different Auth user emails.
--
-- This script deliberately does not insert into auth.users or set passwords.
-- Supabase Auth owns user creation, password hashing, and email confirmation.

begin;

do $$
declare
  missing_emails text;
begin
  select string_agg(expected.email, ', ' order by expected.email)
    into missing_emails
  from (
    values
      ('educator.demo@example.com'),
      ('reviewer.demo@example.com'),
      ('admin.demo@example.com')
  ) as expected(email)
  where not exists (
    select 1
    from auth.users u
    where lower(u.email) = expected.email
  );

  if missing_emails is not null then
    raise exception
      'Create and confirm these Auth users before running this script: %',
      missing_emails;
  end if;
end;
$$;

insert into public.profiles (id, auth_user_id, full_name, email, role)
select
  u.id,
  u.id,
  account.full_name,
  u.email,
  account.role::public.edumind_role
from auth.users u
join (
  values
    ('educator.demo@example.com', 'Demo Educator', 'Educator'),
    ('reviewer.demo@example.com', 'Demo Executive Director', 'Reviewer'),
    ('admin.demo@example.com', 'Demo Administrator', 'Admin')
) as account(email, full_name, role)
  on lower(u.email) = account.email
on conflict (auth_user_id) do update
set
  full_name = excluded.full_name,
  email = excluded.email,
  role = excluded.role;

commit;
