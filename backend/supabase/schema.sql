-- EduMind application schema for Supabase.
-- Run in the Supabase SQL Editor on a fresh project. OAuth provider credentials
-- and service-role keys are configured outside this database script.

create extension if not exists pgcrypto;

do $$ begin
  create type public.edumind_role as enum ('Educator', 'Collaborator', 'Reviewer', 'Admin');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.document_permission as enum ('viewer', 'editor', 'reviewer');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.document_status as enum ('draft', 'submitted', 'in_review', 'approved', 'returned', 'archived');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.approval_decision as enum ('approved', 'rejected', 'revision_requested');
exception when duplicate_object then null;
end $$;

-- Application identities linked directly to Supabase Auth users.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  auth_user_id uuid not null unique references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  avatar_url text,
  role public.edumind_role not null default 'Educator',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_auth_identity_matches check (id = auth_user_id),
  constraint profiles_email_not_blank check (length(trim(email)) > 0),
  constraint profiles_name_not_blank check (length(trim(full_name)) > 0)
);

-- Syllabi and other academic documents owned by a profile.
create table if not exists public.academic_documents (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  document_type text not null default 'syllabus',
  status public.document_status not null default 'draft',
  content jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint academic_documents_title_not_blank check (length(trim(title)) > 0),
  constraint academic_documents_type_not_blank check (length(trim(document_type)) > 0)
);

-- Grants explicit viewer/editor/reviewer permissions on documents.
create table if not exists public.document_collaborators (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.academic_documents(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  permission public.document_permission not null default 'viewer',
  granted_by uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint document_collaborators_unique_user unique (document_id, user_id)
);

-- Immutable snapshots of document versions.
create table if not exists public.document_revisions (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.academic_documents(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete restrict,
  revision_number integer not null,
  content jsonb not null,
  change_summary text,
  created_at timestamptz not null default now(),
  constraint document_revisions_number_positive check (revision_number > 0),
  constraint document_revisions_unique_number unique (document_id, revision_number)
);

-- User-to-user document shares; guest/public links are intentionally not enabled.
create table if not exists public.document_shares (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.academic_documents(id) on delete cascade,
  shared_by uuid not null references public.profiles(id) on delete cascade,
  shared_with_user_id uuid not null references public.profiles(id) on delete cascade,
  permission public.document_permission not null default 'viewer',
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint document_shares_unique_recipient unique (document_id, shared_with_user_id),
  constraint document_shares_not_self check (shared_by <> shared_with_user_id),
  constraint document_shares_expiry_future check (expires_at is null or expires_at > created_at)
);

-- Records document submissions and their workflow state.
create table if not exists public.submission_records (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.academic_documents(id) on delete cascade,
  submitted_by uuid not null references public.profiles(id) on delete restrict,
  status public.document_status not null default 'submitted',
  submitted_at timestamptz not null default now(),
  due_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint submission_records_status check (status in ('submitted', 'in_review', 'approved', 'returned'))
);

-- Reviewer assignments and decisions for submitted documents.
create table if not exists public.approval_records (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.submission_records(id) on delete cascade,
  reviewer_id uuid not null references public.profiles(id) on delete restrict,
  assigned_by uuid not null references public.profiles(id) on delete restrict,
  decision public.approval_decision,
  comments text,
  decided_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint approval_records_unique_reviewer unique (submission_id, reviewer_id),
  constraint approval_records_decision_timestamp check (
    (decision is null and decided_at is null) or (decision is not null and decided_at is not null)
  )
);

-- Activity Bank and PPT Bank resources; a null owner denotes an authenticated shared resource.
create table if not exists public.resources (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.profiles(id) on delete cascade,
  title text not null,
  resource_type text not null,
  description text,
  content jsonb not null default '{}'::jsonb,
  storage_path text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint resources_title_not_blank check (length(trim(title)) > 0),
  constraint resources_type_not_blank check (length(trim(resource_type)) > 0)
);

-- AI subject/knowledge sessions owned by a profile.
create table if not exists public.ai_sessions (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  subject text,
  session_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint ai_sessions_title_not_blank check (length(trim(title)) > 0)
);

-- Course materials attached to an AI session; document links remain permission-checked.
create table if not exists public.ai_session_documents (
  id uuid primary key default gen_random_uuid(),
  ai_session_id uuid not null references public.ai_sessions(id) on delete cascade,
  document_id uuid references public.academic_documents(id) on delete set null,
  uploaded_by uuid not null references public.profiles(id) on delete restrict,
  file_name text not null,
  storage_path text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint ai_session_documents_path_not_blank check (length(trim(storage_path)) > 0),
  constraint ai_session_documents_name_not_blank check (length(trim(file_name)) > 0)
);

-- Per-user analytics data, optionally tied to an academic document.
create table if not exists public.analytics_records (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  document_id uuid references public.academic_documents(id) on delete set null,
  metric_name text not null,
  metric_value numeric,
  dimensions jsonb not null default '{}'::jsonb,
  recorded_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint analytics_records_metric_not_blank check (length(trim(metric_name)) > 0)
);

-- Security/audit events. Authenticated users may read only their own; system writes use trusted server/database logic.
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_type text,
  entity_id uuid,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint audit_logs_action_not_blank check (length(trim(action)) > 0)
);

create index if not exists academic_documents_owner_updated_idx on public.academic_documents (owner_id, updated_at desc);
create index if not exists academic_documents_status_idx on public.academic_documents (status);
create index if not exists document_collaborators_user_idx on public.document_collaborators (user_id, document_id);
create index if not exists document_revisions_document_created_idx on public.document_revisions (document_id, created_at desc);
create index if not exists document_shares_recipient_idx on public.document_shares (shared_with_user_id, document_id);
create index if not exists submission_records_document_idx on public.submission_records (document_id, submitted_at desc);
create index if not exists approval_records_reviewer_idx on public.approval_records (reviewer_id, submission_id);
create index if not exists resources_owner_type_idx on public.resources (owner_id, resource_type);
create index if not exists ai_sessions_owner_updated_idx on public.ai_sessions (owner_id, updated_at desc);
create index if not exists ai_session_documents_session_idx on public.ai_session_documents (ai_session_id);
create index if not exists analytics_records_owner_recorded_idx on public.analytics_records (owner_id, recorded_at desc);
create index if not exists audit_logs_actor_created_idx on public.audit_logs (actor_id, created_at desc);

-- Keep mutable row timestamps current.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;
revoke all on function public.set_updated_at() from public;

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'profiles', 'academic_documents', 'document_collaborators',
    'document_shares', 'submission_records', 'approval_records',
    'resources', 'ai_sessions', 'ai_session_documents',
    'analytics_records'
  ] loop
    execute format('drop trigger if exists set_updated_at on public.%I', table_name);
    execute format(
      'create trigger set_updated_at before update on public.%I for each row execute function public.set_updated_at()',
      table_name
    );
  end loop;
