# SandBox — 상태 원장

> 세션 시작 시 이 파일 + `CLAUDE.md` 를 먼저 읽는다.
> 계획 전체는 `sandbox-roadmap.md`, 토큰 스펙은 `../../design.md`.

## 현재 상태 (2026-10-12)
- Nx 22.6.5 모노레포(**npm** workspaces), 브랜치 `master`, 리모트 `github.com/buddle6091/buddle_sandbox`
- **origin/master push 완료** (`f0505cc`). 이관 시점의 미push 상태는 해소됨.
- **Phase 0 완료** — `packages/tokens` (아래 참고)
- **Phase 0.5 완료** — 토큰 v0.2 (Glass). `design.md` v0.2 와 코드 일치.
- **Phase 1 완료** — `packages/ui` (아래 "Phase 1 결과"). 다음은 Phase 2 `apps/web` (PROMPT.md Step 2~5).
- **lefthook 켜짐** — 커밋 시 affected lint/test/typecheck 가 실제로 돈다.
- 핸드오프 번들 `docs/handoff/blog-calendar/` (README → SCREENS → STATES → DATA → PROMPT). 다음 작업의 스펙.

### 완료된 Phase
| Phase | 상태 | 산출물 |
|---|---|---|
| 0 기반 | **완료** | `packages/tokens`, npm workspaces, nx targetDefaults, 경계 태그 |
| 0.5 토큰 v0.2 | **완료** | glass/glaze/shadow/orb 토큰, 타이포 v0.2, 모션·레이아웃 변수, 계약 테스트 114개 |
| 1 디자인시스템 | **완료** | `packages/ui` 컴포넌트 22개 + 훅 3개 + Storybook 10, ESLint 경계 규칙, lefthook 게이트 |

## ⚠ 환경 — Node 24 필수
`.nvmrc` = `24`. 세션 시작 시:
```bash
nvm use
```
**v20.16.0 에서는 동작하지 않는다.** vitest 4 가 끌어오는 vite 8 이 `node ^20.19.0 || >=22.12.0` 을 요구한다. 낮은 버전에서는
- npm arborist 가 크래시하고 (`Cannot read properties of null (reading 'edgesOut')`)
- rolldown 네이티브 바인딩이 조용히 skip 돼 테스트가 아예 실행되지 않는다.

`--legacy-peer-deps` 로 우회하려던 흔적이 보이면 그건 잘못된 처방이다. Node 버전을 올리면 플래그 없이 깨끗이 설치된다. CLAUDE.md 의 "Node 20.9+" 하한도 이 조합에서는 실질 20.19+ 다.

## Phase 0 결과 — packages/tokens
`../../design.md` → 실행 가능한 CSS. 자세한 사용법은 `packages/tokens/README.md`.

- 3단 구조: `primitives.css`(원시 20종) → `semantic.css`(의미 15종 + shadow) → `theme.css`(Tailwind 매핑)
- 다크모드 3갈래: 시스템(`prefers-color-scheme`) / 명시(`.dark`·`[data-theme="dark"]`) / 라이트 고정(`[data-theme="light"]`)
- 계약 테스트 45개 (`npx nx test tokens`). 변이 테스트로 실효성 확인함.
- 소비: `@import "@sandbox/tokens/index.css";`

### 이때 내린 결정
- **스페이싱은 `--spacing: 4px` 한 줄.** 개별 열거 대신 기준값만 두어 `p-6`=24px 를 유지하면서 `p-7` 같은 표 밖 값도 살렸다.
- **CSS 전용, TS export 없음.** TS 토큰 맵은 CSS 와 어긋날 수 있는 두 번째 SSOT 라서 필요해질 때까지 두지 않는다.
- **`--container-content`** — design.md 의 "블로그 본문 720px". `max-w-prose` 는 Tailwind 내장(65ch)이라 이름이 겹쳐 `content` 로 명명했다.

### 의도적으로 미룬 것 (Phase 1에서)
- ~~**`@nx/enforce-module-boundaries` ESLint 배선**~~ — **해소됨.** 아래 "Phase 1 진행 — 검증 게이트 배선" 참고.
- ~~**`tsconfig.base.json` path 매핑**~~ — **해소됨.** `@sandbox/ui` 추가. 토큰은 여전히 CSS export 로만 소비하므로 path 매핑을 두지 않는다.
- ~~**lint 타깃**~~ — **해소됨.** `packages/tokens` / `packages/ui` 양쪽에 `lint` + `typecheck` 추가.
- ~~**lefthook 설치**~~ — **해소됨(2026-10-12).** pre-commit = affected lint/test/typecheck, pre-push = affected build.

