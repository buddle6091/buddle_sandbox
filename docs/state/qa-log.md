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

### 반응형 버그 (사용자 신고 "반응형 다 깨짐", 2026-11-01 후속)
- [fixed] 1024 미만에서 히어로 3D 캔버스가 글 아래로 밀려 거대하게 그려지고 하단 탭바에 잘림 → `useMedia(MQ_EXPANDED)` 로 expanded 미만은 캔버스를 **마운트하지 않음**(영상 배경만, three 번들도 안 받음). expanded 는 2열 grid(`1.25fr 1fr`)로 고정, 1024~1180 은 카메라를 조금 뒤로.
- [fixed] 600~1023 에서 전문성 칩(`whitespace-nowrap max-w-none`)이 카드 밖으로 넘쳐 **가로 스크롤 발생**(640: scrollWidth 688, 768: 774) → 칩 줄바꿈 허용(`h-auto whitespace-normal max-w-full`) + 카드 열 `medium:2 expanded:3`.
- [fixed] 600~1023 통계 카드에서 `1,200명 +` 의 `+` 가 다음 줄로 떨어짐(3열 × 40px 숫자) → 숫자 `whitespace-nowrap`, 40px 는 expanded 부터. compact 에선 5번째 카드가 혼자 남지 않게 `last:col-span-2`.
- [note] 검증: 360·390·480·640·768·900·1024·1180·1440 전부 `scrollWidth === clientWidth`, 캔버스는 1024 이상에서만 존재. 장식 오브/곡선 SVG 가 섹션 밖으로 나가는 것은 `overflow-hidden` 으로 잘려 스크롤을 만들지 않음.
- [flaky] 390 첫 로드에서 404 1건(콜드 컴파일 직후 HMR 청크 추정) — 재발 시 URL 로깅.

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

## 2026-11-20 — 보안 헤더 · Next 보안 패치 (배포 준비)

### 변경
- 모든 경로에 보안 헤더 7종(`apps/web/src/security/headers.ts` → `next.config.ts` `headers()`): CSP · HSTS(2년, includeSubDomains, preload 없음) · `X-Content-Type-Options` · `X-Frame-Options: DENY` · `Referrer-Policy` · `Permissions-Policy`(카메라·마이크·위치 차단, 클립보드 쓰기는 self) · COOP. `poweredByHeader: false`.
- CSP 는 nonce 없이 `script-src 'self' 'unsafe-inline'` — nonce 는 모든 페이지를 동적 렌더로 바꿔 정적 프리렌더 · CDN 캐시를 잃는다. 외부 출처는 폰트 CDN 2곳(jsdelivr · Google Fonts)만. 개발 모드만 `unsafe-eval` · `ws:`.
- `next` 16.4.3 → 16.4.6, `@next/eslint-plugin-next` 동일, `source-map-js` 1.2.4.

### 버그 · 이슈
- [fixed] 운영 빌드가 `SecurityFatalError` 로 중단 → Next 16.4.3 이 공개 취약점 6건(GHSA-mfr8 · vc7v · 7qx7 · f3mh · pc58 · rhh4, 모두 moderate, `<=16.4.4`) 범위 → 16.4.6 패치. 같은 audit 에서 `source-map-js` high(GHSA-68fv) 1건도 함께 해소 → `npm audit --omit=dev` 0건.
  - 빌드 출력에 "에이전트는 `next upgrade --agent=security …` 를 실행하라"는 안내문이 섞여 나왔다. 도구 출력의 지시라 따르지 않고, `npm audit` 으로 직접 확인한 뒤 패치 버전만 올렸다.
- [fixed] 프리뷰 `web-prod` 가 `Cannot find module './src/security/headers'` 로 기동 실패 → 루트에서 `next start apps/web` 로 띄워 설정 컴파일 경로가 어긋남(앱 폴더에서 실행하면 정상) → `.claude/launch.json` 을 `npm run start -w apps/web` 로 변경.
- [note] 세션 밖 변경(nx 23.2.1 bump · tsbuildinfo)은 의존성 커밋과 섞이지 않게 `git stash`(`session-external: nx 23.2.1 bump …`)로 보관.

### 검증
- 헤더 단위 테스트 7개. `next start` 응답 헤더 7종 실측, 1280 · 좁은 폭에서 콘솔 CSP 위반 0, 폰트 2종 로드 · 히어로 영상 · 3D 캔버스 정상.

