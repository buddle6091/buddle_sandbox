# SandBox — 상태 원장

> 세션 시작 시 이 파일 + `CLAUDE.md` 를 먼저 읽는다.
> 계획 전체는 `sandbox-roadmap.md`, 토큰 스펙은 `../../design.md`.

## 현재 상태 (2026-10-12)
- Nx 22.6.5 모노레포(**npm** workspaces), 브랜치 `master`, 리모트 `github.com/buddle6091/buddle_sandbox`
- **origin/master push 완료** (`f0505cc`). 이관 시점의 미push 상태는 해소됨.
- **Phase 0 완료** — `libs/tokens` (아래 참고)
- **Phase 0.5 완료** — 토큰 v0.2 (Glass). `design.md` v0.2 와 코드 일치.
- **lefthook 켜짐** — 커밋 시 affected lint/test/typecheck 가 실제로 돈다.
- 핸드오프 번들 `docs/handoff/blog-calendar/` (README → SCREENS → STATES → DATA → PROMPT). 다음 작업의 스펙.

### 완료된 Phase
| Phase | 상태 | 산출물 |
|---|---|---|
| 0 기반 | **완료** | `libs/tokens`, npm workspaces, nx targetDefaults, 경계 태그 |
| 0.5 토큰 v0.2 | **완료** | glass/glaze/shadow/orb 토큰, 타이포 v0.2, 모션·레이아웃 변수, 계약 테스트 114개 |
| 1 디자인시스템 | **진행 중** | ✅ ESLint/경계 규칙/lint·typecheck 게이트 · ⬜ `libs/ui` shadcn + Button/Input/Card/Tag + Storybook |

## ⚠ 환경 — Node 24 필수
`.nvmrc` = `24`. 세션 시작 시:
```bash
nvm use
```
**v20.16.0 에서는 동작하지 않는다.** vitest 4 가 끌어오는 vite 8 이 `node ^20.19.0 || >=22.12.0` 을 요구한다. 낮은 버전에서는
- npm arborist 가 크래시하고 (`Cannot read properties of null (reading 'edgesOut')`)
- rolldown 네이티브 바인딩이 조용히 skip 돼 테스트가 아예 실행되지 않는다.

`--legacy-peer-deps` 로 우회하려던 흔적이 보이면 그건 잘못된 처방이다. Node 버전을 올리면 플래그 없이 깨끗이 설치된다. CLAUDE.md 의 "Node 20.9+" 하한도 이 조합에서는 실질 20.19+ 다.

## Phase 0 결과 — libs/tokens
`../../design.md` → 실행 가능한 CSS. 자세한 사용법은 `libs/tokens/README.md`.

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
- ~~**lint 타깃**~~ — **해소됨.** `libs/tokens` / `libs/ui` 양쪽에 `lint` + `typecheck` 추가.
- ~~**lefthook 설치**~~ — **해소됨(2026-10-12).** pre-commit = affected lint/test/typecheck, pre-push = affected build.

## Phase 0.5 — 토큰 v0.2 Glass (2026-10-12)
`../../design.md` 가 v0.1(indigo 1색) → v0.2(백자/벽청/청자/자운 + 유리)로 바뀌어 `libs/tokens` 를 따라 올렸다.
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
- Card glass base = `bg-glass-base-bg bg-glaze-pool border-glass-base-border border-b-glass-foot shadow-glass backdrop-blur-glass-md` + `supports-[not(backdrop-filter:blur(1px))]:bg-glass-fallback-bg`. 레시피는 `libs/tokens/README.md`.
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
- `libs/tokens` / `libs/ui` 에 `lint`(@nx/eslint:lint) + `typecheck`(`tsc --noEmit`) 타깃.
- `nx.json` 에 `typecheck` targetDefaults (캐시 + `tsconfig.base.json` 입력).
- `tsconfig.base.json` 신설 (`@sandbox/ui` path 매핑).
- `libs/ui` **프로젝트 셸** — 경계 규칙은 프로젝트가 2개 이상이어야 검사할 게 생긴다.

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
- **새 workspace 를 만들면 `npm install` 을 다시 돌려야 Nx 가 인식한다.** `libs/ui/package.json` 을 만든
  직후 `nx run ui:lint` 가 `Could not find project "ui"` 로 죽었다.
