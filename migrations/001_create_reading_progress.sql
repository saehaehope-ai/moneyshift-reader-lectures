-- Create reading_progress table for tracking user reading position
create table if not exists reading_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  page_number integer not null default 1,
  device_type text not null default 'pc' check (device_type in ('pc', 'mobile')),
  last_read_at timestamp with time zone not null default now(),
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

-- Create index for faster lookups by user_id
create index if not exists idx_reading_progress_user_id on reading_progress(user_id);

-- Create index for faster lookups by device_type
create index if not exists idx_reading_progress_device_type on reading_progress(device_type);

-- Enable RLS (Row Level Security)
alter table reading_progress enable row level security;

-- Create policy to allow users to read their own reading progress
create policy "Users can read their own reading progress"
  on reading_progress for select
  using (auth.uid() = user_id);

-- Create policy to allow users to insert their own reading progress
create policy "Users can insert their own reading progress"
  on reading_progress for insert
  with check (auth.uid() = user_id);

-- Create policy to allow users to update their own reading progress
create policy "Users can update their own reading progress"
  on reading_progress for update
  using (auth.uid() = user_id);
