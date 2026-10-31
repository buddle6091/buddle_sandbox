# Buddle SandBox — 엔드투엔드 개발 로드맵 (AI 활용) v0.1

> Claude Design → Figma → Nx 공용 UI 라이브러리로 이어지는 디자인 시스템 파이프라인부터
> 아키텍처 · 빌딩 · 개발 · TDD(QA) · CI/CD 까지, Claude Code를 각 단계에 엮은 전 과정 가이드.
> 동반: `design.md`(토큰), `CLAUDE.md`(규칙), `docs/state/handoff.md`(현재 상태).
> (claude-code-playbook.md, figma-build-state.md 는 claude.ai 프로젝트 문서)

## 확정된 스택
| 영역 | 결정 |
|---|---|
| 모노레포 | Nx + (현재) npm workspaces |
| UI | shadcn/ui 기반 → packages/ui 공용 컴포넌트, Tailwind v4 + CSS 변수(design.md 토큰) |
| 웹 | Next.js 16 App Router |
| 배포 | Vercel 우선 + Next.js Multi-Zones("같은 도메인·모듈별 독립 배포"), 추후 AWS CloudFront 엣지 이관 경로 |
| QA | Vitest + Testing Library + Playwright(최소) + Storybook |

## 0. 타겟 모노레포 구조
```
apps/web            # 메인 zone: 랜딩 + 블로그. (추후) 도메인 라우터
apps/console        # (추후) CSR 웹서비스 = 별도 zone (assetPrefix)
packages/ui             # shadcn 기반 공용 컴포넌트 (@sandbox/ui)
packages/tokens         # design.md 토큰 → CSS 변수 + Tailwind theme (SSOT)
packages/schema         # 프론트/백 공용 스키마 (zod)
packages/utils
tools/              # Nx generators
```
경계: @nx/enforce-module-boundaries (tags scope/type, app→feature→ui→util).

## 1. 디자인 시스템 파이프라인 (Claude Design → 코드)
1. 토큰 SSOT: design.md → packages/tokens (--bs-color-* CSS 변수 + Tailwind v4 @theme). Figma 변수명과 1:1.
2. shadcn 초기화: 모노레포 모드, components.json(baseColor/style/iconLibrary 동일). Tailwind v4는 tailwind.config 비움.
3. 공용화: shadcn add → packages/ui/components → 하드코딩 색 제거 후 토큰 바인딩 → 앱은 @sandbox/ui 소비.
4. Storybook: packages/ui 스토리 + a11y → 살아있는 카탈로그 = 컴포넌트 QA 표면.
5. AI: "새 컴포넌트" 스킬(/new-component), Figma MCP Code Connect로 디자인↔코드 매핑.

## 2. 아키텍처 & 빌딩
- CLAUDE.md 계층(루트 + packages/apps별). Nx generators로 일관 스캐폴딩. 상태 원장 docs/state/<domain>.md.

## 3. 개발 워크플로우 (AI)
- explore→plan→code→commit, 패키지 스코프 세션, worktree 병렬, nx affected, 반복작업 스킬화.

## 4. TDD / QA (실용형 + Storybook)
| 레이어 | 도구 | 대상 |
|---|---|---|
| 유닛/로직 | Vitest | packages/* 로직·유틸·스키마 |
| 컴포넌트 | Vitest + Testing Library | packages/ui |
| 카탈로그 | Storybook (a11y/interaction) | 디자인 시스템 |
| E2E | Playwright(최소 1~2) | apps/web 핵심 경로 |
- Red→Green→Refactor("실패 테스트 먼저"). 구현/검증 세션 분리(qa-verifier). 커밋 전 lefthook.

## 5. CI/CD
- GitHub Actions + nx affected(+Nx Cloud). 3단 게이트: lint/typecheck → unit/component → build+E2E.
- Claude Code GitHub Action(@claude PR).
- 배포: 지금 apps/web → Vercel + 커스텀 도메인. 확장 시 apps/console(CSR)을 Multi-Zones(assetPrefix+rewrites)로 같은 도메인 마운트. 필요 시 CloudFront 엣지로 zone별 오리진 분기(AWS 이관 저비용).

## 6. 90일 타임라인
| Phase | 기간 | 산출물 |
|---|---|---|
| 0 기반 | 주1 | Nx 스캐폴드, CLAUDE.md 계층, packages/tokens, 경계 규칙 |
| 1 디자인시스템 | 주2–3 | packages/ui shadcn + Button/Input/Card/Tag + Storybook |
| 2 웹 | 주3–4 | apps/web 랜딩+블로그(MDX) + Vitest/Playwright + Vercel 도메인 |
| 3 CI/CD | 주5–6 | Actions 3단 게이트 + nx affected(+Nx Cloud) + @claude |
| 4 멀티존 | 주7–9 | apps/console 2번째 zone → Multi-Zones |
| 5 AI 백엔드 | 주10–12 | Python/AI 도메인 처음부터 TDD, packages/schema 공유 |

## 참고 (출처)
- shadcn/ui Monorepo, Next.js Multi-Zones, LOW/CODE Claude Code Monorepo, Anthropic Claude Code Best Practices, claude-code-ultimate-guide TDD, CloudFront 다중 오리진.
