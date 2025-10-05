-- Add fields for detailed project information
alter table public.projects
add column if not exists code_snippets jsonb default '[]'::jsonb,
add column if not exists additional_images text[] default '{}';

-- Update existing projects to have empty arrays
update public.projects
set code_snippets = '[]'::jsonb
where code_snippets is null;

update public.projects
set additional_images = '{}'
where additional_images is null;