end $$;

-- Ensure only eligible reviewer/admin profiles can be assigned, without exposing
-- other users' profile records through row-level policies.
create or replace function public.validate_approval_reviewer_role()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not exists (
    select 1 from public.profiles p
    where p.auth_user_id = new.reviewer_id and p.role in ('Reviewer', 'Admin')
  ) then
    raise exception 'The assigned account is not authorized to review documents'
      using errcode = '42501';
  end if;
  return new;
end;
$$;
revoke all on function public.validate_approval_reviewer_role() from public;

drop trigger if exists validate_approval_reviewer_role on public.approval_records;
create trigger validate_approval_reviewer_role
  before insert or update of reviewer_id on public.approval_records
  for each row execute function public.validate_approval_reviewer_role();

-- New Auth users receive an application profile with the least-privileged default role.
create or replace function public.create_profile_for_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  resolved_name text;
begin
  resolved_name := coalesce(
    nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''),
    nullif(trim(new.raw_user_meta_data ->> 'name'), ''),
    nullif(split_part(new.email, '@', 1), ''),
    'Educator'
  );
  insert into public.profiles (id, auth_user_id, full_name, email, avatar_url, role)
  values (
    new.id,
    new.id,
    resolved_name,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'avatar_url', new.raw_user_meta_data ->> 'picture'),
    'Educator'
  )
  on conflict (auth_user_id) do nothing;
  return new;
end;
$$;
revoke all on function public.create_profile_for_auth_user() from public;

drop trigger if exists on_auth_user_created_edumind_profile on auth.users;
create trigger on_auth_user_created_edumind_profile
  after insert on auth.users
  for each row execute function public.create_profile_for_auth_user();

-- RLS-safe helpers avoid recursive policy checks while deriving document access.
create or replace function public.is_edumind_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles p
    where p.auth_user_id = (select auth.uid()) and p.role = 'Admin'
  );
