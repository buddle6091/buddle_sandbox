# Buddle SandBox — Claude Code 프로젝트 가이드 (루트)

> 이 파일은 모든 Claude Code 세션이 자동으로 읽는 루트 규칙이다.
> 상세 배경은 Claude 프로젝트 문서(`sandbox-roadmap.md`, `design.md`, `claude-code-playbook.md`) 참고.

## 프로젝트 개요
- Nx 모노레포. 포트폴리오 랜딩 + 개발 블로그로 시작해 SandBox에서 도메인을 확장한다.
- 프론트엔드(React/TS) 기반, 이후 Python으로 AI/백엔드 도메인 확장 예정.

## 스택 (확정)
- 모노레포: **Nx** (현재 **npm** workspaces / package-lock.json)
- 웹: **Next.js 16** (App Router, Turbopack 기본). Cache Components(`"use cache"`)는 필요할 때만 opt-in.
- UI: **shadcn/ui 기반** → `libs/ui` 공용 컴포넌트. **Tailwind v4 + CSS 변수** 토큰.
- 토큰: `design.md`(Primitive→Semantic Light/Dark) → `libs/tokens`(`--bs-color-*` CSS 변수 + Tailwind `@theme`)
- 테스트: **Vitest + Testing Library**, **Playwright**(E2E 최소), **Storybook**
- 배포: **Vercel + 커스텀 도메인**. 2번째 모듈은 **Next.js Multi-Zones**로 같은 도메인 분리 배포.
- 최소 버전: **Node 20.19+** (`.nvmrc`=24 — vitest 4/vite 8 요구. 20.16 에서는 설치·테스트가 깨진다), **TypeScript 5.1+**

## 타겟 구조
```
apps/
  web/            # 메인 zone: 랜딩 + 블로그. (추후) 도메인 라우터 역할
libs/
  ui/             # shadcn 기반 공용 컴포넌트 (@sandbox/ui)
  tokens/         # design.md 토큰 → CSS 변수 + Tailwind theme (SSOT)
  schema/         # 프론트/백 공용 스키마 (zod)
  utils/
tools/            # Nx generators, 스크립트
```

## 명령 (항상 affected 우선)
> 세션 시작 시 `nvm use` (Node 24). 아래는 그 다음.

- 개발:      `npx nx dev web`
- 검증:      `npx nx affected -t lint test typecheck`
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

## 패키지 경계 (`@nx/enforce-module-boundaries`)
- 태그: `scope:web|ui|shared`, `type:app|feature|ui|util`
- 의존 방향: `app -> feature -> ui -> util` (역방향 금지). `libs/ui`는 앱을 참조할 수 없다.

## 디자인 시스템 규칙 (중요)
- 색/간격/타이포/radius/shadow는 **절대 하드코딩 금지.** 반드시 `libs/tokens` 변수 / Tailwind theme을 쓴다.
- `libs/tokens` 는 구현 완료(Phase 0). 사용법·주의사항은 `libs/tokens/README.md` 참고.
  소비는 `@import "@sandbox/tokens/index.css";` 한 줄이면 된다.
- 새 컴포넌트는 반드시 **`/new-component` 스킬 절차**를 따른다.

## TDD 규율
- 새 로직/컴포넌트: **실패 테스트 먼저, 구현은 그 다음** (Red -> Green -> Refactor).
- 구현을 "완료"로 인증하는 것은 **구현한 세션이 아니라 `qa-verifier` 서브에이전트**다(independent evaluator).
- 커밋 전 `lefthook`이 `nx affected` lint/test/typecheck를 강제한다.

## 하위 CLAUDE.md
패키지별 세부 규칙은 `libs/ui/CLAUDE.md`, `apps/web/CLAUDE.md` 등에 따로 둔다(스캐폴드 시 생성).