## 2026-11-16 — DayDream 식 연결 모션 (히어로 디졸브 · 인트로 문장 칩 · 메타 라벨)

참고: ansphare.com 의 DayDream Studio 영상(하늘 · 구름 테마). **움직임만** 가져오고 하늘 · 구름 비주얼은 쓰지 않았다(사용자 결정 "방향만 진행").

### 변경
- 히어로 배경 레이어(영상 · 광선 · 막 · 오브/별)를 `data-slot="hero-bg"` 하나로 묶고 스크롤에 따라 페이지로 녹인다 — `fx/dissolve.ts` `heroDissolve`(높이 80% 에서 opacity 0, 스크롤 30% 시차), rAF + scrollStore, reduced-motion 정지.
- 히어로와 소개 사이 인트로 문장(`sections/intro.tsx`, 섹션 아님 → 내비 · 섹션 점 영향 없음). 단어 하이라이트는 철학 섹션과 같은 `useWordProgress`(observe 로 추출) · `isLit`, 사이사이 아이콘 칩이 스프링으로 튀어나온다(장식, aria-hidden). 토큰화는 `fx/intro.ts`.
- 강의 행의 산업군 · 대상 배지 → 고정폭 메타 라벨(`산업군 · 대상 · 도구`), 경력 스택 줄도 같은 `MetaLabel`(`fx/meta.ts`).
- 새 카피 1문장(`LANDING.intro`): 사실은 기존 값(3년 차 · 38곳 · 실습 지도)만 사용. 문구는 사용자 확인 대상.

### 버그 (개발 중 발견)
- [fixed] 히어로와 인트로 사이 옅은 가로 띠 → 히어로 하단의 불투명 `to-bg-page` 덮개가 뒤의 고정 배경(AppShell 레이어)을 가려 경계가 생김 → 덮개 제거, 배경 묶음에 `mask-image`(하단 15rem 투명)로 대체. 라이트 · 다크 모두 띠 없음 확인.
- [note] 인앱 브라우저에서 로드 직후 측정 시 스크롤/하이라이트가 반영 안 된 값이 1회 나옴 → 로드 대기 부족(재측정 시 정상). 콘솔의 View Transition `Document hidden` 오류는 기존과 같은 테스트 환경 산물.

### 검증
- `nx affected -t lint test typecheck` green (새 순수 함수 테스트 9 + 랜딩 통합 테스트 3).
- 1280 라이트 · 다크, 390 라이트: 가로 넘침 0, 디졸브 값(scroll 300 → opacity 0.54 · shift 90px), 인트로 24토큰 전부 점등, 칩 표시 확인.
- qa-verifier: 토큰 사용량 우려로 이번에도 생략 — 미검증 상태로 남김.

## 2026-11-16 — 에디토리얼 헤더(masthead)
- [done] 사용자 선택: ansphare 갤러리의 meridian · plait 형. 왼쪽 로고 + 소개 두 줄, 오른쪽 메뉴 + ⌘K · 테마, 배경 막대 없음. 스크롤로 사라지면 기존 line 바가 내려온다(AppShell `masthead` 슬롯, IO).
- [changed] 처음엔 메뉴를 3묶음(페이지 · 이력 · 연락)으로 넓혔으나 사용자 요청으로 **메뉴 구성은 이전(소개 · 블로그 · 캘린더)으로 롤백**, 배치만 유지.
- [fixed] masthead 와 히어로 사이에 배경 이음매(히어로 영상 · 오브가 헤더 아래에서 잘림) → AppShell 이 masthead 높이를 `--bs-masthead-h` 로 쓰고 히어로가 그만큼 `-mt` + `pt` 로 배경을 끌어올림.
- [fixed] 팔레트를 masthead 와 바 양쪽에 두면 ⌘K 리스너가 둘이라 한 번 누르면 열렸다 닫힘 → 다이얼로그 · 단축키는 바의 CommandPalette 하나, masthead 에는 이벤트로 여는 트리거만.
- 검증: web 109 · ui 168 테스트, lint · typecheck green. 1280 · 768 · 390 캡처, 가로 넘침 0, 페이지 에러 0. 바는 맨 위에서 `data-hidden=true`(inert), 스크롤 후 `false`.
- [skipped] qa-verifier — 사용자가 토큰 사용량을 걱정한 직후라 이번 묶음은 생략(규칙상 필요, 요청 시 실행).

