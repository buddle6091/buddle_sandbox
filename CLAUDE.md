# Buddle SandBox — Claude Code 프로젝트 가이드 (루트)

> 이 파일은 모든 Claude Code 세션이 자동으로 읽는 루트 규칙이다.
> 상세 배경은 Claude 프로젝트 문서(`sandbox-roadmap.md`, `design.md`, `claude-code-playbook.md`) 참고.

## 프로젝트 개요
- Nx 모노레포. 포트폴리오 랜딩 + 개발 블로그로 시작해 SandBox에서 도메인을 확장한다.
- 프론트엔드(React/TS) 기반, 이후 Python으로 AI/백엔드 도메인 확장 예정.

## 스택 (확정)
- 모노레포: **Nx** (현재 **npm** workspaces / package-lock.json)
- 웹: **Next.js 16** (App Router, Turbopack 기본). Cache Components(`"use cache"`)는 필요할 때만 opt-in.
- UI: **shadcn/ui 기반** → `packages/ui` 공용 컴포넌트. **Tailwind v4 + CSS 변수** 토큰.
- 토큰: `design.md`(Primitive→Semantic Light/Dark) → `packages/tokens`(`--bs-color-*` CSS 변수 + Tailwind `@theme`)
- 테스트: **Vitest + Testing Library**, **Playwright**(E2E 최소), **Storybook**
- 배포: **Vercel + 커스텀 도메인** (→ **재검토 중**: AWS SST+OpenNext 또는 Cloudflare Workers. 제안·비교는 `docs/architecture.md`, 사용자 결정 대기). 2번째 모듈은 **Next.js Multi-Zones**로 같은 도메인 분리 배포.
- 최소 버전: **Node 20.19+** (`.nvmrc`=24 — vitest 4/vite 8 요구. 20.16 에서는 설치·테스트가 깨진다), **TypeScript 5.1+**

## 라우트 (apps/web, 메인 zone)
| 경로 | 내용 |
|---|---|
| `/` | **랜딩 v2** — 도메인 루트로 접속하면 바로 보이는 페이지. 스펙 `docs/handoff/landing-v2/` (2026-11-01 적용) |
| `/blog` | 개발 블로그 → `docs/handoff/blog-calendar/` |
| `/calendar` | 비공개 캘린더 → `docs/handoff/blog-calendar/` |

- 랜딩 작업과 블로그·캘린더 작업은 **핸드오프 번들과 상태 원장 섹션을 따로** 쓴다. 한 세션에서 섞지 않는다.

## 폴더 구조
> 전체 트리·depth 규칙은 **`docs/structure.md`** 가 SSOT. 새 폴더/패키지를 만들면 그 문서를 갱신한다.
> 공용 패키지 폴더 이름은 **`packages/`** (Nx 관례의 `libs/` 를 쓰지 않는다 — 2026-10-20 결정).

### 타겟 구조
```
apps/
  web/            # 메인 zone: 랜딩 + 블로그. (추후) 도메인 라우터 역할
packages/
  ui/             # shadcn 기반 공용 컴포넌트 (@sandbox/ui)
  tokens/         # design.md 토큰 → CSS 변수 + Tailwind theme (SSOT)
  schema/         # 프론트/백 공용 스키마 (zod)
  utils/
tools/            # Nx generators, 스크립트
```

## 명령 (항상 affected 우선)
> 세션 시작 시 `nvm use` (Node 24). 아래는 그 다음.

- 개발:      `npx nx dev web`
- 검증:      `npx nx affected -t lint test typecheck`  (3개 타깃 모두 실배선됨)
- 빌드:      `npx nx affected -t build`
- 토큰 검증: `npx nx test tokens`
- Storybook: `npx nx storybook ui`
- E2E:       `npx nx e2e web-e2e`

## 작업 규율
1. **explore -> plan -> code -> commit.** 큰 작업은 Plan Mode로 계획부터 뽑고 승인 후 실행.
2. 세션은 **작업 대상 패키지 폴더에서 시작**한다(컨텍스트 오염 방지). 루트에서 전방위로 헤집지 않는다.
3. 검증은 항상 **`nx affected`**로 변경분만.
4. 결정/상태는 이 파일 또는 `docs/state/<domain>.md` 상태 원장에 flush한다.
5. 커밋 메시지는 **Conventional Commits** (`feat:` `fix:` `chore:` `docs:` `test:` `refactor:`).
   제목은 영문 소문자 한 줄, 본문은 한글 불릿으로 "왜"를 남긴다.
6. **QA 이력을 남긴다.** PR/푸시 묶음마다 `docs/state/qa-log.md` 에 한 절을 추가한다 —
   qa-verifier 지적, 개발 중 발견한 버그(증상→원인→조치), 컨벤션 위반, 재현 안 되는 간헐 이슈, 미룬 결함.
   PR 본문에도 같은 내용을 "QA · 알려진 이슈" 섹션으로 넣는다. 유지보수·에러 핸들링 히스토리의 SSOT 다.

## 패키지 경계 (`@nx/enforce-module-boundaries`)
**배선 완료.** 루트 `eslint.config.mjs` 의 `depConstraints` 가 강제한다.

- 태그: `scope:web|ui|shared`, `type:app|feature|ui|util`
- 의존 방향: `app -> feature -> ui -> util` (역방향 금지). `packages/ui`는 앱을 참조할 수 없다.
- **새 프로젝트에는 `project.json` 에 `tags` 를 반드시 넣는다.** 태그가 없으면
  이 규칙은 그 프로젝트에 대해 아무것도 잡지 못한다 (조용히 통과한다).
- 규칙이 실제로 무는지 확인하려면 위반 import 를 잠깐 넣고 `npx nx run <proj>:lint` 를 돌려본다.
  scope 위반과 type 위반은 각각 다른 메시지로 나온다.
- 태그를 바꾼 뒤 lint 결과가 이상하면 프로젝트 그래프가 캐시된 것이다 -> `npx nx reset`.

## 디자인 시스템 규칙 (중요)
- 색/간격/타이포/radius/shadow는 **절대 하드코딩 금지.** 반드시 `packages/tokens` 변수 / Tailwind theme을 쓴다.
- `packages/tokens` 는 구현 완료(Phase 0). 사용법·주의사항은 `packages/tokens/README.md` 참고.
  소비는 `@import "@sandbox/tokens/index.css";` 한 줄이면 된다.
- 새 컴포넌트는 반드시 **`/new-component` 스킬 절차**를 따른다.

## TDD 규율
- 새 로직/컴포넌트: **실패 테스트 먼저, 구현은 그 다음** (Red -> Green -> Refactor).
- 구현을 "완료"로 인증하는 것은 **구현한 세션이 아니라 `qa-verifier` 서브에이전트**다(independent evaluator).
- 커밋 전 `lefthook`이 `nx affected` lint/test/typecheck를 강제한다.

## 하위 CLAUDE.md
패키지별 세부 규칙은 `packages/ui/CLAUDE.md`, `apps/web/CLAUDE.md` 등에 따로 둔다(스캐폴드 시 생성).
