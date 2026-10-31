# PROMPT — 랜딩 v2 교체 (apps/web `/`)

> `buddle_sandbox` 루트에서 Claude Code 에 그대로 붙여넣는다. 긴 작업이므로 **Plan Mode 로 Step 별 계획을 먼저 뽑고 승인 후 실행**한다.

---

루트 `CLAUDE.md`, `docs/state/handoff.md`, `apps/web/CLAUDE.md`, `design.md`, 그리고 `docs/handoff/landing-v2/README.md` 를 읽어라. `docs/handoff/landing-v2/design/Profile.dc.html` 은 디자인 참고물이다(브라우저로 열어 확인, 코드 복사 금지).

목표: 도메인 루트 `/` 의 기존 랜딩(Phase 2a, 달항아리)을 **랜딩 v2 시안으로 교체**한다. 라우트 · 레이아웃 · `/blog` · `/calendar` 는 건드리지 않는다. 시작 전에 README 의 "열린 질문" 4개를 나에게 먼저 물어라.

## 규율
- explore → plan → code → commit. 세션은 `apps/web` 에서 시작(ThemeToggle 은 `packages/ui`).
- 하드코딩 금지 — 토큰만. 새 공용 컴포넌트는 `/new-component`. TDD(Red 먼저). 완료 판정은 `qa-verifier`.
- 검증 `npx nx affected -t lint test typecheck build`. Conventional Commits(제목 영문 소문자, 본문 한글 불릿).
- 기존 코드 재사용 우선: `scroll/`(ScrollDriver · store · progress), `observe/use-in-view.ts`, `sections/section.tsx`, `use-count-up.ts`, `three/palette.ts`.

## Step 1 — 내용 (content/landing.ts)
- 테스트 먼저: stats 38/1000+/1200+/51/3, 섹션 id 목록(README 매핑), 전화번호 · 생년월일 없음.
- 공개용 이력서 값으로 교체(시안 `_data()` 참고). curriculum → expertise, experience → teaching + career 로 분리. feedback 은 열린 질문 1 답에 따름.

## Step 2 — 테마 토글 (packages/ui)
- `/new-component` 로 `ThemeToggle`(아이콘 버튼 44px, aria-label 상태별) + `useThemeMode` 훅. `html[data-theme]` + localStorage, 기본 system.
- `app/layout.tsx` head 에 FOUC 방지 인라인 스크립트. AppShell TopBar 에 배치.

## Step 3 — 섹션 재구성
- README 표의 10개 섹션. 리빌 변형(default/flip/depth) · 카운트업 · 막대 · 철학 단어 하이라이트 · 3D 덱 · 카드 기울임 · 진행 막대.
- 순수 계산은 함수로 빼서 테스트: 덱 변형(d → rotateY/translateZ/opacity), 단어 진행도, 막대 비율.

## Step 4 — 3D 교체 (src/landing/three)
- 고정 전면 캔버스 → **히어로 우측 캔버스**. 달항아리 · 링 리그 제거.
- `scene-light.tsx`(유약 방울 · 고리 · 위성 · 먼지) / `scene-dark.tsx`(흑요석 구체 · 성운 원반 · 별먼지 · 빛무리) + 1초 크로스페이드.
- frameloop: 히어로 in-view && !reduced-motion → `always`, 그 외 `demand`. 색은 palette.ts(테마 변경 시 재조회).

## Step 5 — 검증 · 기록
- `tools/capture-landing.mjs` 로 1280/390 × light/dark × 스크롤 단계 캡처: 콘솔 에러 0, 가로 스크롤 0, 본문 대비 4.5:1.
- `qa-verifier` PASS 후 `docs/state/handoff.md` 에 "Phase 2b 랜딩 v2" 결과 · 결정 · 미룬 것 flush. `docs/structure.md` 트리 갱신.