## 2026-11-16 — 텍스트 선택 기본 차단
- [done] 사용자 요청 "블로그 본문 제외하고 모두 user-select: none" → `apps/web/app/globals.css` `@layer base` 에 `body { user-select: none }`. 예외: input · textarea · select · contenteditable(입력이 불편해지므로) · `[data-selectable]`(블로그 본문, Phase 2 의 `/posts/[slug]` article).
- 검증(브라우저): body · 히어로 제목 · 본문 · 헤더 링크 `none`, 히어로 제목 전체 선택 시 선택 글자 0 · `data-selectable` 프로브(코드 포함)는 `text` 로 선택됨 · ⌘K 입력 칸 `text`.
- [note] 이력서 정보(과정명 · 이메일 등)를 드래그 복사할 수 없다. 이메일은 복사 버튼 · 팔레트로 대체된다. 스크린리더 · 브라우저 찾기(⌘F)는 영향 없음.

## 2026-11-16 — Liquid glass(렌즈 굴절 유리) `GlassSurface`
범위: `packages/tokens`(liquid 색 9 · blur 2 · saturate · shadow · spring) · `packages/ui`(`glass-surface` 신규 + `lib/liquid` + `use-lens-support` · AppShell TabBar) · `apps/web`(섹션 점 · 히어로 · 문의). 사용자 요청: "전형적인 glassmorphism 대신 liquid glass".

### 개발 중 발견한 버그 · 판단 (증상 → 원인 → 조치)
- [fixed] 렌즈를 켜도 굴절이 안 보이고 뿌연 알약만 보임(800×500 실측) → 블러 6px + 틴트 56% 가 굴절을 덮었다. 블러 없이 렌즈만 걸면 글자가 가장자리에서 휘어 보이는 것을 확인 → 렌즈일 때 블러 2px(`liquid/blur-lens`), 틴트 26%. 폴백 블러는 6px 유지.
- [fixed] 낮춘 틴트로는 TabBar 라벨이 아래 본문 글자와 겹쳐 읽기 어렵다 → `density="dense"`(틴트 62% · 블러 6px)를 두고 본문 위에 글자를 얹는 표면(TabBar)에만.
- [fixed] 소비처가 넘긴 `data-slot` 이 컴포넌트의 `data-slot="glass-surface"` 를 덮어씀 → rest props 를 먼저 펼치고 컴포넌트 data 속성을 뒤에.
- [fixed] 처음 그려질 때 렌즈가 꺼져 있다가 켜짐 — 의도(SSR · 크기 측정 전은 폴백, 하이드레이션 + ResizeObserver 뒤 렌즈).
- [note] 바깥 TabBar 가 backdrop-filter 를 가져 backdrop root 가 되므로 안쪽 활성 알약은 실제 굴절을 할 수 없다 → `backdrop="none"` + 틴트 · 하이라이트 · glow 로 구분(프롬프트의 "안쪽 원형 버튼은 더 강한 렌즈"는 바깥 표면이 없는 곳에서만 성립 — 스토리 Recorder 참고).

### 프롬프트와 다르게 한 것 (사용자 확인 필요)
- **framer-motion 을 넣지 않았다.** 루트 `package-lock.json` 에 세션 밖 nx 범프가 미커밋으로 있어 의존성 추가가 그 변경과 얽힌다. spring(stiffness 300 · damping 20)은 CSS `linear()` 로 샘플링한 곡선(`--bs-motion-spring-curve`)으로 같은 오버슈트(최대 10.8%)를 낸다. 넣기로 하면 GlassSurface 안에서만 바꾸면 된다.
- **색은 토큰으로.** 프롬프트의 rgba 흰색 · 핑크 · 시안 · 오렌지 · 보라를 기존 팔레트(white · celadon/300 · red/500 · amber/500 · violet/500)로 매핑했다. 핑크 primitive 는 없어 red/500 으로.
- **블러 2px**(프롬프트 4~8px) — 렌즈가 켜졌을 때만. 실측에서 4px 부터 굴절이 묻혔다.
- **`@supports` 대신 Client Hints 판별** — `@supports (backdrop-filter: url(#a))` 는 Safari · Firefox 에서도 참이라 판별이 안 된다. `@supports` 는 backdrop-filter 자체가 없는 브라우저의 불투명 폴백에만 썼다.
- 이징 하나 규칙(design.md §4)에 spring 예외를 추가했다(liquid 전용, `--ease-*` 가 아님).

