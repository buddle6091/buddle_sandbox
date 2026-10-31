# QA · 버그 · 컨벤션 이슈 원장

> 유지보수·에러 핸들링 히스토리. **모든 PR/커밋 묶음은 여기에 한 절을 남긴다.**
> 기록 대상: qa-verifier 지적 사항, 개발 중 스스로 발견한 버그, 컨벤션 위반(토큰 하드코딩·경계·커밋 규칙), 재현 안 되는 간헐 이슈, 의도적으로 미룬 결함.
> 형식: `[상태] 증상 → 원인 → 조치(커밋)`. 상태는 `fixed` / `open` / `deferred` / `wontfix` / `flaky`.

## 2026-11-01 — 랜딩 v2 (Phase 2b) + 후속 다듬기

### qa-verifier 판정
- PASS (전체 범위 + 셰이더 재질 수정분 재검증). lint/test/typecheck/build ui·web Green, 테스트 ui 119 · web 41, hex 하드코딩 0(팔레트 폴백·마스크 예외), 경계 위반 0.

### 버그 (개발 중 발견)
- [fixed] 다크 모드 3D 가 통째로 안 보임(검은 사각형만) → R3F `<shaderMaterial uniforms={obj}>` 가 재질에 **다른 uniforms 객체**를 붙여 useFrame 의 `uFade` 갱신이 셰이더에 닿지 않음 → 모듈 스코프에서 `new THREE.ShaderMaterial({ uniforms })` 로 만들어 `material={}` 로 전달 (`0ae6756`). 규칙으로 `apps/web/CLAUDE.md` 상단에 고정.
- [fixed] 가산 블렌딩 셰이더가 alpha 1 을 내보내 어두운 배경에 검은 판이 비침 → alpha = 밝기 로 변경 (`0ae6756`).
- [fixed] 히어로 h1 이 절대 배치 레이어(영상·캔버스) 뒤에 가려짐 → `Section header="none"` 옵션 추가, 히어로/컨택트가 `${id}-title` 을 직접 렌더 (`0ae6756`).
- [fixed] 컨택트 카드가 `Section` 밖에 있어 IO 리빌이 영영 안 걸림 → Section 안으로 이동 (`0ae6756`).
- [fixed] 칩(Badge) 글자가 위로 치우침 → `truncate` 가 블록이라 세로 중앙 깨짐 → 루트 inline-flex 중앙 + 문자열 children 만 안쪽 `span.truncate` (`2fd28d2`). 같은 원인으로 섹션 인디케이터 툴팁도 `inline-flex h-7 leading-none` (`d987b40`).
- [fixed] 스크롤 스냅이 튀거나 안 먹음 → Lenis 스크립트 스크롤과 CSS scroll-snap 충돌 → Lenis 제거, CSS `scroll-behavior: smooth` + `scroll-snap-type: y proximity` (`d987b40`).
- [fixed] `deck`/`tilt` 테스트에서 `-0 !== 0` 실패 → 계산 결과에 `|| 0` (`0ae6756`).
- [fixed] `scrollStore` TS7022(자기 참조 타입 추론 실패) → 명시적 `ScrollStore` 타입 (`0ae6756`).
- [fixed] Badge 변경 후 ui 테스트 2건 실패(`getByText` 가 안쪽 span 반환) → `.closest('[data-slot="badge"]')` 로 루트를 집도록 수정 (`2fd28d2`).
- [flaky] 캡처 중 dev 서버 404 1건(HMR 청크로 추정). 2026-11-01 재실행 시 실패 요청 0 — 재현 안 됨. 다시 보이면 `tools/capture-landing.mjs` 의 응답 로깅으로 URL 확보.

### 컨벤션 · 도구 이슈
- [fixed] React Compiler lint: effect 안 setState, useFrame 안 prop/useMemo 값 mutate 오류 → `useState(() => detect())`, 모듈 변수(`hero-state.ts`, uniforms), `gl.localClippingEnabled` 는 `onCreated` 로.
- [note] Playwright headless shell 은 소프트웨어 WebGL(프레임 수백 ms) → 캡처는 시스템 Chrome(`channel: 'chrome'`, GPU) 사용. Claude 앱 브라우저 패인은 rAF ~2fps 스로틀 → 애니메이션 성능 판단 금지.
- [note] 커밋 제목 규칙(영문 소문자 Conventional Commits)과 별개로, 사용자 요청으로 푸시 묶음 머지 커밋은 `Feat: Buddle 랜딩페이지 개발` 한글 제목 사용(2026-11-01). 개별 커밋은 규칙 유지.
- [note] `docs/개발 블로그 및 캘린더 시스템.zip` 은 추적하지 않는다(핸드오프 번들 원본은 `docs/handoff/blog-calendar/`).

### 의도적으로 미룬 결함 (deferred)
- [deferred] 미디엄 이상 뷰포트 backdrop-filter 21개(유리 카드) — 실기기 성능 측정 후 `glass-base-flat` 로 낮출지 결정.
- [deferred] LazySection 으로 가려진 본문의 검색 노출(SSR 은 섹션 제목만). 필요 시 `content-visibility` 로 전환.
- [deferred] Lighthouse · 실기기 60fps 측정 · Playwright E2E 미작성.
- [deferred] 덱 키보드 ←/→ 카드 이동은 네이티브 스크롤에 위임(포커스는 가능).
- [open] dev 전용 진단(`window.__heroState`, `data-canvas-inview`) 잔존 — 프로덕션 번들 제외 확인됨, 정리 시점 미정.
