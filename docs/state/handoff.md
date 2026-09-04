# SandBox — 상태 원장

> 세션 시작 시 이 파일 + `CLAUDE.md` 를 먼저 읽는다.
> 계획 전체는 `sandbox-roadmap.md`, 토큰 스펙은 `design.md`.

## 현재 상태 (2026-09-04)
- Nx 22.6.5 모노레포(**npm** workspaces), 브랜치 `master`, 리모트 `github.com/buddle6091/buddle_sandbox`
- **origin/master push 완료** (`f0505cc`). 이관 시점의 미push 상태는 해소됨.
- **Phase 0 완료** — `libs/tokens` (아래 참고)

### 완료된 Phase
| Phase | 상태 | 산출물 |
|---|---|---|
| 0 기반 | **완료** | `libs/tokens`, npm workspaces, nx targetDefaults, 경계 태그 |
| 1 디자인시스템 | 다음 | `libs/ui` shadcn + Button/Input/Card/Tag + Storybook |

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
`design.md` → 실행 가능한 CSS. 자세한 사용법은 `libs/tokens/README.md`.

- 3단 구조: `primitives.css`(원시 20종) → `semantic.css`(의미 15종 + shadow) → `theme.css`(Tailwind 매핑)
- 다크모드 3갈래: 시스템(`prefers-color-scheme`) / 명시(`.dark`·`[data-theme="dark"]`) / 라이트 고정(`[data-theme="light"]`)
- 계약 테스트 45개 (`npx nx test tokens`). 변이 테스트로 실효성 확인함.
- 소비: `@import "@sandbox/tokens/index.css";`

### 이때 내린 결정
- **스페이싱은 `--spacing: 4px` 한 줄.** 개별 열거 대신 기준값만 두어 `p-6`=24px 를 유지하면서 `p-7` 같은 표 밖 값도 살렸다.
- **CSS 전용, TS export 없음.** TS 토큰 맵은 CSS 와 어긋날 수 있는 두 번째 SSOT 라서 필요해질 때까지 두지 않는다.
- **`--container-content`** — design.md 의 "블로그 본문 720px". `max-w-prose` 는 Tailwind 내장(65ch)이라 이름이 겹쳐 `content` 로 명명했다.

### 의도적으로 미룬 것 (Phase 1에서)
- **`@nx/enforce-module-boundaries` ESLint 배선** — `project.json` 에 `tags`(`scope:shared`, `type:util`)는 넣었지만 규칙 자체는 미배선. 프로젝트가 1개라 검사할 교차 import 가 없다. `libs/ui` 가 생기면 그때 `eslint.config.mjs` 에 depConstraints 를 건다.
- **`tsconfig.base.json` path 매핑** — 토큰은 CSS export 로 소비돼 TS import 이 없다. `libs/ui` 가 `@sandbox/ui` 로 필요해질 때 추가.
- **lint 타깃** — `libs/tokens` 에 아직 없다. ESLint 를 세팅하는 Phase 1 에 함께.
- **lefthook 설치** — `npm i -D lefthook && npx lefthook install`. Phase 1 에서 켜는 걸 권장. 지금은 커밋 전 수동으로 `npx nx affected -t lint test typecheck`.

## 다음 단계 (sandbox-roadmap.md)
- **Phase 1**: `libs/ui` — shadcn init(모노레포) + Button/Input/Card/Tag(`design.md` §5) + Storybook → `/new-component` 스킬 사용
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