## 구조 변경 — `libs/` → `packages/` (2026-10-20)
- 공용 패키지 폴더를 `packages/` 로 통일. Nx 에서 `libs` 는 관례일 뿐 내장 이름이 아니라서 `git mv` + 참조 치환(`package.json` workspaces, `tsconfig.base.json` paths, `project.json`, ESLint, 스킬/에이전트, 문서)으로 끝났다. lockfile 재생성, `npx nx reset` 후 lint/test/typecheck/build-storybook 전부 통과.
- 폴더 트리·depth 규칙은 `docs/structure.md` 가 SSOT. 루트 `CLAUDE.md` 가 가리킨다.
- 머지 끝난 옛 워크트리 `.claude/worktrees/sweet-jones-e2baff`(`libs/` 잔존)와 브랜치 `claude/sweet-jones-e2baff` 는 제거했다. 리포 어디에도 `libs/` 는 남아 있지 않다.

## Phase 1 결과 — packages/ui (2026-10-12)
`docs/handoff/blog-calendar/PROMPT.md` Step 1 전부. 커밋 `20f510e`(스캐폴드+Button) → `5145eec` → `31a7953` → `d861d45`.
qa-verifier 판정: **PASS** (2026-10-12) — lint/test/typecheck(tokens 122 · ui 111) · build-storybook · hex/rgb 0건 · 경계 위반 0 · §6.1~6.10 variant 전수 · a11y 테스트 확인. 미확인: 브라우저 시각 렌더(구현 세션에서 390/768/1280 × light/dark 스크린샷으로 별도 확인함).

### 한 것
- **스캐폴드**: shadcn(components.json, radix-ui 단일 패키지) + Vitest(jsdom, Testing Library) + Storybook 10(react-vite, a11y, docs, 뷰포트 390/768/1280/1440, `data-theme` 토글). Nx 타깃 `test` `storybook` `build-storybook`. `.claude/launch.json` 에 `storybook-ui`.
- **컴포넌트 22개** (`packages/ui/src/components/`): Button · Input · Textarea · Label · Badge · Card · Dialog · Sheet · ResponsiveDialog · Popover · DropdownMenu · Tooltip · Toast(sonner) · Skeleton · Avatar · Tabs · AppShell · AmbientBackground · EmptyState · ErrorState · SyncBanner (+ 내부 OverlayCloseButton). 훅 `useMediaQuery` `useDelayedVisible` `useScrolled`.
- **테스트 111개** (`npx nx test ui`), 전부 실패 테스트 먼저. 스토리는 컴포넌트마다 Light/Dark + 상태.
- **styles.css**: `@sandbox/tokens` 한 줄 import 위에 유리 유틸리티 `glass-subtle` `glass-base` `glass-base-flat` `glass-solid`(폴백 포함), `focus-ring`, `touch-target`, 모션 키프레임(`animate-bs-pop/surface/rise/sheet-*`, reduced-motion 은 투명도만), `--bs-radius-card`(12/14/16).
- **cn**: tailwind-merge 를 토큰 테마로 확장(`packages/ui/src/lib/utils.ts`). 기본 설정은 `text-label` 을 색으로 오인해 `text-accent-fg-on` 과 충돌 처리하며 **조용히 지웠다**. 토큰을 추가하면 `TOKEN_COLORS`/`TOKEN_TEXT_STYLES` 도 늘린다.
- **class-rules 테스트 헬퍼** (`src/test-utils/class-rules.ts`): `transition-all` / `hover:` / raw hex / Tailwind 기본 팔레트 / shadcn 변수 / 텍스트 알파 금지를 className 에서 강제. 모든 컴포넌트 테스트가 `expectTokenOnly` 를 호출한다.