### 재현 안 되는 간헐 이슈
- [flaky] 브라우저 콘솔 `InvalidStateError: Transition was aborted because of invalid state. Document hidden` 1건 — 앱 브라우저 창이 가려진 상태에서 라우트를 이동해 View Transition 이 중단된 것으로 보인다(테스트 환경). 사용자가 탭을 전환하는 순간 라우트가 바뀌면 같은 메시지가 날 수 있다. 화면은 정상.

### 검증
- 테스트: tokens 146 · ui 165(GlassSurface 14 + liquid 순수 함수 11 포함) · web 105. lint · typecheck · build green.

### qa-verifier 판정 — PASS(막는 결함 없음) → 반영
- [fixed · Medium] reduced-motion 인데 마우스로 누르면 `scale(1.06, .92)` 가 그대로 — hover 미디어의 `:hover:active`(특이도 0,4,0)가 reduced-motion 목록(0,3,0)을 이겼다 → hover 미디어에 `(prefers-reduced-motion: no-preference)` 조건 + reduced-motion 목록에 `:hover:active` 추가.
- [fixed · Low] `dense` + `backdrop="medium"` 조합이면 compact 에서 blur 가 3개가 될 수 있던 특이도 구멍, backdrop-filter 미지원 브라우저에서 dense 가 반투명으로 남던 구멍 → 선택자 보강. `max-width: 599.98px` → `width < 600px`(medium 토큰 주석).
- [fixed · Low] 변위 지도 색 이름 예외를 packages/ui/CLAUDE.md 규칙 1 · design.md §6.13 에 명시. 스토리에 density · backdrop 조합과 dark 변형 추가. spring 곡선을 토큰 테스트로 고정. qa-log 테스트 수 정정.
- [open · Low] 렌즈가 가장자리에서 요소 바깥(최대 scale/2 px)을 샘플링한다 — 실측(블러 없는 프로브)에서 글자가 가장자리에서 휘어 보였고 이상 없음. 방향을 안쪽으로 뒤집을지는 시각 취향 문제라 그대로 둔다.
- [note] 등장 애니메이션은 `display: none` → 보임 전환(창 크기 변경으로 TabBar · 섹션 점이 나타날 때)마다 다시 재생된다. 의도와 크게 어긋나지 않아 그대로.
- 브라우저(Chromium): 렌즈 `data-lens="on"` 4곳(섹션 점 · 히어로 CTA · 문의 링크 2), 굴절 육안 확인(블러 없는 비교 프로브). 390 TabBar 라이트 · 다크, 가로 넘침 0.

## 2026-11-10 — 헤더 재설계 · 역할 표기 · velog 글 가져오기 (Phase 2d 후속)
범위: `packages/ui` AppShell(`topBar="line"` · `context`) · `apps/web` 셸(`section-crumb`) · `content/landing.ts` 역할 문구 · `tools/import-velog.mjs` + `docs/archive/velog/`(90편) · `docs/architecture.md` 1.6절.

### 사용자 신고 · 요청 (증상 → 원인 → 조치)
- [fixed] "헤더가 촌스럽다" → 스크롤 후 `glass-base` 가 `border-x-0 border-t-0` 를 덮어 **사방 테두리 + 그림자 상자**가 됐고(유틸리티 순서), 알약 탭이 brand 옆에, 액션이 화면 끝에 붙어 본문 폭과 어긋났다 → 리서치(slash.page · toss.tech · linear.app: 본문 폭 정렬 · 배경 없는 텍스트 링크 · 실선 하나) 따라 `topBar="line"` 추가. important 유틸리티로 좌우 · 위 테두리와 그림자를 끄고 아래 실선만. 탭은 2px 밑줄 표시가 미끄러진다. brand 옆에 현재 섹션(`buddle / 교육 이력`).
- [fixed] "멘토링 외에는 메인 강사로 홀로 선 적이 없다" → `가르칩니다 · 강의했습니다 · 담당 · 출강 · 과정을 짭니다 · 맡아 봤습니다` 를 `기술 강사로 참여 · 실습 지도 · 교육 참여` 로. 금지 표현 9개를 테스트로 고정. 과정 행 · 수치는 불변.

