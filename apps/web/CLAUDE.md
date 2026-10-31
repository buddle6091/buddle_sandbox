# apps/web — 패키지 규칙

Next.js 16 App Router. 메인 zone: `/` 랜딩 · `/blog` 블로그 · `/calendar` 비공개 캘린더. 태그 `scope:web type:app`.

> **랜딩 v2 적용 완료 (2026-11-01).** 스펙 `docs/handoff/landing-v2/README.md`, 디자인 참고물 `design/Profile.dc.html`(코드 복사 금지). 결과·결정은 `docs/state/handoff.md` "Phase 2b 결과".
> 3D 셰이더 재질은 `new THREE.ShaderMaterial({ uniforms })` 로 직접 만든다 — JSX `<shaderMaterial uniforms>` 는 uniforms 참조를 끊는다(실측).
UI 는 `@sandbox/ui` 만 소비한다(여기서 공용 컴포넌트를 새로 만들지 않는다 — 필요하면 `/new-component` 로 `packages/ui` 에).

## 절대 규칙
1. 색/간격/타이포/radius/shadow 하드코딩 금지. 토큰 유틸리티만. Three.js 머티리얼 색도 `src/landing/three/palette.ts` 가 CSS 변수에서 읽는다.
2. `three`/`@react-three/*` 는 **클라이언트 전용**. `next/dynamic(..., { ssr: false })` 로만 로드. 서버 컴포넌트에서 import 금지.
3. 스크롤 상태의 SSOT 는 브라우저(네이티브 스크롤). 부드러운 이동·섹션 스냅은 CSS(`scroll-behavior: smooth` + `scroll-snap-type: y proximity`). Lenis 는 scroll-snap 과 충돌해 쓰지 않는다. 값은 `src/landing/scroll/store.ts` ref 하나.
4. 3D 는 **히어로 우측 캔버스에만** 그린다(전면 고정 캔버스 폐기). 라이트 「백자」·다크 「흑유」는 **서로 다른 장면**이고 테마 전환 시 약 1초 크로스페이드. 히어로 안의 느린 자체 움직임(유약 일렁임 · 고리 · 성운 공전)은 허용, 그 외 페이지 배경 애니메이션은 금지(DOM 오브는 정적 또는 40s 이상 느린 드리프트만). `prefers-reduced-motion` 은 시간 정지 + 리빌 투명도만.
5. 랜딩 내용은 `src/landing/content/landing.ts` 한 파일. 기준은 **2026-10 공개용 이력서**(38곳 · 1,000h+ · 1,200명+ · 51과정 · 3년 차). 이력서에 없는 수치·채움 섹션 금지. 전화번호·생년월일 금지. 기업 고객사는 업종·대상·일반화된 주제로만 표기.
6. Canvas frameloop: 히어로 in-view && reduced-motion 아님 → `"always"`, 그 외 `"demand"`(스크롤·리사이즈·테마 변화에만 `invalidate()`). 히어로가 화면 밖이면 렌더하지 않는다.
7. 다크 모드는 토큰(`html[data-theme]` · 시스템)으로만 처리한다. 토글은 `@sandbox/ui` `ThemeToggle`(localStorage `bs-theme`, 기본 system). next-themes 금지.

## 구조
```
app/                 라우트(서버 컴포넌트). layout.tsx 가 AmbientBackground + AppShell
app/globals.css      @import "@sandbox/ui/styles.css" + 리빌·영상·덱·막대 CSS
src/landing/         랜딩 전용 (content · scroll · observe · fx · sections · three) — 트리는 docs/structure.md
tests/setup.ts       jsdom 폴리필
```

## 명령
```bash
npx nx dev web            # :3000 (turbopack)
npx nx test web
npx nx affected -t lint test typecheck build
```
