# apps/web — 패키지 규칙

Next.js 16 App Router. 메인 zone: `/` 랜딩 · `/blog` 블로그 · `/calendar` 비공개 캘린더. 태그 `scope:web type:app`.

> **랜딩 v2 적용 완료 (2026-11-01).** 스펙 `docs/handoff/landing-v2/README.md`, 디자인 참고물 `design/Profile.dc.html`(코드 복사 금지). 결과·결정은 `docs/state/handoff.md` "Phase 2b 결과".
> **v2.1 slash 모션 (2026-11-08).** slash.page 역설계 4기법(히어로 광선·타이포 / 숫자 스파크라인 / 강의 행+캐럿 / 멘토링 sticky 스택)을 토큰·`fx/` 순수 함수로 이식. 표·결정은 README "v2.1" 절, 결과는 handoff "Phase 2c". swarm-cursors(라이선스 없음)는 코드·컨셉 모두 미사용.
> **v3 "사람이 만든 것처럼" (2026-11-10).** 영문 소제목 · tinted 교대 · 유리 카드 그리드 · 일괄 fade-up 을 걷어내고 섹션마다 배치(stack/split)와 등장(rise/fade/기본)을 달리했다. 카피는 1인칭 대화체(사실 · 수치 불변). 인터랙션: 강의 필터 ↔ 산업군 막대, 스파크라인 스크럽, 전문 분야 토글, 경력 더 보기, 커서 스포트라이트 · 자석 버튼, 이메일 복사 토스트, ⌘K 팔레트, 라우트 View Transitions. 표 · 결정은 README "v3" 절, 결과는 handoff "Phase 2d".
> 3D 셰이더 재질은 `new THREE.ShaderMaterial({ uniforms })` 로 직접 만든다 — JSX `<shaderMaterial uniforms>` 는 uniforms 참조를 끊는다(실측).
UI 는 `@sandbox/ui` 만 소비한다(여기서 공용 컴포넌트를 새로 만들지 않는다 — 필요하면 `/new-component` 로 `packages/ui` 에).