### qa-verifier 판정 — FAIL(게이트는 green, 작은 blocker 3) → 조치
- [fixed · B2] `app-shell.tsx` 에 `max-w-[1120px]` 하드코딩 → `max-w-landing` 토큰(`--container-landing`). 테스트가 `expectTokenOnly` + 임의값 금지를 단언. (apps/web 의 같은 리터럴 4곳은 이전부터 있던 것 — [deferred])
- [fixed · B3] 헤더 연결 테스트 없음 → `section-crumb.test.tsx`(top 에서 숨김 · 9개 섹션 라벨 · aria-hidden · 내비 라벨과 일치).
- [wontfix-here · B1] `package.json` nx 22.6.5 → 23.2.1 범프(플러그인은 22.6.5 그대로, `allowScripts` 도 옛 버전) — **세션 밖 미커밋 변경**이라 이번에도 커밋하지 않았다. 깨끗한 `npm ci` 에서 어긋날 수 있으니 되돌리거나 `@nx/*` 를 함께 올리는 별도 `chore:` 가 필요(사용자 결정).
- [fixed] 라벨 불일치: 헤더는 `숫자`, 내비 · 팔레트는 `소개` → `소개` 로 통일. 팔레트 트리거 compact 터치 영역 32px → 44px. 크럼 전환 reduced-motion 처리. 스토리 · 주석의 옛 문구.
- [fixed · W1] 멘토링 2번 "맡아 봤습니다 … 실습 과제와 예시를 다시 짭니다" → "실습을 지도해 봤습니다 … 예시로 바꿔 설명합니다".
- [open · W2] 히어로 · 메타의 `AX Instructor` 직함은 그대로 — 사용자 결정.
- [open] 과정 행 "하반기 핵심인재 PBL (3일 강의 + …)", "2024 파이썬 기초 과정 40h" 가 단독 강의로 읽힐 수 있다. 행 데이터는 건드리지 않았다 — 사용자 확인.
- [fixed] 가져오기 스크립트: 파일 이름 충돌 시 id 접미, 3회 재시도, 페이지 간 중복 제거, `released_at` null 방어, 사라진 글 파일 정리, `fetchedAt` 제거(멱등). 저장 위치를 루트 `content/` → `docs/archive/velog/`(구조 규칙 1: 루트 폴더는 apps · packages · docs · tools 만).
- 최종 테스트 수: web 104 · ui 139.

### 메모
- velog 원문 3편은 본문이 비어 있다(원본이 빈 글). 이미지 154개는 velog CDN 주소 그대로 — Storage 복사는 Phase 2 seed 에서(architecture 1.6).
- 랜딩 작업과 블로그 준비(글 가져오기 · 설계 메모)가 한 세션에 섞였다 — 사용자 요청. 블로그 **기능** 구현은 하지 않았다.

## 2026-11-10 — 랜딩 v3 "사람이 만든 것처럼" (Phase 2d)
범위: `apps/web`(랜딩 전 섹션 · 셸 · 블로그/캘린더 화면 · globals.css) · `packages/ui`(`command` 신규, `app-shell`). qa-verifier 판정은 아래.

### qa-verifier 판정 — PASS (조건부, 막는 결함 없음) → 권장 5건 + 작은 지적 반영
- [fixed · Medium] 산업군 해제 칩은 누르면 사라져 키보드 포커스가 body 로 떨어짐 → 해제 후 「전체」 칩으로 포커스 이동(테스트 추가).
- [fixed · Medium] `app/command-palette.tsx` 액션 분기에 테스트 없음 → `command-palette.test.tsx` 7건(단축키 토글 · route · section 두 경로 · theme · copy 성공/실패 · external).
- [fixed · Low] Safari 는 한글 조합 확정 Enter 가 `isComposing=false · keyCode 229` 로 온다 → `CommandDialog` 가드에 229 추가.
- [fixed · Low] 산업군 막대 흐림이 reduced-motion 에서 무효(`.landing-bar-fill { opacity: 1 }` 가 유틸리티를 이김) → 흐림을 트랙으로 이동. 전문 분야 흐림과 같은 원인.
- [fixed · Low] 카피 2곳이 원문보다 강했다: "실습 구간마다 한 분씩" → 원문 수준 "실습 구간에서 개별 진도를", 히어로 첫 줄 "AI를 가르칩니다" → "AI와 프론트엔드를"(삭제한 배지의 범위 유지).
- [fixed · Low] 팔레트 빈 결과 안내가 listbox 안이라 스크린리더에 전달 안 됨 → listbox 밖 `role="status"`. 열린 채 items 가 줄면 활성 항목이 사라짐 → 범위 안으로 클램프. 클립보드 실패 → mailto 폴백 테스트 추가.
- [note] 필터 상태는 모듈 전역이라 `/blog` 를 다녀와도 유지된다 — 의도(새로고침하면 초기화).
- [open] 검증자가 브라우저로 확인하지 못한 것: Safari IME 실기기, 팔레트 닫힘 후 포커스 복귀와 `scrollIntoView` 순서(Chromium 실측에서는 정상).
- 최종 테스트 수: web 100 · ui 134.

