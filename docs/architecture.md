# 아키텍처 메모 — 배포 · 캘린더 동기화 (2026-11-02, 제안)

> 사용자 질문 2개(배포 호스트 / 캘린더 반영 방식)에 대한 답과, 앞으로 확장할 서비스가 따라야 할 구조.
> 상태: **제안 — 사용자 결정 대기**(끝의 "결정 대기" 3개). 결정되면 이 문서를 "확정"으로 바꾸고 루트 `CLAUDE.md` 스택 표를 고친다.
> 데이터 모델·API 는 `docs/handoff/blog-calendar/DATA.md` 가 SSOT. 이 문서는 그 위에 "어디서 돌리고, 어떻게 가져오나"만 적는다.

## 0. 전제 — 지금 코드가 호스트에 요구하는 것

| 요구 | 어디서 나오나 | 의미 |
|---|---|---|
| 서버 런타임(Node) | Route Handlers `/api/*`, 초대 로그인 세션, Supabase 서버 클라이언트 | **정적 호스팅(S3 단독)은 불가** |
| 주기 실행(cron) | `/api/calendar/sync` 10분 | 호스트 cron 또는 DB cron |
| 큰 정적 파일 | `public/hero/glaze-loop.mp4`, 이미지 | CDN 캐시 필수 |
| 2번째 zone | Multi-Zones(`apps/console`, Phase 4) | 경로 기준 라우팅(rewrites) |
| 비밀값 | Supabase service key, Google 키, `CRON_SECRET` | 호스트 시크릿 저장소 |

랜딩 `/` 과 공개 블로그는 빌드 시 프리렌더(정적 HTML)라 CDN 에서 바로 나간다. 서버가 실제로 깨어나는 경로는 `/api/*` 와 `/calendar` 뿐이다. 이 사실이 아래 비용·콜드스타트 판단의 근거다.

---

## 1. 배포 — "Cloudflare 만으로 되나, S3 에 올려야 하나"

### 결론
- **S3 에 "배포" 는 정답이 아니다.** S3 단독은 `output: 'export'`(완전 정적)만 받는다. 그러면 Route Handler · 초대 로그인 · cron 동기화 · 이미지 최적화 · Multi-Zones rewrites 가 전부 사라진다. 비공개 캘린더가 성립하지 않는다.
- **AWS 를 쓴다면 OpenNext(SST) 로 Lambda + CloudFront + S3.** 여기서 S3 는 "정적 에셋 버킷"일 뿐이고 서버는 Lambda, 입구는 CloudFront 다. "S3 에 배포"라고 부르는 것의 올바른 형태가 이것이다.
- **AWS 가 목적이 아니라면 Cloudflare Workers 하나로 충분하다.** `@opennextjs/cloudflare` 로 Next App Router 를 Workers 에 올린다. 정적은 Workers Assets, cron 은 Cron Triggers, 비밀은 Workers Secrets. 서비스 하나로 끝나고 비용이 가장 낮다.
- **둘을 겹치지 않는다.** Cloudflare 프록시(주황 구름) 앞 + CloudFront 뒤 구성은 캐시가 2중이 되어 ISR/무효화 디버깅이 안 된다. AWS 로 가면 Cloudflare 는 **DNS 전용(프록시 off)** 으로만 쓴다.

### 선택지 비교

| | Cloudflare Workers (OpenNext) | AWS SST + OpenNext | AWS Amplify Hosting | Vercel (기존 결정) |
|---|---|---|---|---|
| Next 16 App Router | 지원(구현 시점에 어댑터 버전 확인) | 지원(동일 OpenNext 코어) | Amplify 어댑터가 Next 최신 추종이 늦는 편 | 1급 |
| 서버 실행 | Worker(V8 isolate, 콜드스타트 거의 0) | Lambda(콜드스타트 수백 ms, `/api` `/calendar` 에만 영향) | Lambda | Fluid/Functions |
| 정적·CDN | Workers Assets + CF CDN | S3 + CloudFront | CloudFront | Vercel CDN |
| cron | Cron Triggers | EventBridge → Lambda | 없음(외부 cron 필요) | Vercel Cron |
| ISR/태그 캐시 | R2 + KV(설정 필요) | S3 + DynamoDB(SST 가 자동) | 제한적 | 자동 |
| 이미지 최적화 | 내장 없음 → Cloudflare Images 또는 `unoptimized` | Lambda 이미지 함수(자동) | 자동 | 자동 |
| Multi-Zones | zone 당 Worker 1개 + 라우트 | CloudFront behavior 를 경로별로 분기 | 가능 | 1급 |
| 운영 부담 | 낮음(서비스 1개) | 중간(IaC 로 리소스 6~8개, 하지만 SST 가 감춤) | 낮음 | 가장 낮음 |
| 비용(이 규모) | 무료~$5/월 | 거의 무료(프리티어) + CloudFront 소액 | 무료~소액 | 무료(Hobby) |

