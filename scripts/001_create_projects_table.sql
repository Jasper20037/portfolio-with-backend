-- Create projects table for portfolio
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  long_description text,
  technologies text[] not null default '{}',
  image_url text,
  project_url text,
  github_url text,
  featured boolean default false,
  display_order integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table public.projects enable row level security;

-- Allow anyone to view projects (public portfolio)
create policy "Anyone can view projects"
  on public.projects for select
  using (true);

-- For now, allow anyone to insert/update/delete (we'll add auth later if needed)
-- In production, you'd want to protect these with authentication
create policy "Anyone can insert projects"
  on public.projects for insert
  with check (true);

create policy "Anyone can update projects"
  on public.projects for update
  using (true);

create policy "Anyone can delete projects"
  on public.projects for delete
  using (true);

-- Create index for ordering
create index if not exists projects_display_order_idx on public.projects(display_order);

-- Create index for featured projects
create index if not exists projects_featured_idx on public.projects(featured);
