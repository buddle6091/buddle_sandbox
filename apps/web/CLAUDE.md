# apps/web — 패키지 규칙

Next.js 16 App Router. 메인 zone: `/` 랜딩 · `/blog` 블로그 · `/calendar` 비공개 캘린더. 태그 `scope:web type:app`.
UI 는 `@sandbox/ui` 만 소비한다(여기서 공용 컴포넌트를 새로 만들지 않는다 — 필요하면 `/new-component` 로 `packages/ui` 에).

## 절대 규칙
1. 색/간격/타이포/radius/shadow 하드코딩 금지. 토큰 유틸리티만. Three.js 머티리얼 색도 `src/landing/three/palette.ts` 가 CSS 변수에서 읽는다.
2. `three`/`@react-three/*` 는 **클라이언트 전용**. `next/dynamic(..., { ssr: false })` 로만 로드. 서버 컴포넌트에서 import 금지.
3. 스크롤 상태의 SSOT 는 브라우저(네이티브 스크롤). Lenis 는 fine-pointer 데스크톱에서만 부드럽게 할 뿐, 값은 `src/landing/scroll/store.ts` ref 하나.
4. 배경 애니메이션 금지 — 3D 는 스크롤 입력에만 반응한다(자동 회전 없음). `prefers-reduced-motion` 은 섹션 스냅 + 투명도만.
5. 랜딩 내용은 `src/landing/content/landing.ts` 한 파일. 이력서에 없는 수치·채움 섹션 금지. 전화번호·생년월일 금지.
6. Canvas 는 `frameloop="demand"`. 스크롤·리사이즈·in-view 변화에만 `invalidate()`.

## 구조
```
app/                 라우트(서버 컴포넌트). layout.tsx 가 AmbientBackground + AppShell
app/globals.css      @import "@sandbox/ui/styles.css" + 리빌/캔버스 CSS
src/landing/         랜딩 전용 (content · scroll · observe · sections · three)
tests/setup.ts       jsdom 폴리필
```

## 명령
```bash
npx nx dev web            # :3000 (turbopack)
npx nx test web
npx nx affected -t lint test typecheck build
```
