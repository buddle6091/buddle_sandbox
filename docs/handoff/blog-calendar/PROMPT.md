# PROMPT — apps/web 블로그 + 비공개 캘린더 구현

> 이 프롬프트는 `buddle_sandbox` 루트에서 Claude Code에 그대로 붙여넣는다.
> 긴 작업이므로 **Plan Mode로 Step별 계획을 먼저 뽑고 승인 후 실행**한다. 각 Step은 별도 세션(패키지 스코프)으로 쪼개도 된다.

---

루트 `CLAUDE.md`, `docs/state/handoff.md`, `design.md`, 그리고 `docs/handoff/blog-calendar/` 아래 `README.md` → `SCREENS.md` → `STATES.md` → `DATA.md` 순서로 읽어라. `wireframes/Wireframes.dc.html` 은 디자인 참고물이다(브라우저로 열어 확인, 코드 복사 금지).

목표: 와이어프레임의 **블로그(글 목록·읽기·블록 에디터·댓글·좋아요·조회수)** 와 **비공개 캘린더(초대 로그인·월간·조회 전용·Google Calendar 동기화)** 를 `apps/web` 에 구현한다. 스타일은 `design.md` v0.2 토큰만 쓰고, 컴포넌트는 `@sandbox/ui` 를 통해서만 만든다.

## 규율 (CLAUDE.md 요약 — 어기지 않는다)
- explore → plan → code → commit. 세션은 작업 패키지 폴더에서 시작.
- 색/간격/타이포/radius/shadow 하드코딩 금지. `@sandbox/tokens` 유틸리티·변수만.
- 새 컴포넌트는 `/new-component` 스킬. 완료 판정은 `qa-verifier` 서브에이전트.
- TDD: 실패 테스트 먼저. 검증은 `npx nx affected -t lint test typecheck`.
- Conventional Commits, 제목 영문 소문자, 본문 한글 불릿.
- 이모지·장식 아이콘·가짜 수치 금지. 아이콘은 lucide-react만, 의미 있는 자리에만.

## Step 0 — packages/tokens v0.1 → v0.2 (선행, 필수)
`packages/tokens/src/semantic.css` 가 아직 indigo 1색 v0.1이다. `design.md` §1 기준으로:
1. `primitives.css`: gray(냉회색 값 교체) / porcelain / obsidian / blue(벽청) / celadon / violet / status / navy 추가. indigo 제거.
2. `semantic.css`: `fg/body`, `fg/link`, `bg/page`, `accent/secondary|tertiary`, `glass/*`, `glaze/*`, `shadow/*`(sm·md·lg·glass·ring·intaglio), `orb/*` 추가. 세 블록(:root / media dark / .dark) **키 패리티 유지**.
3. `theme.css`: 타이포 스케일을 §2 표로 교체(display 56/64 800 … caption 12/16 500). `--container-content` 720 유지. `font-sans` Pretendard, 세리프 토큰 **만들지 않는다**.
4. `tests/fixtures/expected-tokens.ts` 먼저 고쳐 Red → `src/*.css` Green. `npx nx test tokens`.
5. `docs/state/handoff.md` 에 "Phase 0.5 토큰 v0.2" 로 flush.

## Step 1 — packages/ui 기반 컴포넌트 (Phase 1과 합침)
shadcn 모노레포 init 후 `/new-component` 로, 각각 light/dark × variant × 390/768/1280 story:
- Button(primary/glass/secondary/ghost/outline/danger), Input/Textarea(+error), Card(glass base/flat + hover pool/lift/edge), Badge, Tabs(알약 + 밑줄형), Dialog/Sheet(compact=하단 Sheet), Popover, DropdownMenu, Tooltip(불투명, compact 미사용), Toast, Skeleton, Avatar
- AppShell: TopBar(**스크롤 전 투명 → 스크롤 후 glass base**, h 52/60) + compact TabBar 56 + medium Rail 72 + expanded Sidebar 248. 같은 `navItems` 배열에서 렌더. AmbientBackground(orb 3개 + 먹선, 정적).
- EmptyState(제목 16/700 + 설명 body-sm muted + 행동 1개), ErrorState(warning Badge + 다시 시도), SyncBanner(그리드 위 띠 1개)

