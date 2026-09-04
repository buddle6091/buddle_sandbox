# SandBox — 작업 이관 (Claude Code로 계속하기)

> Cowork 세션에서 진행한 내용을 로컬 Claude Code(CLI)로 이관하기 위한 상태/지시 문서.
> **시작 시 이 파일 + `CLAUDE.md`를 먼저 읽어라.** 계획 전체는 `sandbox-roadmap.md`, 토큰은 `design.md`.

## 현재 상태 (2026-09-04)
- Nx 모노레포(**npm**), 브랜치 `master`, 리모트 `github.com/buddle6091/buddle_sandbox`
- 적용/커밋 완료 (커밋 `1c464a0`, **아직 origin에 push 안 됨**):
  - `CLAUDE.md`, `.claude/skills/new-component/`, `.claude/agents/qa-verifier.md`, `lefthook.yml`, `.gitignore`
  - 실수로 커밋돼 있던 `node_modules`(4,382개) 추적 해제 (디스크 파일은 유지)
- 이 이관 커밋: `design.md`, `sandbox-roadmap.md`, `docs/state/handoff.md` 추가

## 즉시 할 일 (순서)
1. **원격 push** — Cowork 브리지엔 GitHub 자격증명이 없어 미완. 로컬엔 있으니:
   ```bash
   git push origin master
   ```
   - `index.lock` 에러가 나면: `rm -f .git/index.lock` 후 재시도. (push 자체는 대개 무관)
2. **결정 필요 — 패키지 매니저**: 현재 npm(`npx nx …`) 기준으로 kit/문서 작성됨.
   pnpm으로 갈 거면 lock 교체 + CLAUDE.md/lefthook.yml/스킬의 `npx`→`pnpm` 일괄 수정.
3. **lefthook 활성화**(원할 때): `npm i -D lefthook && npx lefthook install`
   - 아직 apps/libs가 없어 nx affected 대상이 없으니, Phase 0~1 진행 후 켜는 걸 권장.

## 다음 단계 (로드맵 Phase 순서 — 상세는 sandbox-roadmap.md)
- **Phase 0**: libs/tokens (design.md → CSS 변수 + Tailwind v4 @theme), 경계 규칙, 패키지별 CLAUDE.md
- **Phase 1**: libs/ui — shadcn init(모노레포) + Button/Input/Card/Tag(design.md) + Storybook → `/new-component`
- **Phase 2**: apps/web — Next 16 App Router 랜딩+블로그(MDX) + Vitest/Playwright 최소 + Vercel 도메인
- **Phase 3**: CI/CD — GitHub Actions nx affected 3단 게이트 + @claude
- **Phase 4**: Multi-Zones 2번째 모듈(apps/console)
- **Phase 5**: Python/AI 도메인 TDD

## 규율 (요약 — 상세 CLAUDE.md)
- explore→plan→code→commit, 패키지 스코프 세션, 항상 `nx affected`
- 새 컴포넌트는 `/new-component`, 완료 판정은 `qa-verifier` 서브에이전트
- 색/간격/radius/shadow **하드코딩 금지** → `libs/tokens` 토큰만

## Claude Code 시작 프롬프트 (복붙용)
```
docs/state/handoff.md 와 CLAUDE.md 를 읽어. 먼저 origin/master 로 push해줘(자격증명은 로컬에 있음).
그다음 Phase 0: sandbox-roadmap.md 기준으로 libs/tokens 를 design.md 토큰(--bs-color-* CSS 변수 + Tailwind v4 @theme)으로 만들어줘. Plan Mode로 계획부터 보여주고 승인받고 진행.
```

## 참고
- claude.ai 프로젝트 "Buddle SandBox 개발"에 `claude-code-playbook.md`(워크플로우 규율)와 `figma-build-state.md`(Figma 디자인 시스템 재개 상태)가 더 있음.