### 권장
1. **AWS 경험·이력이 목적이면 → SST + OpenNext.** `sst.config.ts` 한 파일로 CloudFront·S3·Lambda·DynamoDB 가 생기고, `sst deploy --stage prod` 가 전부다. 리전 `ap-northeast-2`. 프론트엔드 관점에서 얻는 것: CloudFront 캐시 정책·무효화·Lambda 콜드스타트를 직접 보게 되므로 "왜 SSR 페이지가 느린가"를 실측으로 배운다. 잃는 것: Vercel 의 프리뷰 배포·자동 롤백을 직접 만들어야 한다(GitHub Actions 에 `sst deploy --stage pr-<n>`).
2. **빨리 띄우고 싶고 AWS 가 필수는 아니면 → Cloudflare Workers.** 어댑터 하나, 비밀 하나, cron 하나. 다만 Node API 호환이 100% 는 아니라(`nodejs_compat` 플래그) `googleapis` 같은 무거운 SDK 는 피하고 **REST 직접 호출**로 쓴다(2절의 캘린더 동기화는 이미 그렇게 설계).
3. 어느 쪽이든 **Supabase 는 그대로**(DB·Auth·Storage). 호스트는 "Next 가 도는 곳"만 바꾼다.

### 코드에 미리 반영할 것 (호스트 중립 — 지금부터 지키면 어느 쪽으로도 간다)
- Vercel 전용 API 금지: `@vercel/*` 패키지, `vercel.json` cron. cron 은 **Supabase `pg_cron` + `pg_net`** 이 `POST /api/calendar/sync` 를 `Authorization: Bearer $CRON_SECRET` 로 호출한다. 호스트가 바뀌어도 cron 은 DB 에 산다.
- 서버 코드는 `runtime = 'nodejs'`(기본) 유지. Edge 런타임 지정 금지 — Workers/Lambda 양쪽에서 가장 호환이 넓은 경로.
- 환경변수는 `apps/web/src/env.ts` 에서 zod 로 한 번 파싱해 쓴다(누락 시 빌드 실패). 브라우저 노출은 `NEXT_PUBLIC_` 만.
- 이미지는 `next/image` 를 쓰되 로더를 **설정으로 바꿀 수 있게** `next.config.ts` 의 `images` 만 손대면 되도록 한다. 영상(mp4)은 `public/` 에 두면 OpenNext 가 S3/Assets 로 올린다(16MB 아래 유지).
- 데이터 접근은 Route Handler 경유(기존 결정 유지). 브라우저가 Supabase 를 직접 치지 않으므로 호스트 변경 시 영향 범위가 `/api/*` 로 한정된다.
- Multi-Zones: 메인 zone `next.config.ts` 의 `rewrites` 로 `/console/*` → 2번째 zone 의 URL. 2번째 zone 은 `assetPrefix: '/console-static'`. 이 규칙은 Vercel·Cloudflare·AWS 모두 같다.

### 구현 시 확인 항목
- [ ] 선택한 OpenNext 어댑터가 **Next 16.4** 를 지원하는지(릴리즈 노트). 아니면 Next 를 지원 범위로 고정한다.
- [ ] CloudFront(or CF) 에서 `/calendar` 가 **캐시되지 않는지**(`Cache-Control: private, no-store`) — 초대 사용자 A 의 화면이 B 에게 가면 사고다.
- [ ] `tools/capture-landing.mjs` 를 배포 URL 로도 돌려 가로 스크롤·콘솔 에러 0 확인.