$$;

create or replace function public.owns_document(target_document_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.academic_documents d
    where d.id = target_document_id and d.owner_id = (select auth.uid())
  );
$$;

create or replace function public.can_access_document(target_document_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.is_edumind_admin()
    or public.owns_document(target_document_id)
    or exists (
      select 1 from public.document_collaborators c
      where c.document_id = target_document_id and c.user_id = (select auth.uid())
    )
    or exists (
      select 1 from public.document_shares s
      where s.document_id = target_document_id
        and s.shared_with_user_id = (select auth.uid())
        and (s.expires_at is null or s.expires_at > now())
    )
    or exists (
      select 1
      from public.approval_records a
      join public.submission_records sr on sr.id = a.submission_id
      join public.profiles p on p.auth_user_id = a.reviewer_id
      where sr.document_id = target_document_id
        and a.reviewer_id = (select auth.uid())
        and p.role = 'Reviewer'
    );
$$;

create or replace function public.can_edit_document(target_document_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.is_edumind_admin()
    or public.owns_document(target_document_id)
    or exists (
      select 1 from public.document_collaborators c
      where c.document_id = target_document_id
        and c.user_id = (select auth.uid())
        and c.permission = 'editor'
    )
    or exists (
      select 1 from public.document_shares s
      where s.document_id = target_document_id
        and s.shared_with_user_id = (select auth.uid())
        and s.permission = 'editor'
        and (s.expires_at is null or s.expires_at > now())
    );
$$;

revoke all on function public.is_edumind_admin() from public;
revoke all on function public.owns_document(uuid) from public;
revoke all on function public.can_access_document(uuid) from public;
revoke all on function public.can_edit_document(uuid) from public;
grant execute on function public.is_edumind_admin() to authenticated;
grant execute on function public.owns_document(uuid) to authenticated;
grant execute on function public.can_access_document(uuid) to authenticated;
grant execute on function public.can_edit_document(uuid) to authenticated;

-- Admin-only role assignment; users cannot update their own role.
create or replace function public.set_profile_role(target_user_id uuid, new_role public.edumind_role)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_edumind_admin() then
    raise exception 'Only an EduMind administrator can change profile roles'
      using errcode = '42501';
  end if;
  update public.profiles set role = new_role where auth_user_id = target_user_id;
  if not found then
    raise exception 'Profile not found' using errcode = 'P0002';
  end if;
end;
$$;
revoke all on function public.set_profile_role(uuid, public.edumind_role) from public;
grant execute on function public.set_profile_role(uuid, public.edumind_role) to authenticated;

alter table public.profiles enable row level security;
alter table public.academic_documents enable row level security;
alter table public.document_collaborators enable row level security;
alter table public.document_revisions enable row level security;
alter table public.document_shares enable row level security;
alter table public.submission_records enable row level security;
alter table public.approval_records enable row level security;
alter table public.resources enable row level security;
alter table public.ai_sessions enable row level security;
alter table public.ai_session_documents enable row level security;
alter table public.analytics_records enable row level security;
alter table public.audit_logs enable row level security;

-- Profiles: users read their own profile; only admins can read others. Profile role is not client-updatable.
drop policy if exists profiles_select_authorized on public.profiles;
create policy profiles_select_authorized on public.profiles for select to authenticated
  using (auth_user_id = (select auth.uid()) or public.is_edumind_admin());
drop policy if exists profiles_insert_self on public.profiles;
create policy profiles_insert_self on public.profiles for insert to authenticated
  with check (auth_user_id = (select auth.uid()) and role = 'Educator');
drop policy if exists profiles_update_self on public.profiles;
create policy profiles_update_self on public.profiles for update to authenticated
  using (auth_user_id = (select auth.uid()) or public.is_edumind_admin())
  with check (auth_user_id = (select auth.uid()) or public.is_edumind_admin());
revoke update on public.profiles from authenticated;
grant update (full_name, avatar_url) on public.profiles to authenticated;

-- Documents: owners and explicitly authorized collaborators/reviewers can read; edits are permission-gated.
drop policy if exists academic_documents_select_authorized on public.academic_documents;
create policy academic_documents_select_authorized on public.academic_documents for select to authenticated
  using (public.can_access_document(id));
drop policy if exists academic_documents_insert_owner on public.academic_documents;
create policy academic_documents_insert_owner on public.academic_documents for insert to authenticated
  with check (owner_id = (select auth.uid()) and status = 'draft');
drop policy if exists academic_documents_update_editors on public.academic_documents;
create policy academic_documents_update_editors on public.academic_documents for update to authenticated
  using (public.can_edit_document(id)) with check (public.can_edit_document(id));
drop policy if exists academic_documents_delete_owner on public.academic_documents;
create policy academic_documents_delete_owner on public.academic_documents for delete to authenticated
  using (owner_id = (select auth.uid()) or public.is_edumind_admin());

-- Collaborator grants can be viewed by document participants and managed only by owners/admins.
drop policy if exists document_collaborators_select_authorized on public.document_collaborators;
create policy document_collaborators_select_authorized on public.document_collaborators for select to authenticated
  using (public.can_access_document(document_id));
drop policy if exists document_collaborators_insert_owner on public.document_collaborators;
create policy document_collaborators_insert_owner on public.document_collaborators for insert to authenticated
  with check ((public.owns_document(document_id) or public.is_edumind_admin()) and granted_by = (select auth.uid()));
drop policy if exists document_collaborators_update_owner on public.document_collaborators;
create policy document_collaborators_update_owner on public.document_collaborators for update to authenticated
  using (public.owns_document(document_id) or public.is_edumind_admin())
  with check (public.owns_document(document_id) or public.is_edumind_admin());
drop policy if exists document_collaborators_delete_owner on public.document_collaborators;
create policy document_collaborators_delete_owner on public.document_collaborators for delete to authenticated
  using (public.owns_document(document_id) or public.is_edumind_admin());

-- Revisions are readable by document participants; owner/editors can add revisions.
drop policy if exists document_revisions_select_authorized on public.document_revisions;
create policy document_revisions_select_authorized on public.document_revisions for select to authenticated
  using (public.can_access_document(document_id));
drop policy if exists document_revisions_insert_editor on public.document_revisions;
create policy document_revisions_insert_editor on public.document_revisions for insert to authenticated
  with check (author_id = (select auth.uid()) and public.can_edit_document(document_id));

-- Shares are visible to owners and recipients; only document owners/admins issue or revoke them.
drop policy if exists document_shares_select_participants on public.document_shares;
create policy document_shares_select_participants on public.document_shares for select to authenticated
  using (shared_by = (select auth.uid()) or shared_with_user_id = (select auth.uid()) or public.is_edumind_admin());
drop policy if exists document_shares_insert_owner on public.document_shares;
create policy document_shares_insert_owner on public.document_shares for insert to authenticated
  with check ((public.owns_document(document_id) or public.is_edumind_admin()) and shared_by = (select auth.uid()));
drop policy if exists document_shares_update_owner on public.document_shares;
create policy document_shares_update_owner on public.document_shares for update to authenticated
  using (public.owns_document(document_id) or public.is_edumind_admin())
  with check (public.owns_document(document_id) or public.is_edumind_admin());
drop policy if exists document_shares_delete_owner on public.document_shares;
create policy document_shares_delete_owner on public.document_shares for delete to authenticated
  using (public.owns_document(document_id) or public.is_edumind_admin());

-- Submissions are visible to document participants; only document owners submit/update workflow state.
drop policy if exists submission_records_select_authorized on public.submission_records;
create policy submission_records_select_authorized on public.submission_records for select to authenticated
  using (public.can_access_document(document_id));
drop policy if exists submission_records_insert_owner on public.submission_records;
create policy submission_records_insert_owner on public.submission_records for insert to authenticated
  with check (
    submitted_by = (select auth.uid())
    and public.owns_document(document_id)
    and status = 'submitted'
  );
drop policy if exists submission_records_update_owner on public.submission_records;
create policy submission_records_update_owner on public.submission_records for update to authenticated
  using (public.owns_document(document_id) or public.is_edumind_admin())
  with check (public.owns_document(document_id) or public.is_edumind_admin());

-- Owners/admins assign reviewers; assigned reviewers can read and decide only their own assignments.
drop policy if exists approval_records_select_authorized on public.approval_records;
create policy approval_records_select_authorized on public.approval_records for select to authenticated
  using (
    (
      reviewer_id = (select auth.uid())
      and exists (
        select 1 from public.profiles p
        where p.auth_user_id = (select auth.uid()) and p.role in ('Reviewer', 'Admin')
      )
    )
    or public.is_edumind_admin()
    or exists (
      select 1 from public.submission_records sr
      where sr.id = submission_id and public.owns_document(sr.document_id)
    )
  );
drop policy if exists approval_records_insert_assigner on public.approval_records;
create policy approval_records_insert_assigner on public.approval_records for insert to authenticated
  with check (
    assigned_by = (select auth.uid())
    and (
      public.is_edumind_admin()
      or exists (
        select 1 from public.submission_records sr
        where sr.id = submission_id and public.owns_document(sr.document_id)
      )
    )
    and decision is null
    and decided_at is null
  );
drop policy if exists approval_records_update_reviewer on public.approval_records;
create policy approval_records_update_reviewer on public.approval_records for update to authenticated
  using (
    (
      reviewer_id = (select auth.uid())
      and exists (
        select 1 from public.profiles p
        where p.auth_user_id = (select auth.uid()) and p.role = 'Reviewer'
      )
    )
    or public.is_edumind_admin()
  )
  with check (reviewer_id = (select auth.uid()) or public.is_edumind_admin());

-- Shared resources are readable to signed-in users; private resources remain owner/admin-only.
drop policy if exists resources_select_authorized on public.resources;
create policy resources_select_authorized on public.resources for select to authenticated
  using (owner_id is null or owner_id = (select auth.uid()) or public.is_edumind_admin());
drop policy if exists resources_insert_owner on public.resources;
create policy resources_insert_owner on public.resources for insert to authenticated
  with check (owner_id = (select auth.uid()));
drop policy if exists resources_update_owner on public.resources;
create policy resources_update_owner on public.resources for update to authenticated
  using (owner_id = (select auth.uid()) or public.is_edumind_admin())
  with check (owner_id = (select auth.uid()) or public.is_edumind_admin());
drop policy if exists resources_delete_owner on public.resources;
create policy resources_delete_owner on public.resources for delete to authenticated
  using (owner_id = (select auth.uid()) or public.is_edumind_admin());

-- AI sessions and uploaded materials are private to their owner.
drop policy if exists ai_sessions_owner_all on public.ai_sessions;
create policy ai_sessions_owner_all on public.ai_sessions for all to authenticated
  using (owner_id = (select auth.uid()) or public.is_edumind_admin())
  with check (owner_id = (select auth.uid()) or public.is_edumind_admin());
drop policy if exists ai_session_documents_owner_all on public.ai_session_documents;
create policy ai_session_documents_owner_all on public.ai_session_documents for all to authenticated
  using (
    uploaded_by = (select auth.uid())
    and exists (select 1 from public.ai_sessions s where s.id = ai_session_id and s.owner_id = (select auth.uid()))
  )
  with check (
    uploaded_by = (select auth.uid())
    and exists (select 1 from public.ai_sessions s where s.id = ai_session_id and s.owner_id = (select auth.uid()))
    and (document_id is null or public.can_access_document(document_id))
  );

-- Analytics belongs to its owner; admins may access system analytics.
drop policy if exists analytics_records_owner_all on public.analytics_records;
create policy analytics_records_owner_all on public.analytics_records for all to authenticated
  using (owner_id = (select auth.uid()) or public.is_edumind_admin())
  with check (
    (owner_id = (select auth.uid()) or public.is_edumind_admin())
    and (document_id is null or public.can_access_document(document_id))
  );

-- Audit history is immutable to browser clients; users read their own events and admins read all.
drop policy if exists audit_logs_select_authorized on public.audit_logs;
create policy audit_logs_select_authorized on public.audit_logs for select to authenticated
  using (actor_id = (select auth.uid()) or public.is_edumind_admin());

grant select, insert, update, delete on
  public.profiles, public.academic_documents, public.document_collaborators,
  public.document_revisions, public.document_shares, public.submission_records,
  public.approval_records, public.resources, public.ai_sessions,
  public.ai_session_documents, public.analytics_records, public.audit_logs
to authenticated;

-- Column-level grants are applied after table grants so clients cannot change roles
-- or rewrite reviewer assignments, despite the corresponding row-level policies.
revoke update on public.profiles from authenticated;
grant update (full_name, avatar_url) on public.profiles to authenticated;
revoke update on public.academic_documents from authenticated;
grant update (title, description, document_type, content, metadata)
  on public.academic_documents to authenticated;
revoke update on public.submission_records from authenticated;
grant update (due_at, notes) on public.submission_records to authenticated;
revoke update on public.approval_records from authenticated;
grant update (decision, comments, decided_at) on public.approval_records to authenticated;