## 절대 규칙
1. 색/간격/타이포/radius/shadow 하드코딩 금지. 토큰 유틸리티만. Three.js 머티리얼 색도 `src/landing/three/palette.ts` 가 CSS 변수에서 읽는다.
2. `three`/`@react-three/*` 는 **클라이언트 전용**. `next/dynamic(..., { ssr: false })` 로만 로드. 서버 컴포넌트에서 import 금지.
3. 스크롤 상태의 SSOT 는 브라우저(네이티브 스크롤). 앵커 이동만 CSS `scroll-behavior: smooth`. **섹션 scroll-snap 금지**(2026-11-08) — `y proximity` + 모든 섹션 `snap-align: start` 가 휠 1틱을 120~470px 로 늘리고 지나친 시작점으로 **위로** 끌어올렸다(실측 2039→1940→2040). Lenis 등 스크립트 스크롤도 금지. 값은 `src/landing/scroll/store.ts` ref 하나. `LazySection` `minHeight` 는 1280 실측 본문 높이에 맞춘다(마운트 시 문서 높이 변동 최소화).
4. 3D 는 **히어로 우측 캔버스에만**, 그리고 **expanded(≥1024px) 에서만** 그린다(그 아래는 `useMedia(MQ_EXPANDED)` 로 아예 마운트하지 않고 영상 배경만 — 글 아래로 밀려 탭바에 잘리고 three 번들만 무거웠다, 2026-11-01). 전면 고정 캔버스 폐기. 라이트 「백자」·다크 「흑유」는 **서로 다른 장면**이고 테마 전환 시 약 1초 크로스페이드. 히어로 안의 느린 자체 움직임(유약 일렁임 · 고리 · 성운 공전)은 허용, 그 외 페이지 배경 애니메이션은 금지(DOM 오브는 정적 또는 40s 이상 느린 드리프트만, 히어로 사선 광선 `.landing-shard` 도 정적). 유일한 예외는 타이핑 캐럿 `.landing-caret` 의 0.8s 깜빡임(텍스트 커서 관례)과 liquid glass glow 의 흐름(활성 표면 안에서만 — `@sandbox/ui` GlassSurface, design.md §6.13). **포인터가 움직일 때만 반응하는 효과**(커서 스포트라이트 `.landing-spot`, 자석 버튼 `.landing-magnet`, 스파크라인 스크럽)는 배경 애니메이션이 아니다 — 단 `(hover: hover) and (pointer: fine)` 에서만 켜고 DOM 에 직접 쓴다(리렌더 금지). `prefers-reduced-motion` 은 시간 정지 + 리빌 투명도만(캐럿 고정 · 스파크라인 즉시 · 스택 변형 없음 · 스포트라이트 · 자석 · 라우트 전환 끔).
5. 랜딩 내용은 `src/landing/content/landing.ts` 한 파일. **역할 표기**: 멘토링 외에는 메인 강사 단독이 아니다 → "가르칩니다 · 강의했습니다 · 담당 · 출강" 금지, "기술 강사로 참여 · 실습 지도 · 교육 참여"(테스트가 금지 표현을 잡는다). 말투는 1인칭 대화체(v3) — 다듬을 때도 사실 · 수치 · 기간 · 고객사 표기는 건드리지 않는다. 파생 표시(최근 강의, 필터 결과 수, 스크럽 읽기)는 기존 값을 고르기만 하고 새 수치(누적 합 등)를 화면에 내지 않는다. 기준은 **2026-10 공개용 이력서**(38곳 · 1,000h+ · 1,200명+ · 51과정 · 3년 차). 이력서에 없는 수치·채움 섹션 금지. 전화번호·생년월일 금지. 기업 고객사는 업종·대상·일반화된 주제로만 표기.
6. Canvas frameloop: 히어로 in-view && reduced-motion 아님 → `"always"`, 그 외 `"demand"`(스크롤·리사이즈·테마 변화에만 `invalidate()`). 히어로가 화면 밖이면 렌더하지 않는다.
7. **반응형은 토큰 브레이크포인트 3개만** (`medium` 600 · `expanded` 1024 · `wide` 1440). 칩·숫자처럼 nowrap 인 요소는 카드 폭이 줄어드는 600~1023 구간에서 넘치기 쉽다 — 줄바꿈 허용(`whitespace-normal h-auto`) 또는 열 수를 줄인다. 작업 후 `tools/capture-landing.mjs` 로 390·640·768·1024·1280 에서 `scrollWidth === clientWidth` 를 확인한다.
8. 다크 모드는 토큰(`html[data-theme]` · 시스템)으로만 처리한다. 토글은 `@sandbox/ui` `ThemeToggle`(localStorage `bs-theme`, 기본 system). next-themes 금지.
9. 섹션 등장은 `Section` 이 **윗변 기준**(threshold 0, 아래 15% 선)으로 켠다. 보이는 비율 기준을 쓰지 않는다 — 뷰포트보다 훨씬 긴 섹션(멘토링 320vh)은 제목이 늦게 떠 빈 화면이 생긴다. 새 섹션은 영문 대문자 소제목 · 유리 카드 그리드 반복을 쓰지 않는다(v3).
10. **텍스트 선택은 기본 차단**(`body { user-select: none }`, 2026-11-16). 블로그 본문을 감싸는 요소에만 `data-selectable`(또는 `select-text`)을 붙여 연다. 입력 칸 · contenteditable 은 항상 선택 가능.

## 구조
```
app/                 라우트(서버 컴포넌트). layout.tsx 가 AmbientBackground + AppShell
app/globals.css      @import "@sandbox/ui/styles.css" + 리빌(기본/fade/rise)·영상·막대·캐럿·광선·스파크라인·스택·스포트라이트·자석·라우트 전환 CSS
src/landing/         랜딩 전용 (content · scroll · observe · fx · sections · three) — 트리는 docs/structure.md
                     fx/ = words · bars · theme-mix · shards · sparkline · stack · course-filter · magnet · hero-fade · latest (순수 함수 + 테스트, WebGL/DOM 없이 Vitest 로 고정)
                     filter/store.ts = 산업군 막대 ↔ 강의 이력이 공유하는 필터 상태
src/shell/           세 라우트 공통 — palette-items(⌘K 항목) · clipboard. 조립은 app/command-palette.tsx
tests/setup.ts       jsdom 폴리필
```

## 명령
```bash
npx nx dev web            # :3000 (turbopack)
npx nx test web
npx nx affected -t lint test typecheck build
```