---

## 1.5 서버 계층 — Supabase 로 충분한가, 직접 백엔드를 만드나

### 결론
**지금 범위(랜딩·블로그·비공개 캘린더)는 Supabase + 얇은 Next Route Handler 로 충분하다.** 별도 백엔드를 지금 만들면 두 번째 배포 단위·두 번째 인증 경계·두 번째 CI 가 생기는데, 그걸로 얻는 기능이 없다. 단, **"서버리스가 부담"은 두 가지 다른 문제**이므로 갈라서 본다.

| 부담의 정체 | 해법 | 백엔드를 새로 짜야 하나 |
|---|---|---|
| 콜드스타트·실행시간 제한·벤더 종속 (= 서버리스 **실행 모델**이 싫다) | Next 를 **컨테이너로** 돌린다: `next start` 를 Docker 로 → ECS Fargate 1태스크 / Fly.io / 작은 EC2. 코드 변경 0 | **아니오** |
| Route Handler 에 비즈니스 로직이 쌓여 Next 가 백엔드 흉내를 낸다 (= **코드 구조**가 싫다) | 로직을 Postgres(RLS·뷰·RPC) 와 `packages/` 로 내린다. Route Handler 는 검증 → DB 호출 → 응답 20줄 | **아니오** |
| Python(AI)·장시간 작업·웹소켓·큐 (= Next 가 **못 하는 일**) | 그때 `apps/api`(FastAPI) 를 **별도 배포 단위**로 추가. 같은 Supabase Postgres 를 보고, 같은 도메인 `/api/ai/*` 로 라우팅 | **예 — 하지만 그 시점에** |

### Supabase 가 지금 감당하는 것
| 요구 | Supabase 기능 | 비고 |
|---|---|---|
| 데이터·권한 | Postgres + RLS + 뷰 | 마스킹·초대 허용목록이 전부 DB 안(기존 결정) |
| 로그인 | Auth 매직 링크 | 초대자만 통과는 RLS 가 막음 |
| 이미지 | Storage | 블로그 업로드 10MB |
| 주기 실행 | `pg_cron` + `pg_net` | `/api/calendar/sync` 를 10분마다 호출. 호스트 cron 불필요 |
| 검색 | tsvector + pg_trgm | 블로그 검색 |
| 비밀번호 댓글·카운터 | RPC(plpgsql) · 트리거 | 로직이 DB 에 있어 호스트 무관 |
| 레이트 리밋 | Edge Function 또는 Route Handler + `pg` 카운터 | 댓글 1분 3개 |

빠지는 것: Google 동기화 **코드**(fetch → 정규화 → upsert)는 어딘가에서 돌아야 한다. 이게 Next Route Handler `/api/calendar/sync` 다. Node 한 파일, 외부 의존은 `fetch` 뿐. 이걸 위해 백엔드를 따로 세우지 않는다.

### 직접 백엔드로 넘어가는 신호 (하나라도 켜지면 `apps/api` 착수)
- Python 라이브러리가 필요한 AI 도메인 작업이 들어온다(루트 CLAUDE.md 의 "이후 Python 확장"이 이 시점).
- 요청 하나가 30초를 넘는다(Lambda·Workers 한계. 배치·크롤링·임베딩 생성).
- 웹소켓/SSE 상시 연결, 또는 큐 워커가 필요하다.
- Route Handler 파일이 200줄을 넘거나 핸들러끼리 import 가 생긴다 → 로직이 Next 에 고였다는 신호. 먼저 Postgres/`packages/` 로 내리고, 그래도 안 되면 분리.