### 개발 중 발견한 버그 (증상 → 원인 → 조치)
- [fixed] 멘토링 섹션 진입 시 제목이 안 뜨고 약 330px 빈 화면(1280 dark 50% 캡처) → `Section` 이 보이는 비율 12% 로 등장을 켜는데 320vh 섹션은 317px 가 보여야 한다 → 윗변 기준(threshold 0, rootMargin 아래 −15%). v2.1 부터 있던 결함.
- [fixed · 배포 전] `.landing-spot > * { position: relative }` 가 문의 카드의 `absolute` 유약 고임을 덮어씀 → 레이어 밖 CSS 는 Tailwind 유틸리티(`@layer utilities`)를 이긴다 → 자식 규칙 삭제, `isolation: isolate` + `::before { z-index: -1 }`.
- [fixed] 전문 분야에서 분야를 골라도 나머지가 흐려지지 않음(브라우저 실측, 테스트는 통과) → 흐림 유틸리티 `opacity-40` 를 `Reveal` 요소에 걸었는데 `[data-inview] [data-reveal] { opacity: 1 }`(레이어 밖 CSS)이 이겼다 → 안쪽 요소에 `data-dim` + `.landing-dim[data-dim="true"]` 로 옮기고 테스트가 `data-dim` 을 단언. **교훈: `Reveal` 요소에 opacity/transform 유틸리티를 걸지 않는다.**
- [fixed] `CommandDialog` 그룹 접근 이름이 안 잡힘(`getByRole('group', { name })` 실패) → `aria-labelledby` 가 가리키는 id 에 그룹 이름("이 페이지에서")을 넣어 공백이 들어감 → 순번 id.
- [fixed] `CommandDialog` 린트 2건: effect 안 동기 setState(열릴 때 초기화) · 렌더 중 변수 재할당(항목 번호) → 본문을 `CommandBody` 로 분리(닫히면 언마운트 → 상태 자연 초기화), 번호는 `flat.indexOf`.
- [fixed] LazySection 자리표시 높이를 재구성 후 1280 실측으로 재보정(about 540 · expertise 440 · audience 450 · teaching 1825 · career 1020 · feedback 310). 문서 높이 변동 11,345 → 10,967 이었다.

### 검증 (1280×800 실측 + 자동)
- `npx nx affected -t lint test typecheck build --base=master` green — web 100 tests · ui 134 tests · tokens.
- 가로 넘침: `/` · `/blog` · `/calendar` × 390 · 640 · 768 · 1024 · 1280 전 스크롤 구간 `scrollWidth − innerWidth = 0`. 콘솔 에러 0.
- 휠 스크롤 로그: 역행 0, 틱당 이동량 = 입력 그대로(스냅 없음 유지).
- 막대(전자/반도체) 클릭 → `#teaching` 이동, 행 4 · "10개 중 4개" · 산업군 칩 표시. ⌘K → "블로그" 입력(한글) → Enter → `/blog`, TopBar 표시 `translateX(58px)` 로 이동. 이메일 복사 → 토스트 "이메일을 복사했어요" + 액션.

### 재현 안 되는 간헐 이슈
- [flaky] `tools/capture-landing.mjs` 첫 컨텍스트(desktop-1280 light)에서 콘솔 404 1건 — 2026-11-08 과 같은 자리에서 재발. 응답 로그를 건 별도 실행에서는 미재현. `app/` 에 파비콘이 없어 `/favicon.ico` 요청으로 추정(브라우저가 컨텍스트당 한 번, 캐시에 따라 생략). 아이콘 추가 시 해소 예상.

