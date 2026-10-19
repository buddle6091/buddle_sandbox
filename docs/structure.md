# 폴더 구조 설명서 (SSOT)

> 모든 세션·문서·스킬은 이 파일의 이름을 따른다. 폴더를 새로 만들면 여기부터 고친다.
> 공용 패키지 폴더는 **`packages/`** 다. Nx 문서의 `libs/` 는 관례일 뿐 내장 이름이 아니며, 이 리포는 쓰지 않는다 (2026-10-20 결정).

## Depth 규칙

| depth | 무엇이 오는가 | 예 |
|---|---|---|
| 0 루트 | 모노레포 설정 + 규칙 문서만. 소스 코드 없음 | `nx.json` `package.json` `tsconfig.base.json` `eslint.config.mjs` `lefthook.yml` `CLAUDE.md` `design.md` |
| 1 | 세 종류의 폴더만: `apps/`(배포 단위) · `packages/`(공용 패키지) · `docs/`(문서) · `tools/`(Nx generator, 추후) · `.claude/`(에이전트 설정) | |
| 2 | **Nx 프로젝트 1개 = 폴더 1개.** `project.json` + `package.json` + `CLAUDE.md` 가 있어야 한다 | `packages/ui` `packages/tokens` `apps/web`(추후) |
| 3 | 프로젝트 내부 표준 구역: `src/` `tests/` `.storybook/` | |
| 4+ | `src/` 아래 역할별 폴더. 파일명은 kebab-case | `src/components/button.tsx` |

- **한 프로젝트 안에서 depth 5 를 넘기지 않는다** (`packages/ui/src/components/button.tsx` = 4). 더 깊어지면 패키지를 쪼갠다.
- 테스트·스토리는 구현 파일 옆에 둔다: `button.tsx` `button.test.tsx` `button.stories.tsx`. 공용 테스트 설정만 `tests/`.
- 패키지 이름(npm)은 `@sandbox/<폴더명>`. import 는 `@sandbox/ui`, `@sandbox/ui/components/button`, CSS 는 `@sandbox/tokens/index.css`.
- 경계 태그(`project.json` `tags`)는 필수: `scope:web|ui|shared` + `type:app|feature|ui|util`. 없으면 ESLint 경계 규칙이 조용히 통과한다.

## 현재 트리 (2026-10-20, depth 4까지)

```
buddle_sandbox/
├─ CLAUDE.md                     루트 규칙 (모든 세션이 읽음)
├─ design.md                     디자인 시스템 v0.2 스펙 (토큰 SSOT 문서)
├─ sandbox-roadmap.md            Phase 0~5 로드맵
├─ nx.json · package.json · package-lock.json · tsconfig.base.json
├─ eslint.config.mjs             @nx/enforce-module-boundaries (scope/type)
├─ lefthook.yml                  pre-commit: affected lint/test/typecheck · pre-push: build
├─ .nvmrc                        24
│
├─ .claude/
│  ├─ agents/qa-verifier.md      독립 검증자 (완료 판정 주체)
│  ├─ skills/new-component/SKILL.md   /new-component 절차
│  ├─ launch.json                storybook-ui (브라우저 프리뷰)
│  └─ settings.local.json
│
├─ docs/
│  ├─ structure.md               ← 이 문서
│  ├─ state/handoff.md           상태 원장 (Phase 결과·결정·미룬 것)
│  └─ handoff/blog-calendar/     Claude Design 핸드오프 번들
│     ├─ README.md → SCREENS.md → STATES.md → DATA.md → PROMPT.md
│     └─ wireframes/             Wireframes.dc.html (참고용, 코드 복사 금지)
│
├─ packages/                     공용 패키지 (@sandbox/*)
│  ├─ tokens/                    @sandbox/tokens — design.md → CSS 변수 + Tailwind @theme (scope:shared type:util)
│  │  ├─ CLAUDE.md · README.md · project.json · package.json · tsconfig.json · vite.config.ts
│  │  ├─ src/
│  │  │  ├─ index.css            진입점: 폰트 → tailwind → variant → 3 레이어 → 레이아웃 변수
│  │  │  ├─ primitives.css       원시 팔레트 (유일하게 hex 를 가짐)
│  │  │  ├─ semantic.css         의미 토큰, 라이트/다크 3블록 (키 패리티)
│  │  │  └─ theme.css            Tailwind @theme inline / @theme
│  │  └─ tests/
│  │     ├─ fixtures/expected-tokens.ts   design.md 표의 기대값 (계약 기준)
│  │     └─ tokens.contract.test.ts       계약 테스트 122개
│  │
│  └─ ui/                        @sandbox/ui — shadcn 기반 공용 컴포넌트 (scope:ui type:ui)
│     ├─ CLAUDE.md · components.json · project.json · package.json · tsconfig.json · vite.config.ts
│     ├─ .storybook/main.ts · preview.tsx    Storybook 10 (테마 토글, 뷰포트 390/768/1280/1440)
│     ├─ src/
│     │  ├─ index.ts             배럴 export
│     │  ├─ styles.css           토큰 import + glass 유틸리티 + 모션 키프레임 (앱은 이 한 줄만 import)
│     │  ├─ components/          *.tsx · *.test.tsx · *.stories.tsx 나란히 (22개 컴포넌트)
│     │  ├─ hooks/               use-media-query · use-delayed-visible · use-scrolled
│     │  ├─ lib/utils.ts         cn (tailwind-merge 토큰 테마 확장)
│     │  ├─ stories/matrix.tsx   스토리 공용 헬퍼
│     │  └─ test-utils/class-rules.ts   className 규칙 강제 (transition-all·hover:·hex 금지)
│     └─ tests/setup.ts          jsdom 폴리필
│
└─ apps/                         (Phase 2 에서 생성) web — Next.js 16, scope:web type:app
```

## 앞으로 생길 폴더 (예약)

| 경로 | 역할 | 태그 |
|---|---|---|
| `apps/web/` | 블로그 + 비공개 캘린더 zone. `app/` 라우트, `lib/supabase/`, `template.tsx` | `scope:web` `type:app` |
| `apps/web-e2e/` | Playwright | `scope:web` `type:app` |
| `packages/schema/` | zod 스키마 (프론트/서버 공유) | `scope:shared` `type:util` |
| `packages/utils/` | 순수 유틸 | `scope:shared` `type:util` |
| `supabase/` | 루트. `migrations/*.sql` `seed.sql` `config.toml` — 로컬 Supabase CLI | (Nx 프로젝트 아님) |
| `tools/` | Nx generators, 스크립트 | — |

## 추적하지 않는 것

`node_modules/` `.nx/` `dist/`(Storybook 산출물 `dist/storybook/ui`) `.idea/` `docs/*.zip`(추출본이 `docs/handoff/` 에 있음)