### 그때를 위해 지금 지킬 경계
- Route Handler 는 **입력 검증(zod) → Supabase 호출 → 응답** 만. 도메인 규칙은 SQL(뷰·RPC·트리거) 또는 `packages/schema`·`packages/utils` 순수 함수.
- 브라우저 ↔ 서버 계약은 `packages/schema` zod 하나. FastAPI 가 들어와도 같은 JSON 계약(pydantic 으로 미러)을 지키면 프론트는 무변경.
- DB 스키마는 `supabase/migrations/*.sql` 이 SSOT. Next 도 FastAPI 도 같은 마이그레이션을 본다.
- 모든 서버 코드는 `runtime = 'nodejs'`. Edge 전용 API 를 쓰지 않아야 컨테이너로 옮길 때 그대로 뜬다.

---

## 2. 캘린더 — "주기적으로 .ics 넣기 vs 연동"

### 결론
**연동. 단, 화면이 Google 을 직접 보지 않는다.** 서버 cron 이 10분마다 Google 에서 당겨와 Supabase `events` 에 캐시하고, 마스킹은 DB 뷰(`events_visible`)에서 끝낸 뒤 Route Handler 가 그 뷰만 읽는다. 핸드오프 `DATA.md` 의 설계 그대로다. 수동 `.ics` 업로드는 쓰지 않는다.

| 방식 | 신선도 | 운영 | 마스킹 | 판정 |
|---|---|---|---|---|
| A. `.ics` 파일을 손으로 내보내 주기적 업로드 | 올릴 때만 | 매번 사람 손. 잊으면 틀린 일정이 공개됨 | 업로드 전 수동 편집 → 실수 | ✗ |
| B. 비밀 iCal 주소(ICS URL)를 cron 이 fetch → 파싱 | 10분 | 자동. OAuth 없음 | 서버에서 처리 | **대안(폴백)** |
| C. Google Calendar API 를 **서비스 계정**으로 읽기 | 10분, `syncToken` 증분 | 자동. 토큰 만료 없음 | 서버에서 처리 | **권장** |
| D. OAuth 사용자 토큰(refresh_token 저장) | 10분 | **개인 Gmail + 앱 'Testing' 상태면 refresh token 7일 만료** → 매주 재연결. 'Production' 으로 올리려면 민감 scope(`calendar.readonly`) 검증 심사 | 서버에서 처리 | 스펙 원안이나 비권장 |
| E. 요청 시점에 Google 을 실시간 호출 | 즉시 | Google 장애 = 페이지 장애, 쿼터 소모 | 응답 경로에 원문이 흐름 | ✗ |

**C 를 권장하는 이유(프론트 관점):** 페이지는 항상 우리 DB 만 읽으므로 로딩이 일정하고(월 이동 시 캐시 히트), Google 이 죽어도 "마지막 동기화 10분 전" 띠만 뜨고 화면은 산다. 서비스 계정은 "내 캘린더를 특정 봇 이메일에 읽기 공유"하는 것이라 OAuth 동의 화면·토큰 만료·심사가 전부 없다. `DATA.md` 의 `sync_state.refresh_token` 컬럼은 서비스 계정 방식에선 필요 없다(키는 호스트 시크릿에만).
**B 가 폴백인 이유:** Google Cloud 프로젝트를 만들기 싫으면 캘린더 설정의 "비공개 주소(iCal)" 하나로 같은 파이프라인을 돌릴 수 있다. 대신 증분 동기화가 없고(매번 전체), 주소가 새면 전체가 새는 것이라 비밀로 취급해야 한다.

### 데이터 흐름
```
Google Calendar ──(10분, SA 키 or ICS URL)──▶ POST /api/calendar/sync
                                                │  1. 가져오기(events.list syncToken / ics 파싱)
                                                │  2. 정규화: type(접두 [강의][멘토링][출장][휴무] 또는 colorId)
                                                │     org_name·course_name 분리, description 은 버림
                                                │  3. upsert events(gcal_event_id unique), sync_state 갱신
                                                ▼
                                       Supabase events (원문 org_name, RLS: 초대자·소유자만)
                                                │
                                       events_visible 뷰 ── org_mask 조인 → 마스킹이면 org_name NULL, is_masked true
                                                │
                                       GET /api/calendar/events?from&to ── zod 응답 스키마(org_name nullable)
                                                ▼
                                       /calendar 월간 뷰 (원문은 브라우저에 절대 안 옴)
```