### 이때 내린 결정
- **토큰 4개 추가** (design.md §1.2 반영): `bg/inverse`·`fg/inverse`(Tooltip·Toast 불투명 반전 표면 — 다크에서는 gray/100+gray/900 으로 뒤집음, 다크 페이지 위 gray/900 은 안 보임), `overlay/bg`(obsidian/ink 42%), `accent/fg-strong`(subtle-bg 위 작은 글자, `accent/default` 는 라이트에서 3.9:1). Avatar fallback 은 blue/100·blue/700 대신 이 semantic 쌍.
- **Badge 상태 variant 글자는 fg/default.** 상태색(amber 등)을 12px 글자로 쓰면 4.5:1 미달. 상태는 배경 틴트 12% + 테두리 40% 로만.
- **Card glass 는 compact 에서 `glass-base-flat`(blur 없음)로 자동 강등.** design.md §3.1 "compact backdrop-filter 화면당 2개(TopBar·TabBar)". 390 실측: blur 2개, 가로 스크롤 0.
- **hover 는 `hover-fine:` 커스텀 변형**(`@media (hover:hover) and (pointer:fine)`), `hover:` 금지. 브레이크포인트는 `medium:`/`expanded:`/`wide:` 만.
- **ResponsiveDialog** 가 600 기준으로 Dialog↔Sheet 를 고른다(DOM 구조가 달라 JS 분기가 불가피한 유일한 곳). 셸 내비 4종은 전부 CSS 미디어 쿼리로 렌더+숨김.
- **Toast 는 sonner `unstyled`** 로 토큰 클래스만. next-themes 안 씀(토큰이 모드를 처리).
- **shadcn CLI 는 참고용으로만.** `components.json` 의 utils alias 를 `cn` npm 패키지로 오해석해 설치하고 `import { cn } from "cn"` 을 뱉는다. 생성물을 읽고 토큰 버전으로 다시 쓴 뒤 `cn`·`next-themes` 의존성을 제거했다. 다음에 `shadcn add` 를 쓰면 **package.json 과 lockfile 을 반드시 확인**.
- **lefthook 은 작업 트리 전체를 검사한다.** 토큰 바인딩 전 shadcn 원본이 폴더에 있으면 커밋이 막힌다 → 스크래치패드에 두고 작업.

### 의도적으로 미룬 것 (Phase 2 에서)
- DropdownMenu 의 compact "하단 Action Sheet 전환"(design.md §6.5). 메뉴 항목 48h 로 두고, 필요한 화면(에디터 블록 메뉴)에서 Sheet 로 대체.
- Select · Table · Accordion (§6.5 §6.11 §6.12) — 화면 스펙에 직접 등장하지 않아 Step 2/3 의 필요 시점에 `/new-component`.
- AppShell 의 사이드바 접기(expanded "접으면 레일") — 상태 없이 Rail/Sidebar 를 뷰포트로만 가른다.
- Storybook a11y 는 `test: 'error'` 로 켜 두었으나 CI 러너(`@storybook/addon-vitest`)는 미배선. 시각 회귀 없음.
- `--container-landing` 1120 vs design.md 1200 — 랜딩 구현 시 결정.

### Phase 2 진입 조건 / 메모
- `apps/web` 세션은 `apps/web` 폴더에서 시작. 스타일은 `@import "@sandbox/ui/styles.css";` 한 줄(토큰 포함). `tsconfig.base.json` 에 `@sandbox/ui`·`@sandbox/ui/*` path 있음.
- 백엔드는 **로컬 Supabase CLI + 마이그레이션(Docker)** 로 결정(플랜 "왜 이 선택인가" — 마스킹 뷰·RLS·tsvector·RPC 가 전부 Postgres 안에 있어 mock 은 두 번째 구현이 됨; Inbucket 으로 매직 링크 E2E). `supabase/` 는 루트.
- 데이터 접근은 Route Handler 경유(브라우저가 Supabase 를 직접 치지 않음). `packages/schema`(zod) 신설.

## Phase 0.5 — 토큰 v0.2 Glass (2026-10-12)
`../../design.md` 가 v0.1(indigo 1색) → v0.2(백자/벽청/청자/자운 + 유리)로 바뀌어 `packages/tokens` 를 따라 올렸다.
픽스처 → Red(69 실패) → CSS → Green(114) 순서. Tailwind CLI 컴파일로 inline 동작·`--color-*` 누출 0 확인.

### 한 것
- `primitives.css`: gray 냉회색 교체, porcelain/obsidian/blue/celadon/violet/status/navy 추가, indigo 제거.
- `semantic.css`: `bg/page` `fg/body` `fg/link` `accent/secondary|tertiary` + glass 8 + glaze 2 (색) / `--bs-shadow-*` 6, `--bs-glaze-pool`, `--bs-orb-*`, `--bs-glass-blur-*`·saturate (비색). 세 블록 키 패리티 유지. v0.1 의 별도 shadow 블록은 3블록으로 흡수.
- `theme.css`: 타이포 v0.2(+`label`, letter-spacing), `--radius-xl`, `--ease-bs`, 브레이크포인트 `medium/expanded/wide`, `--bs-motion-*`. 색·그림자·그래디언트·blur 는 전부 `@theme inline`.
- `index.css`: Pretendard Variable + JetBrains Mono 로드, `hover-fine:` variant, `--bs-layout-*`(compact 기본 → expanded 재정의).