- **`@types/node` 가 없었다.** `libs/tokens/tsconfig.json` 이 `types: ["node"]` 를 선언해 뒀지만 패키지가
  없어서 `typecheck` 를 켜자마자 TS2688 로 터졌다. 원래 있던 구멍이 lint/typecheck 배선으로 드러난 것.
- **`@nx/eslint` 는 있었지만 `eslint` 본체와 `@nx/eslint-plugin` 은 없었다.** ESLint 10.9.1 이 transitive 로만
  들어와 있었다. 셋 다 명시적 devDependency 로 고정했다.

### 버전 고정 주의
`@nx/eslint`, `@nx/eslint-plugin` 은 **nx core 와 같은 22.6.5 로 핀했다.** `latest`(23.x)로 올리면
core 22.6.5 와 불일치한다. nx 를 올릴 때 셋을 같이 올린다.

### 알려진 사각지대 (QA 지적 — 지금은 무해하지만 나중에 문다)
- **`@sandbox/tokens` 에 path 매핑이 없다.** 토큰은 CSS 로만 소비하므로 의도적이다. 다만
  여기에 TS export 를 추가하면서 `tsconfig.base.json` 매핑을 안 넣으면 Nx 가 의존 엣지를 못 만들어
  경계 규칙이 **에러 없이 무검사로 통과**한다. `libs/tokens/CLAUDE.md` 에 경고를 박아뒀다.
- **`libs/tokens/src/` 는 typecheck 대상이 아니다** (`tsconfig.json` 의 `include` 가 `tests/` + `vite.config.ts`).
  현재 `src/` 는 CSS 전용이라 무해. `src/*.ts` 를 만들면 `include` 를 같이 넓혀야 한다.
- **루트 파일은 어느 nx 프로젝트에도 속하지 않는다.** `eslint.config.mjs` 같은 파일은
  `npx nx run-many -t lint` 이 커버하지 못한다. `npm run lint:root` 로 따로 돈다.

### 남은 것
- `libs/ui` 는 지금 **빈 셸**이다 (`src/index.ts` 가 `export {}`). shadcn init / Button·Input·Card·Tag /
  Storybook 은 Phase 1 본 작업으로 `/new-component` 스킬 절차를 따라 진행한다.
- `libs/ui` 에는 아직 `test` 타깃이 없다 (테스트할 컴포넌트가 없다). 첫 컴포넌트와 함께 추가.

## 다음 단계 (sandbox-roadmap.md)
- **Phase 1**: `libs/ui` — shadcn init(모노레포) + Button/Input/Card/Tag(`../../design.md` §5) + Storybook → `/new-component` 스킬 사용
- **Phase 2**: `apps/web` — Next 16 App Router 랜딩+블로그(MDX) + Vitest/Playwright + Vercel 도메인
- **Phase 3**: CI/CD — GitHub Actions nx affected 3단 게이트 + @claude
- **Phase 4**: Multi-Zones 2번째 모듈(`apps/console`)
- **Phase 5**: Python/AI 도메인 TDD

## 규율 (요약 — 상세 CLAUDE.md)
- explore→plan→code→commit, 패키지 스코프 세션, 항상 `nx affected`
- 새 컴포넌트는 `/new-component`, 완료 판정은 `qa-verifier` 서브에이전트
- 색/간격/radius/shadow **하드코딩 금지** → `libs/tokens` 토큰만
- 커밋 컨벤션: Conventional Commits (`feat:`/`fix:`/`chore:`/`docs:`/`test:`)

## 미결정
- **패키지 매니저**: 현재 npm. pnpm 으로 갈 거면 lock 교체 + `CLAUDE.md`/`lefthook.yml`/스킬의 `npx`→`pnpm` 일괄 수정.

## 참고
- claude.ai 프로젝트 "Buddle SandBox 개발"에 `claude-code-playbook.md`, `figma-build-state.md` 있음.