### 마스킹 — 3중 방어 (스펙에서 한 가지만 뒤집는다)
1. **기본값을 "마스킹"으로(default-deny).** `DATA.md` 는 `org_mask.masked boolean` 인데, 테이블에 **없는** 기관은 마스킹 처리로 뒤집는다(= 공개 허용 목록). 새 거래처가 생겨도 등록 전까지 자동으로 「비공개」. 실수 방향이 "안 보여야 할 게 보임"이 아니라 "보여도 되는 게 안 보임"이 되도록.
2. **원문이 흐르는 길을 뷰 하나로 좁힌다.** Route Handler 는 `events_visible` 만 SELECT. `events` 테이블 직접 조회는 `/api/calendar/sync` 뿐. 로그·에러 메시지에 `org_name` 금지. `description` 은 아예 저장하지 않는다(본문에 기업명·담당자가 섞인다).
3. **계약으로 고정.** `packages/schema` 의 이벤트 응답 스키마는 `org_name: string | null, is_masked: boolean`. 테스트: 미등록 org 를 가진 이벤트를 넣고 API 응답에서 `org_name === null` 을 확인(Red → Green). 마스킹 UI(빗금 + 「비공개」 Badge)는 `is_masked` 만 본다.

### 운영
- `sync_state` 로 상태 띠: `ok` / `degraded`(마지막 성공 30분 초과) / `failed`. 소유자만 "지금 동기화" 버튼(`POST /api/calendar/sync` 수동).
- cron 호출은 `CRON_SECRET` 검증. 호스트 cron 대신 Supabase `pg_cron` → `pg_net.http_post` 로 두면 1절의 호스트 선택과 무관.
- 쿼터: 10분 × 144회/일, 증분이면 호출당 몇 KB. 무료 한도 안.

### 2.5 기업명 → 업종 라벨 마스킹: 순수 TS 매핑이 기본, LLM 은 선택 (2026-11-02 결정)

사용자 의도: 기업명을 「반도체 / 전자 대기업」 같은 **업종 라벨**로 바꿔 공개한다.
결론: **LLM 없이 간다.** 출강처 38곳, 연간 신규 몇 곳 규모에서는 `org_name → enum` 매핑 테이블 한 줄 추가가 LLM 파이프라인(키 관리·검토 큐·2차 검사·비용 상한)보다 싸고, 결정적이라 테스트가 단순하며, 데이터가 외부로 나가지 않는다. default-deny 가 깔려 있으면 **매핑에 없는 이름은 자동으로 「비공개」**이므로 LLM 의 보안상 역할은 애초에 없다.

#### 구조
```
packages/schema/calendar.ts   IndustryLabel enum(~10) · OrgSize enum(6) · 한국어 표시 문구 맵   ← 실명 없음, 커밋 OK
packages/utils/org-name.ts    normalizeOrgName(): trim · 공백 제거 · (주)/주식회사/㈜ 접미 제거 · 대소문자   ← 유닛 테스트
supabase  org_label           org_name_norm unique, industry, size, status(approved|needs_review|rejected), note, updated_at   ← 소유자 RLS, 실명은 여기만
          events_visible 뷰   org_label 조인 → label = industry‖size (approved 만) ELSE '비공개'
                              title = course_name 에 등록 org 토큰 포함 시 유형만
```

- **매핑은 코드에 넣지 않는다.** 포트폴리오 리포는 공개 전제. `{ '삼성전자': 'semiconductor' }` 같은 파일을 커밋하면 git 히스토리에 고객사 실명이 영구히 남는다. 매핑은 `org_label` 테이블(소유자만)이고 소유자 화면에서 편집한다. `seed.sql` 에도 실명 금지 — 로컬 전용 `seed.local.sql` 을 gitignore.
- **매칭은 정규화 + 정확 일치만.** 부분 문자열·유사도 매칭은 오탐(다른 회사에 같은 라벨)이 나므로 쓰지 않는다. 정규화 함수는 `packages/utils` 에 두고 테스트로 고정한다("(주)ABC" "ABC 주식회사" "abc" 가 같은 키).
- **과정명 검사.** 등록된 org 토큰(정규화 전 원문, 2글자 이상)이 `course_name` 에 포함되면 과정명을 숨기고 유형(강의/멘토링)만 보여준다. 모르는 회사명이 과정명에 있어도 그 org 자체가 미등록이라 이벤트가 이미 「비공개」.
- **새 이름 알림.** sync 가 미등록 org 를 만나면 `org_label` 에 `status='needs_review'` 행만 만든다. 소유자 화면 상단 "미분류 N건" 배지 → enum 두 개 고르면 끝. 이 검토 UI 가 이 기능의 전부다.
- **뷰가 경계.** Route Handler 는 `events_visible` 만 읽는다. 원문 `org_name` 은 `events`·`org_label` 두 테이블에만 있고 둘 다 소유자 RLS.

