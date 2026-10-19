# DATA — 모델 · API · 권한 · 동기화

> Supabase(Postgres + Auth + RLS). 스키마는 `packages/schema`(zod)에 두고 프론트/서버 공유.

## 테이블
```
posts        id, slug, title, category(enum 개발|회고|강의), tags text[], status(draft|review|published),
             content_json(Tiptap doc), content_md(직렬화 캐시), excerpt, thumbnail_url?, reading_min,
             view_count, like_count, comment_count, published_at?, created_at, updated_at, author_id
post_views   post_id, session_hash, viewed_at            -- 세션 중복 제외용, 30일 보관
post_likes   post_id, fingerprint_hash, created_at        -- 비로그인 1회
comments     id, post_id, parent_id?, nickname?, password_hash(bcrypt), body(≤1000), is_deleted,
             is_author, ip_hash, created_at, updated_at
invites      email(unique), invited_by, created_at, revoked_at?
events       id, gcal_event_id(unique), type(enum 강의|멘토링|출장이동|휴무), title, starts_at, ends_at, all_day,
             location?, is_online, org_name, course_name?, source_updated_at, synced_at
org_mask     org_name(unique), masked boolean, note      -- 마스킹 규칙 테이블(소유자만 편집)
sync_state   id=1, status(ok|degraded|disconnected|failed), last_ok_at, last_error?, refresh_token(encrypted)
```

## 권한 (RLS)
- posts: published는 anon select. draft/review와 insert/update/delete는 `author_id = auth.uid()`(소유자 1명).
- comments: anon select(is_deleted면 body null로 뷰 처리) / anon insert(rate limit: ip_hash 1분 3개, Edge Function) / update·delete는 password 검증 RPC 통해서만. 5회 실패 → ip_hash 10분 잠금.
- post_likes: anon insert/delete(fingerprint 1회). post_views: anon insert only.
- events: `auth.email() in (select email from invites where revoked_at is null)` 또는 소유자. **org_name은 뷰에서 마스킹** — `events_visible` 뷰가 org_mask join 후 masked면 org_name → null, is_masked → true. 클라이언트는 뷰만 읽는다.
- invites, org_mask, sync_state: 소유자만.

## API (Route Handlers / Server Actions)
- `GET /api/posts?category&tag&q&cursor` — 목록. q는 tsvector(simple + pg_trgm) 검색.
- `GET /api/posts/[slug]` / `POST /api/posts/[id]/view`(3초 후 클라이언트 호출, session_hash) / `POST|DELETE /api/posts/[id]/like`
- `POST /api/posts` `PATCH /api/posts/[id]`(자동 저장, updated_at 낙관적 잠금 → 409 = 충돌 Dialog) `POST /api/posts/[id]/publish`(유효성) `DELETE`
- `POST /api/upload` — 이미지 10MB, png/jpg/webp, Supabase Storage, 진행률은 XHR.
- `GET|POST /api/posts/[id]/comments` `PATCH|DELETE /api/comments/[id]`(body: password)
- `POST /api/calendar/invite-login` — invites 확인 후 Supabase `signInWithOtp`. 미초대도 200 + 같은 UI 문구(타이밍 균일화).
- `GET /api/calendar/events?from&to&org&type&place` — events_visible. 응답에 `sync_state` 요약 포함.
- `POST /api/calendar/sync` — cron(Vercel Cron 10분) + 소유자 수동. Google Calendar API `events.list`(calendar.readonly, syncToken 증분). 유형 판별: 이벤트 색상 ID 또는 제목 접두 규칙(`[강의]` `[멘토링]` `[출장]` `[휴무]`) → 매핑 테이블은 env/설정으로.

## 상태 (클라이언트)
- 목록: URL(`?category&tag&q`) 가 단일 출처. TanStack Query 키 `['posts', params]`, keepPreviousData.
- 에디터: Tiptap doc(메모리) → 800ms 디바운스 → IndexedDB(`drafts/[id]`) → 서버 PATCH. 저장 상태 머신 `idle|saving|saved|failed|conflict`. beforeunload + 라우트 가드.
- 좋아요: localStorage `liked:[postId]` + 서버 fingerprint. 낙관적 업데이트 + onError 롤백.
- 캘린더: URL `/calendar/2026-10?org=&type=&place=`. 월별 쿼리 캐시 staleTime 10분. 선택 이벤트 id는 `?e=`.
- 온라인/오프라인: `navigator.onLine` + 실패 감지, 목록은 SW 캐시(Next PWA 선택).

## 비기능
- 조회수·좋아요는 비동기 집계(트리거로 posts 카운트 갱신). 0 표시 금지 규칙은 UI에서.
- 로그/에러: Sentry(또는 Vercel). 댓글 스팸은 Edge rate limit + honeypot 필드.
- 접근성: 모든 Dialog focus trap, 팝오버 Esc, 캘린더 그리드 `role=grid` + 화살표 이동, 일정 칩 `aria-label`에 유형·시간·제목.