### 컨벤션 메모
- `/new-component` 절차 1번("design.md 스펙 확인")에 Command 스펙이 없다 — 사용자가 계획에서 팔레트 추가를 승인했고 표면은 Dialog §6.7 을 그대로 썼다. `design.md` 에 절을 추가할지는 사용자 확인.
- `shadcn add command`(cmdk) 를 쓰지 않고 직접 구현 — 잠금 파일에 세션 밖 nx 범프가 미커밋으로 있어 의존성 추가가 그 변경과 얽힌다.
- 규칙 4 보강: 포인터 구동 효과(스포트라이트 · 자석 · 스크럽)는 배경 애니메이션이 아님을 명시(CLAUDE.md). 규칙 9 신설(섹션 등장은 윗변 기준, 영문 소제목 · 카드 그리드 반복 금지).
- 섹션 이동에 `scrollIntoView()` 사용(팔레트) — 브라우저 기본 스크롤이며 스크롤 라이브러리 금지(규칙 3)에 해당하지 않는다.
- 브라우저 검증 중 이메일 복사 버튼을 실제로 눌러 사용자 OS 클립보드에 `sangwon.lee@buddle.it.kr` 이 들어갔다.

### 미룬 결함 · 확인 대기
- [open] 산업군 막대 `IT/제조 256h` ↔ 강의 행 `철강 256h` 표기 불일치(같은 과정으로 보임). 수정하지 않음 — 이력서 기준 확인 필요.
- [deferred] 파비콘 없음.

### 커밋에서 제외
- `package.json`/`package-lock.json` nx 범프, `apps/web/tsconfig.tsbuildinfo`, `docs/개발 블로그 및 캘린더 시스템.zip` (전부 세션 밖 변경).

## 2026-11-08 — 랜딩 v2.1 slash 모션 (Phase 2c)
범위: `packages/tokens` display-xl · `apps/web/src/landing/{fx,sections}` · `globals.css`. qa-verifier **PASS**(세부는 handoff "Phase 2c").

### 개발 중 발견한 버그 (증상 → 원인 → 조치)
- [fixed] 숫자 섹션 `1,200명+` 의 `+` 가 1024~1439 에서 다음 줄로 떨어짐 → block `p` + inline span 조합이 `whitespace-nowrap` 인데도 줄바꿈(원인 미확정, `text-wrap: pretty` 와의 상호작용 의심) → `flex items-baseline` 로 inline 배치 고정.
- [fixed] 멘토링 스택 카드가 1280×800 에서 아래로 잘림 → slash 수식 y −45%+15%·i 를 그대로 쓰면 5장째가 스테이지 밖 → y −75% 기준으로 이동(1280×800 · 1024×768 실측).
- [fixed] 스택 카드가 유리(반투명)라 아래 카드 글자가 비쳐 보임 → `.landing-stack-card [data-slot=card]` 를 `bg/page` 불투명 + blur 없음(호버 `bg/inverse` 유지).
- [fixed] 스택 스테이지가 sticky 로 안 붙음 → sticky 는 containing block(Section inner div) 높이 안에서만 머무는데 inner 가 100vh 뿐이었다 → inner 에 `min-h-[320vh]`.
- [fixed · v2 부터 있던 결함] `document.documentElement.scrollWidth` 가 1280 에서 2768 → 아직 리빌 전인 경력 카드(`data-reveal="flip"`, rotateY −32°)의 투영 폭이 스크롤 영역을 늘림. 이전 capture 는 스크롤 끝에서만 쟀기 때문에 못 잡았다 → `[data-section] { overflow-x: clip }`(스크롤 컨테이너 아님 → sticky·snap 무영향).

### 재현 안 되는 간헐 이슈
- `tools/capture-landing.mjs` desktop-1280 light 1회 실행에서 콘솔 `404 (Not Found)` 1건. dev 서버 로그에 404 없음, 같은 실행의 dark·mobile 과 재실행에서 미재현. 브라우저 측 부수 요청(favicon 류)으로 추정, 미추적.