#### 테스트 (Red 먼저)
① 미등록 org → `label === '비공개'`, `is_masked === true` ② `needs_review` → '비공개' ③ `rejected` → '비공개' ④ 정규화: "(주)ABC"·"ABC 주식회사"·"abc" 동일 키 ⑤ course_name 에 등록 org 포함 → title 이 유형만 ⑥ 응답 zod 에 `org_name` 필드가 **존재하지 않음**(스키마 레벨에서 원문 전달 불가).

#### LLM 을 붙일 때 (선택 확장, 지금은 안 함)
가치가 있는 경우는 하나 — 소유자가 검토 화면을 자주 안 보는데 새 거래처 일정이 바로 공개되길 원할 때. 그때도 **제안기**로만 붙인다: `claude-opus-5-5` + 구조화 출력(`messages.parse` + zod enum, 자유 텍스트 필드 없음, 도구 없음), 보내는 필드는 `org_name`·`course_name` 둘뿐, 결과는 `org_label` 에 `status='auto'`(confidence high) 또는 `needs_review`, 저장 전 "라벨에 org 토큰 포함 시 거부" 2차 검사, 키는 서버 전용 env + 월 한도. 캘린더 제목은 타인 초대로도 들어오는 신뢰 불가 입력이므로 인젝션 가정 — enum 출력이라 따라도 할 수 있는 게 없다. 구조가 바뀌지 않으므로 나중에 붙여도 마이그레이션 없음.

#### 스펙 변경점 (DATA.md 에 반영)
- `org_mask(org_name, masked, note)` → **`org_label`**(위). `masked boolean` 의미는 `status` 로 흡수(미등록 = 마스킹).
- `events_visible` 응답 zod: `org_label: string`(항상 존재, 미분류면 '비공개') · `is_masked: boolean` · `org_name` 필드 **없음**.

---

## 3. 결정 대기 (사용자)
1. **배포 목적** — AWS 운영 경험이 목표(→ SST+OpenNext)인가, 가장 단순·저렴(→ Cloudflare Workers)인가. 서버리스 실행 모델 자체가 부담이면 Next 컨테이너(Fargate/Fly) 도 선택지. 어느 쪽이든 Cloudflare+AWS 이중 CDN 은 안 한다.
2. **캘린더 인증** — Google Cloud 프로젝트 + 서비스 계정 생성에 동의하는가(권장 C). 아니면 비밀 iCal 주소(B)로 시작하고 나중에 C 로 올린다.
3. **라벨 enum 초기 목록** — 업종 ~10개 · 규모 6개 문구 확정(`packages/schema/calendar.ts`).

### 확정 (2026-11-02)
- 서버 계층: **Supabase + 얇은 Route Handler.** 별도 백엔드(`apps/api`, FastAPI)는 1.5절 신호가 켜질 때.
- 마스킹: **순수 TS 매핑 + `org_label` 테이블, default-deny.** LLM 은 선택 확장(2.5절), 지금은 안 붙임.
- 매핑·실명은 코드/seed 에 커밋하지 않는다(DB 와 gitignore 된 `seed.local.sql` 만).

결정 1~3 이 되면: 루트 `CLAUDE.md` 스택 표 "배포" 행 수정 → `docs/handoff/blog-calendar/DATA.md` 의 `org_mask`→`org_label`, `sync_state.refresh_token` 제거(서비스 계정) 반영 → `docs/state/handoff.md` 에 결정 기록.
