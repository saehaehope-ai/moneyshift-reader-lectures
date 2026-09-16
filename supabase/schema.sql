-- 머니시프트 전자책 사이트 - Supabase 테이블 설정
-- Supabase 대시보드 > SQL Editor 에 이 내용을 전부 붙여넣고 Run 버튼을 누르세요.

-- 1) 구매(권한 허용) 고객 목록
create table if not exists public.allowed_users (
  email text primary key,
  access_enabled boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.allowed_users enable row level security;
-- 정책을 추가하지 않습니다: 일반 로그인 사용자는 이 표를 볼 수 없고,
-- 서버(관리자 기능, service role)만 읽고 쓸 수 있습니다.

-- 2) 이어보기 진행 상황
create table if not exists public.reading_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  last_page integer not null default 1,
  total_pages integer,
  updated_at timestamptz not null default now()
);

alter table public.reading_progress enable row level security;

create policy "본인 진행 상황 조회"
  on public.reading_progress for select
  using (auth.uid() = user_id);

create policy "본인 진행 상황 추가"
  on public.reading_progress for insert
  with check (auth.uid() = user_id);

create policy "본인 진행 상황 수정"
  on public.reading_progress for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 3) 강의 목록 (제목 + 영상 URL)
create table if not exists public.lectures (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  order_index integer not null default 0,
  video_url text,
  created_at timestamptz not null default now()
);

alter table public.lectures enable row level security;
-- 정책을 추가하지 않습니다: 강의 목록은 서버(관리자 기능, service role)에서만
-- 읽고 쓰며, 로그인 사용자에게는 서버가 필요한 정보만 골라 전달합니다.
