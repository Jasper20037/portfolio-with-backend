-- Add is_hosted field to track whether a project has a live demo
alter table public.projects 
add column if not exists is_hosted boolean default true;

-- Update existing projects: set is_hosted to false if project_url is null
update public.projects 
set is_hosted = false 
where project_url is null or project_url = '';

-- Create index for is_hosted field
create index if not exists projects_is_hosted_idx on public.projects(is_hosted);
