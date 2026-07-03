-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users table (extends Supabase auth.users)
create table public.users (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique not null,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Handle new user signup trigger
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Resume Analyses
create table public.resume_analyses (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  file_name text not null,
  file_url text not null,
  raw_text text not null,
  ats_score integer not null,
  overall_feedback text not null,
  sections jsonb not null default '[]'::jsonb,
  weak_bullets jsonb not null default '[]'::jsonb,
  improvements jsonb not null default '[]'::jsonb,
  missing_skills jsonb not null default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- GitHub Analyses
create table public.github_analyses (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  username text not null,
  score integer not null,
  profile jsonb not null,
  repositories jsonb not null default '[]'::jsonb,
  languages jsonb not null default '{}'::jsonb,
  commit_activity jsonb not null,
  recommendations jsonb not null default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- LinkedIn Analyses
create table public.linkedin_analyses (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  profile_url text not null,
  score integer not null,
  headline jsonb not null,
  about jsonb not null,
  experience jsonb not null,
  skills jsonb not null,
  featured jsonb not null,
  recruiter_attractiveness integer not null,
  recommendations jsonb not null default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Skill Gap Analyses
create table public.skill_gap_analyses (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  target_role text not null,
  current_skills jsonb not null default '[]'::jsonb,
  required_skills jsonb not null default '[]'::jsonb,
  match_percentage integer not null,
  roadmap jsonb not null default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Interview Sessions
create table public.interview_sessions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  role text not null,
  questions jsonb not null default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies
alter table public.users enable row level security;
alter table public.resume_analyses enable row level security;
alter table public.github_analyses enable row level security;
alter table public.linkedin_analyses enable row level security;
alter table public.skill_gap_analyses enable row level security;
alter table public.interview_sessions enable row level security;

-- Users policy
create policy "Users can view own data" on public.users for select using (auth.uid() = id);
create policy "Users can update own data" on public.users for update using (auth.uid() = id);

-- Common function for RLS
create or replace function is_owner(user_id uuid) returns boolean as $$
  select auth.uid() = user_id;
$$ language sql security definer;

-- Resume RLS
create policy "Users can view own resume analyses" on public.resume_analyses for select using (is_owner(user_id));
create policy "Users can insert own resume analyses" on public.resume_analyses for insert with check (is_owner(user_id));
create policy "Users can delete own resume analyses" on public.resume_analyses for delete using (is_owner(user_id));

-- GitHub RLS
create policy "Users can view own github analyses" on public.github_analyses for select using (is_owner(user_id));
create policy "Users can insert own github analyses" on public.github_analyses for insert with check (is_owner(user_id));
create policy "Users can delete own github analyses" on public.github_analyses for delete using (is_owner(user_id));

-- LinkedIn RLS
create policy "Users can view own linkedin analyses" on public.linkedin_analyses for select using (is_owner(user_id));
create policy "Users can insert own linkedin analyses" on public.linkedin_analyses for insert with check (is_owner(user_id));
create policy "Users can delete own linkedin analyses" on public.linkedin_analyses for delete using (is_owner(user_id));

-- Skill Gap RLS
create policy "Users can view own skill gap analyses" on public.skill_gap_analyses for select using (is_owner(user_id));
create policy "Users can insert own skill gap analyses" on public.skill_gap_analyses for insert with check (is_owner(user_id));
create policy "Users can delete own skill gap analyses" on public.skill_gap_analyses for delete using (is_owner(user_id));

-- Interview Sessions RLS
create policy "Users can view own interview sessions" on public.interview_sessions for select using (is_owner(user_id));
create policy "Users can insert own interview sessions" on public.interview_sessions for insert with check (is_owner(user_id));
create policy "Users can delete own interview sessions" on public.interview_sessions for delete using (is_owner(user_id));

-- Storage Bucket for Resumes
insert into storage.buckets (id, name, public) values ('resumes', 'resumes', false);

create policy "Users can upload resumes" on storage.objects for insert with check (bucket_id = 'resumes' and (auth.uid())::text = (storage.foldername(name))[1]);
create policy "Users can view own resumes" on storage.objects for select using (bucket_id = 'resumes' and (auth.uid())::text = (storage.foldername(name))[1]);
create policy "Users can delete own resumes" on storage.objects for delete using (bucket_id = 'resumes' and (auth.uid())::text = (storage.foldername(name))[1]);
