# 머니시프트 전자책 사이트

로그인한 허용 고객만 "머니시프트" 전자책(PDF)을 웹에서 읽을 수 있는 사이트입니다.

## 폴더에 PDF 넣기

프로젝트 최상위 폴더에 `moneyshift.pdf` 파일을 넣으세요. (예: `/moneyshift.pdf`)

## 환경 변수

`.env.local.example` 파일을 참고해 `.env.local`을 만들고 Supabase 값을 채워주세요.

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_EMAIL` (관리자로 로그인할 이메일)

## Supabase 테이블

`supabase/schema.sql` 내용을 Supabase 대시보드의 SQL Editor에 붙여넣고 실행하세요.

## 로컬 실행

```
npm install
npm run dev
```

## 페이지

- `/login` : 고객 로그인
- `/content` : 로그인 후 첫 화면 (전자책 + 강의 목록)
- `/book` : 전자책 뷰어 (로그인 + 권한 필요)
- `/lecture/[id]` : 강의 영상 재생 (로그인 + 권한 필요)
- `/admin` : 관리자 페이지 (ADMIN_EMAIL 계정으로 로그인 필요, 고객 등록/권한 및 강의 제목·영상 URL 관리)