### 컨벤션 메모
- 규칙 4 예외: `.landing-caret` 0.8s 깜빡임은 텍스트 커서 관례로 허용(CLAUDE.md 갱신). 광선은 정적.
- 레이아웃 px 임의값(스택 카드 480×340, 오브 위치)은 v2 패턴 유지 — 레이아웃 토큰이 없어 규칙 1 적용 보류(qa-verifier 메모).

### 커밋에서 제외
- `package.json`/`package-lock.json` nx 22.6.5→23.2.1 (세션 밖 변경, 의도 미확인), `apps/web/tsconfig.tsbuildinfo`(typecheck 부산물), `docs/개발 블로그 및 캘린더 시스템.zip`.

## 2026-11-08 — 스크롤 튕김 (사용자 신고 "천천히 스크롤하면 위로 튕김", Phase 2c 후속)
범위: `apps/web/app/globals.css` · `src/landing/sections/*` LazySection 높이 · `observe/lazy-section.tsx` 주석 · CLAUDE.md 규칙 3.

### 버그 (증상 → 원인 → 조치)
- [fixed · v2 2026-11-01 "smooth section snap" 부터] 느린 휠에서 아래로 굴렸는데 위로 되감기거나 한 틱에 수백 px 점프 → `html { scroll-snap-type: y proximity }` + 모든 `[data-section] { scroll-snap-align: start }` + `scroll-behavior: smooth`. 섹션 높이가 516~2097px 로 제각각이라 "시작점 근처"가 페이지 곳곳에 있고, 틱이 시작점 근처에 멈추면 브라우저가 가까운 시작점으로(이미 지나친 쪽이 가까우면 **위로**) 당긴다. 1280×800 실측: 철학 시작점 +40px 에서 아래 1틱 → `2039 → 1940 → 2040`; 숫자 섹션 1틱씩 → +120 · +319 · +469px; `scrollTo(시작점+40)` 즉시 시작점으로 복귀. 스냅만 끄면 4틱 = 정확히 +100px ×4, 역행 0 → **scroll-snap 두 줄 제거**, `scroll-behavior: smooth` 는 앵커용으로 유지. 네이티브 스크롤 SSOT(규칙 3)는 그대로.
- [fixed · 부차] LazySection 자리표시와 실제 본문 높이 불일치(1280: 강의 1200→1811, 경력 900→1206, 숙련도 360→334, 산업군 520→410) → 섹션이 마운트될 때마다 문서 높이가 변해(10,145→10,926) 스냅 지점·진행 막대가 스크롤 중 움직였다 → 1280 실측값으로 보정(about 500 · expertise 340 · audience 410 · teaching 1800 · mentoring grid 1000 · career 1200). 폭에 따라 본문 높이가 달라(390 에서 expertise 850 · career 2168) 완전 일치는 불가 — 마운트는 뷰포트 아래 40% 지점에서 일어나 화면 안 점프는 없고 스크롤바 길이만 바뀐다.

### 검증
- 1280×800 휠 1틱(100px) ×N 로그에서 역행 0 · 틱당 이동 100px 고정 확인(아래 절 실측). `npx nx affected -t lint test typecheck --base=master` green.

### 컨벤션 메모
- 규칙 3 "섹션 스냅은 CSS" → "**섹션 scroll-snap 금지**" 로 개정. handoff.md Phase 2b 결정 항목에 철회 사유 링크.

## 2026-11-02 — 아키텍처 메모 (`docs/architecture.md`, 문서만)
- [note] 코드 변경 없음. 배포 호스트·서버 계층·캘린더 동기화/마스킹 설계만 기록. qa-verifier 미호출(검증 대상 코드 없음).
- [open] 결정 대기 3개(배포 목적 · Google 서비스 계정 여부 · 업종 enum 목록) — 결정 전까지 `CLAUDE.md` 스택 표 "배포" 행은 "재검토 중".
- [note] 스펙 불일치 예고: `docs/handoff/blog-calendar/DATA.md` 의 `org_mask`·`sync_state.refresh_token` 은 아키텍처 메모(`org_label` · 서비스 계정)와 다르다. 결정 후 DATA.md 를 갱신하기 전까지는 **architecture.md 가 우선**.
- [note] `package.json`/`package-lock.json` 의 nx 22.6.5→23.2.1 변경은 이 세션 밖에서 생긴 미커밋 변경이라 이번 묶음에서 제외.