### 이때 내린 결정
- **design.md §1.1 에 primitive 4개 추가** — `gray/550`(#5D6679, fg/muted 라이트), `white`/`black`(알파 베이스 전용), `obsidian/panel`(#161A22). semantic 레이어 raw hex 금지 규칙을 지키기 위해 표 밖 값에 이름을 줬다. white/black 은 표면색 금지가 그대로 유효하다.
- **비색 semantic 토큰은 색 토큰과 같은 3블록에 둔다.** 모드에 따라 값이 바뀌기 때문. 대신 "var/color-mix 만" 규칙은 `--bs-color-*` 에만 걸고, 비색 토큰은 "안의 색이 primitive 를 거치는가 + hex 없음"을 검사한다.
- **토큰 레이어는 모드 축만 가진다.** glass alpha/blur·radius/card·compact 타이포 같은 브레이크포인트 축은 컴포넌트 CSS 책임. semantic 에 미디어 쿼리를 넣지 않는다. 예외는 `index.css` 의 `--bs-layout-*`(셸 치수는 레이아웃 변수라 토큰이 아닌 plain 변수로 둠).
- `--container-landing` 1120 유지(design.md §3 은 1200). Phase 0 결정값이라 이번 범위에서 바꾸지 않았다 — 랜딩 구현 시 재검토.
- `--breakpoint-*` 이름은 design.md 용어(medium/expanded/wide)를 그대로 써서 Tailwind 기본 sm/md/lg 와 혼동을 끊었다.

### 다음(Phase 1)에서 쓸 것
- Card glass base = `bg-glass-base-bg bg-glaze-pool border-glass-base-border border-b-glass-foot shadow-glass backdrop-blur-glass-md` + `supports-[not(backdrop-filter:blur(1px))]:bg-glass-fallback-bg`. 레시피는 `packages/tokens/README.md`.
- hover 는 `hover-fine:`, 모션은 `ease-bs duration-[var(--bs-motion-control)]`, `transition-all` 금지.

## Phase 1 진행 — 검증 게이트 배선 (2026-09-04)

### 배선 전에 뭐가 문제였나
`npx nx affected -t lint test typecheck` 는 **`test` 하나만 돌고 있었다.** `lint`/`typecheck` 타깃이
워크스페이스 어디에도 없어서 Nx 는 해당 타깃을 조용히 건너뛰었고, 명령은 성공을 보고했다.
`CLAUDE.md` 와 `lefthook.yml` 이 이 명령을 검증 게이트로 명시하고 있었으니 **게이트가 실제보다 강해 보이는**
상태였다. 이번에 그 간극을 메웠다.

### 한 것
- 루트 `eslint.config.mjs` (flat config) + `@nx/eslint-plugin` 22.6.5 배선.
- `@nx/enforce-module-boundaries` depConstraints — `scope:*` 격리 + `type:*` 방향(`app -> feature -> ui -> util`).
- `packages/tokens` / `packages/ui` 에 `lint`(@nx/eslint:lint) + `typecheck`(`tsc --noEmit`) 타깃.
- `nx.json` 에 `typecheck` targetDefaults (캐시 + `tsconfig.base.json` 입력).
- `tsconfig.base.json` 신설 (`@sandbox/ui` path 매핑).
- `packages/ui` **프로젝트 셸** — 경계 규칙은 프로젝트가 2개 이상이어야 검사할 게 생긴다.

### 규칙이 실제로 무는지 확인함 (통과만 보고 끝내지 않았다)
고의 위반 import 를 주입해 세 방향 모두 확인하고 되돌렸다:

| 케이스 | 기대 | 결과 |
|---|---|---|
| `tokens`(scope:shared) -> `ui`(scope:ui) | scope 위반 | ✅ `"scope:shared" can only depend on ... "scope:shared"` |
| `tokens`(type:util) -> `ui`(type:ui), scope 동일하게 맞춤 | type 역방향 위반 | ✅ `"type:util" can only depend on ... "type:util"` |
| `ui`(type:ui) -> `tokens`(type:util) | 허용 | ✅ 통과 |

즉 규칙이 **전부 막는 것도, 전부 통과시키는 것도 아니라 방향을 구분한다.**

### 이때 겪은 함정
- **`nx reset` 없이 태그를 바꾸면 옛 태그로 판정한다.** 위 2번 케이스에서 scope 를 맞췄는데도 계속
  scope 위반이 떴다. 프로젝트 그래프 캐시 때문. 태그를 만졌으면 `npx nx reset`.
- **새 workspace 를 만들면 `npm install` 을 다시 돌려야 Nx 가 인식한다.** `packages/ui/package.json` 을 만든
  직후 `nx run ui:lint` 가 `Could not find project "ui"` 로 죽었다.
- **`@types/node` 가 없었다.** `packages/tokens/tsconfig.json` 이 `types: ["node"]` 를 선언해 뒀지만 패키지가
  없어서 `typecheck` 를 켜자마자 TS2688 로 터졌다. 원래 있던 구멍이 lint/typecheck 배선으로 드러난 것.
- **`@nx/eslint` 는 있었지만 `eslint` 본체와 `@nx/eslint-plugin` 은 없었다.** ESLint 10.9.1 이 transitive 로만
  들어와 있었다. 셋 다 명시적 devDependency 로 고정했다.

### 버전 고정 주의
`@nx/eslint`, `@nx/eslint-plugin` 은 **nx core 와 같은 22.6.5 로 핀했다.** `latest`(23.x)로 올리면
core 22.6.5 와 불일치한다. nx 를 올릴 때 셋을 같이 올린다.

### 알려진 사각지대 (QA 지적 — 지금은 무해하지만 나중에 문다)
- **`@sandbox/tokens` 에 path 매핑이 없다.** 토큰은 CSS 로만 소비하므로 의도적이다. 다만
  여기에 TS export 를 추가하면서 `tsconfig.base.json` 매핑을 안 넣으면 Nx 가 의존 엣지를 못 만들어
  경계 규칙이 **에러 없이 무검사로 통과**한다. `packages/tokens/CLAUDE.md` 에 경고를 박아뒀다.
- **`packages/tokens/src/` 는 typecheck 대상이 아니다** (`tsconfig.json` 의 `include` 가 `tests/` + `vite.config.ts`).
  현재 `src/` 는 CSS 전용이라 무해. `src/*.ts` 를 만들면 `include` 를 같이 넓혀야 한다.
- **루트 파일은 어느 nx 프로젝트에도 속하지 않는다.** `eslint.config.mjs` 같은 파일은
  `npx nx run-many -t lint` 이 커버하지 못한다. `npm run lint:root` 로 따로 돈다.

### 남은 것
- `packages/ui` 는 지금 **빈 셸**이다 (`src/index.ts` 가 `export {}`). shadcn init / Button·Input·Card·Tag /
  Storybook 은 Phase 1 본 작업으로 `/new-component` 스킬 절차를 따라 진행한다.
- `packages/ui` 에는 아직 `test` 타깃이 없다 (테스트할 컴포넌트가 없다). 첫 컴포넌트와 함께 추가.

## 다음 단계 (sandbox-roadmap.md)
- **Phase 1**: `packages/ui` — shadcn init(모노레포) + Button/Input/Card/Tag(`../../design.md` §5) + Storybook → `/new-component` 스킬 사용
- **Phase 2**: `apps/web` — Next 16 App Router 랜딩+블로그(MDX) + Vitest/Playwright + Vercel 도메인
- **Phase 3**: CI/CD — GitHub Actions nx affected 3단 게이트 + @claude
- **Phase 4**: Multi-Zones 2번째 모듈(`apps/console`)
- **Phase 5**: Python/AI 도메인 TDD

## 규율 (요약 — 상세 CLAUDE.md)
- explore→plan→code→commit, 패키지 스코프 세션, 항상 `nx affected`
- 새 컴포넌트는 `/new-component`, 완료 판정은 `qa-verifier` 서브에이전트
- 색/간격/radius/shadow **하드코딩 금지** → `packages/tokens` 토큰만
- 커밋 컨벤션: Conventional Commits (`feat:`/`fix:`/`chore:`/`docs:`/`test:`)

## 미결정
- **패키지 매니저**: 현재 npm. pnpm 으로 갈 거면 lock 교체 + `CLAUDE.md`/`lefthook.yml`/스킬의 `npx`→`pnpm` 일괄 수정.

## 참고
- claude.ai 프로젝트 "Buddle SandBox 개발"에 `claude-code-playbook.md`, `figma-build-state.md` 있음.