## Step 2 — apps/web 블로그 (SCREENS.md §A~C)
라우트: `/`(목록), `/posts/[slug]`, `/write`, `/write/[id]`, `/search?q=`, `/tags/[tag]`.
- 글 목록: 카테고리 탭(전체/개발/회고/강의, 밑줄형) + 태그 칩, 행 = 좌 텍스트(h3 제목 · body-sm 2줄 요약 · caption 메타: 카테고리 Badge · 날짜 · 조회 · 좋아요 · 댓글) / 우 썸네일(선택, 없으면 열 접기). 구분선 `border/default`.
- 글 읽기: `max-w-content` 본문(body-lg), 우측 180 sticky 목차(expanded+), 하단 좋아요·조회·댓글 알약 버튼 44h, 이전/다음 글, 댓글 섹션.
- 블록 에디터: **Tiptap**(StarterKit + Placeholder + SlashCommand + BubbleMenu + CodeBlockLowlight + Image + TaskList). 좌 사이드바 232(글 트리·태그), 우 속성 패널 300(상태 세그먼트·카테고리·태그·슬러그·템플릿), 상단 `편집 | md` 세그먼트로 md 소스 **읽기 전용 미러**(tiptap-markdown 직렬화, 커서 동기화). 슬래시 메뉴에 "회고 템플릿: Keep · Problem · Try". 블록 핸들(+ ⋮⋮) 상시 노출, 핸들 메뉴(유형 변경·복제·이동·삭제). 저장: 800ms 디바운스 자동 저장 + IndexedDB 로컬 초안. 접근: 본인(소유자)만.
- 댓글: 익명(닉네임 선택 + 비밀번호 필수 → 본인 수정·삭제). 1,000자, 1분 3개 제한, 낙관적 추가. 작성자 답글 Badge. 답글 있는 댓글 삭제 시 본문만 "삭제된 댓글이에요".
- 좋아요: 비로그인 1회(localStorage + 서버 fingerprint), 낙관적 +1 → 실패 롤백 토스트. 300ms 스로틀.
- 조회수: 진입 3초 후 +1, 세션 중복·소유자 제외. 별도 요청, 실패 시 항목 숨김(0 금지).
- 검색: 제목+본문 전문검색(Supabase `tsvector` 또는 pg_trgm), 빈 결과에 입력값 「」 표기 + 추천 칩.

## Step 3 — apps/web 비공개 캘린더 (SCREENS.md §D)
라우트: `/calendar`(게이트), `/calendar/[yyyy-mm]`. 전부 `(private)` 라우트 그룹 + 미들웨어.
- 인증: Supabase Auth 매직 링크. **초대 테이블 allowlist** 에 있는 이메일만 전송(미초대·미존재 동일 문구). 15분 만료, 60s 재전송 쿨다운. 세션 만료 시 보던 월 복귀.
- 월간 그리드: 7열, 셀 min-h 76(expanded) / 점 표시(compact). 유형 색: 강의=accent/default, 멘토링=accent/secondary, 출장·이동=accent/tertiary, 휴무=fg/subtle. 오늘은 accent 원.
- 필터 바: 기업·기관 ▾ / 유형 ▾ / 기간 ▾ / 장소(온·오프라인) ▾ 칩 + 우측 "이번 달 N건" 요약. URL 쿼리로 상태 유지.
- 상세: 클릭 → Popover(solid glass, 260w): 유형 Badge · 과정명 · 시간 · 장소 · 기관 · 출처(동기화 시각). compact는 하단 Sheet + 선택일 리스트.
- **조회 전용**: 수정·삭제·추가 UI 없음. 우클릭/길게 누르기 → "이 캘린더는 조회만 가능해요" 툴팁. "구글 캘린더에서 열기"는 소유자에게만.
- 기업·기관명 마스킹: `DATA.md` 규칙(마스킹 테이블) 에 걸리면 빗금 자리표시 + 「비공개」 Badge. 서버에서 마스킹해 내려보낸다(클라이언트에 원문 금지).
- 동기화: 서버 cron 10분 간격 Google Calendar API(read-only scope) → Supabase `events` 캐시. 상태 띠: 연결 끊김(warning, 소유자만 "다시 연결") / 지연 / 실패(danger, 다시 시도). 월 이동 시 날짜 즉시 + 칩만 스켈레톤, 본 달은 캐시.

## Step 4 — 상태·예외 (STATES.md 전수)
각 화면에 로딩(스켈레톤, 300ms 지연 후 표시, 1.2s 투명도 펄스) / 빈 / 오류 / 오프라인 / 404 / 확인 Dialog / 토스트(하단 중앙, 4s, 액션 1개, 삭제는 실행 취소 5s) 를 Storybook story + Testing Library 테스트로 고정한다. 파괴적 행동만 danger 버튼.

## Step 5 — 모션 (design.md §4 + 아래)
- 이징 `motion/ease` 하나. control 170 / surface 300 / pool 420. `transition: all` 금지, reduced-motion 처리.
- 페이지 전환(블로그 ↔ 캘린더): 콘텐츠만 투명도 + translateY(6px→0) 300ms, TopBar 고정. Next `template.tsx` + View Transitions API(지원 시).
- 목록 → 글: 제목 공유 요소 전환(`view-transition-name`), 본문만 스켈레톤.
- 에디터: 사이드바 폭 232→0 300ms, md 토글 크로스페이드 170ms, 슬래시/버블 메뉴 scale .96→1 + 투명도 170ms, 속성 패널 탭은 내용만 크로스페이드.
- 캘린더: 월 이동 그리드 가로 24px 슬라이드 + 투명도 300ms(방향 = 이동 방향), 팝오버 scale .96→1 170ms, 필터 변경 시 칩만 투명도 170ms, 선택일 리스트 항목 30ms 스태거.
- 좋아요 하트 scale 1→1.15→1 170ms, 숫자 롤링 170ms. 토스트 아래서 8px 300ms.

## 완료 기준
- `npx nx affected -t lint test typecheck build` 통과, Playwright: (1) 글 게시 → 목록 상단 노출 → 읽기 → 익명 댓글 (2) 미초대 이메일 거부 → 초대 이메일 로그인 → 월간 조회 → 팝오버.
- 390/768/1280/1440 가로 스크롤 0, 터치 44, compact 입력 16px, 본문 대비 4.5:1.
- `qa-verifier` 통과 후 `docs/state/handoff.md` 갱신(Phase 2 완료 + 결정 사항 + 미룬 것).
