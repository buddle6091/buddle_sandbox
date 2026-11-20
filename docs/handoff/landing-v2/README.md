# Handoff: 랜딩 v2 — 도메인 루트 `/` 교체 (apps/web)

> Claude Design 캔버스("청자 유약 흐름 배경" → "강사 프로필 랜딩")에서 확정한 시안으로 **기존 Phase 2a 랜딩(달항아리 3D · 9섹션)을 교체**한다.
> 동반: 루트 `CLAUDE.md`, `apps/web/CLAUDE.md`, `design.md` v0.2, `docs/state/handoff.md`. 구현 프롬프트는 `PROMPT.md`.

## 이 번들에 대해
- `design/Profile.dc.html` 은 **HTML로 그린 디자인 참고물**이다(단일 파일, three.js r149 · 바닐라 JS). 레이아웃 · 문구 · 인터랙션 · 3D 장면 사양의 기준이다. **코드 복사 금지** — Next.js 16 + R3F + `@sandbox/ui` + `@sandbox/tokens` 로 다시 구현한다.
- 시안 안의 hex 는 참고용이다. 아래 "토큰 매핑" 으로 치환하고 하드코딩하지 않는다.
- 시안의 `/_blob/...` 경로(Pretendard · three.min.js)는 캔버스 전용이다. 앱은 `@sandbox/tokens` 폰트와 npm `three`/`@react-three/*` 를 쓴다.

## 라우트 (확정)
| 경로 | 무엇 | 비고 |
|---|---|---|
| `/` | **랜딩 v2** — 도메인 루트로 접속하면 바로 이 페이지 | `apps/web/app/page.tsx` → `<Landing />` 유지, 내부만 교체 |
| `/blog` · `/calendar` | 기존 그대로 | 이 작업 범위 밖 |

- 별도 앱으로 쪼개지 않는다. **`apps/web` 안에서 `src/landing/` 를 교체**한다(2026-11-01 결정).
- `app/layout.tsx` 의 AmbientBackground + AppShell 구조는 유지한다.

## 기존 → v2 섹션 매핑
| v2 섹션 (id) | 시안 내용 | 기존 대응 |
|---|---|---|
| `top` hero | 이름 · 역할 · 소개문 · CTA 2개(강의 문의하기 → `#contact`, 강의 이력 보기 → `#teaching`) + **우측 3D** | hero (교체) |
| `about` stats | 38곳 · 1,000h+ · 1,200명+ · 51과정 · 3년 차 카운트업 + Clients 한 줄 | stats (수치 갱신) |
| `expertise` | 개발 스택 / AI · AX / 과정 운영 3그룹 칩 카드 | curriculum (대체) |
| `philosophy` | 1문장이 **스크롤 진행에 따라 단어별로 밝아짐** + 보조 문단 | philosophy (인터랙션 교체) |
| `audience` | 산업군별 누적 시간 **가로 막대 14개**(최대 329h 기준) | audience (표현 교체) |
| `teaching` | 대표 강의 10개 **3D 가로 덱**(가운데 카드만 정면) + 고객사 표기 원칙 문구 | experience 중 강의 이력 |
| `mentoring` | 5개 카드 + 마우스 기울임 | mentoring (항목 5개로 갱신) |
| `career` | 개발 경력 세로 타임라인 4건 + 교육 · 자격증 | experience 중 실무 |
| `feedback` | (시안에 없음) | **보류 — 아래 "열린 질문" 1** |
| `contact` | 유약 고임 CTA + 이메일 · GitHub · Tech Blog | contact |

내용 SSOT 는 계속 `src/landing/content/landing.ts` 한 파일. 값은 **2026-10 공개용 이력서**(`design/Profile.dc.html` 의 `_data()` 에 그대로 있음)를 따른다.

## 3D — 테마별 **다른 장면** (핵심)
히어로 우측 영역에만 그린다(기존 "고정 전면 캔버스"는 폐기 → 본문 겹침 문제 해소). `next/dynamic(ssr:false)` 유지.

| | 라이트 「백자」 | 다크 「흑유」 |
|---|---|---|
| 중심 | 청자 유약 방울 — Icosahedron(1.35, detail 48) + 정점 사인 변위, 프레넬 림(벽청), 아래쪽 청자 고임 | 흑요석 구체 — Sphere(1.0), 청자→벽청 프레넬 림 + 표면을 흐르는 가는 유약 띠 + 스펙큘러 |
| 주변 | 궤도 고리 2개(r 2.05 / 2.45) + 각 고리의 위성 1개 + 먼지 520점 | 성운 원반 4,200점(Additive, r 1.45~3.55, 안쪽 청자 → 바깥 벽청, 일부 자운·백색) — 반지름별 차등 공전 + 별먼지 900점 + 빛무리 평면 |
| 배경(DOM) | 상단 좌·우 오브 빛(벽청/청자/자운 저알파) | 별 반짝임 + **하단 가장자리** 오브 빛 + 하단 1px 청자 라인 |

- **전환**: 테마가 바뀌면 약 1초 크로스페이드(smoothstep). 라이트 그룹 0.85배로 줄며 페이드아웃, 다크 그룹 0.8→1배로 커지며 페이드인. 다 사라진 그룹은 `visible=false`.
- **입력**: 포인터 → 그룹 기울기(감쇠 보간), 스크롤 → 회전 · 위로 이동 · 0.75배까지 축소.
- **reduced-motion**: 시간 정지, 포인터 무시, 테마 전환은 즉시. 한 프레임만 렌더.
- **성능**: 히어로가 화면 밖이면 렌더 중지(IO). dpr ≤ 2(기존 1~1.5 유지 권장). 색은 `three/palette.ts` 가 CSS 변수에서 읽는다(테마 변경 시 다시 읽기).

## 인터랙션 목록
1. 섹션 리빌 — IO 로 `data-in` 토글 → CSS 3D(rotateX 16° · translateY 40 → 0, 스태거 60ms). 변형: `flip`(rotateY), `depth`(translateZ).
2. 숫자 카운트업 — stats 가 30% 보이면 1.6s easeOutQuart. (기존 `use-count-up.ts` 재사용)
3. 산업군 막대 — 리빌 시 scaleX 0→1, 스태거 50ms.
4. 철학 문장 — 스크롤 진행도에 비례해 단어별 opacity dim→1.
5. 강의 덱 — scroll-snap 가로 스크롤, 카드 중심 거리 d 로 rotateY(±38°) · translateZ(−140·|d|) · opacity.
6. 카드 기울임 — fine pointer 에서만 rotateX ±5° / rotateY ±6°, 내부 요소 translateZ(28px).
7. 스크롤 진행 막대 — TopBar 하단 2px.
8. 현재 섹션 표시 — IO(rootMargin −45%/−50%)로 active id. **AppShell 은 라우트 내비 그대로 두고**, 섹션 표시는 진행 막대 + (expanded+) 우측 섹션 인디케이터로 한다 — 제안, 구현 시 확정.
9. 테마 토글 — 아래.

## 다크 모드 / 테마 토글
- 토큰은 이미 3갈래(시스템 / `[data-theme="dark"]` / `[data-theme="light"]`)를 지원한다. **next-themes 는 쓰지 않는다**(Phase 1 결정 유지).
- `ThemeToggle` 을 `/new-component` 로 `packages/ui` 에 추가 → AppShell TopBar 우측. `<html data-theme>` + `localStorage('bs-theme')`. 기본값 system.
- FOUC 방지: `app/layout.tsx` `<head>` 에 저장값을 먼저 적용하는 인라인 스크립트(`suppressHydrationWarning` 이미 있음).
- 3D 는 `useThemeMode()`(MutationObserver on `html[data-theme]` + `matchMedia`)로 모드를 받는다.

## 토큰 매핑 (시안 hex → 토큰)
| 시안 | 토큰 |
|---|---|
| `#fdfdfe` `#f7f9ff` `#f4f6fb` / `#0b0e16` `#0e121d` `#131826` | `bg/page` · `bg/subtle` · `bg/muted` |
| `#22262f` / `#eef1f8` | `fg/default` |
| `#343a47` / `#c9cfdc` | `fg/body` |
| `#5d6679` / `#9aa3b8` | `fg/muted` |
| `#2f5ce6` / `#8fb0ff` | `fg/link` |
| 버튼 `#2f5ce6` | `@sandbox/ui` Button primary (흰 글자 4.5:1 확인) |
| `#4275ff` 벽청 · `#35c6e8` 청자 · `#7b5cff` 자운 | `accent/default` · `accent/tertiary` · `accent/secondary` |
| 칩 배경/글자 | `accent/subtle-bg` · `accent/fg-strong` |
| 카드 유리 · 하단 굽선 · 그림자 | `glass-base` 유틸리티 · `glass/foot` · `shadow-glass` |
| CTA 유약 고임 | `--bs-glaze-pool` |
| 3D 재질 색 | `palette.ts` (celadon/blue/violet/obsidian primitive 예외 허용, 주석 명시) |

## 문구 원칙
- 이력서 문장은 띄어쓰기만 다듬어 그대로 쓴다. 아래 3개는 시안에서 새로 쓴 제목이라 **사용자 확인 후 확정**:
  "현업 개발 역량을 그대로 교육으로" · "가르치는 내용은 직접 만들어 본 것들입니다" · "팀에 맞는 AX 교육을 함께 설계합니다"
- 전화번호 · 생년월일 · 프로필 사진 없음(테스트로 고정 유지). 기업 고객사는 업종 · 대상 · 일반화된 주제로만, 지자체 · 학교 · 공공기관은 실명.

## 열린 질문 (구현 전 사용자에게 확인)
1. **feedback 섹션** — 기존 후기 2건은 고객사 실명(물류 · IT 서비스 대기업)을 포함한다. 공개용 이력서의 "기업 고객사 실명 비공개" 원칙과 충돌 → (a) 업종으로 마스킹해 유지 (b) 제거.
2. **문의 이메일** — 기존 `buddle6091@naver.com` vs 이력서 `sangwon.lee@buddle.it.kr`. 시안은 후자.
3. **도메인** — `metadataBase` 가 `https://buddle.dev` 가정. 실제 도메인(예: buddle.it.kr) 확정 필요.
4. 새로 쓴 섹션 제목 3개 확정.

---

## v2.1 — slash 모션 (2026-11-08 적용)

사용자 요청: Toss `slash.page` 수준의 역동성. 참고로 준 `swarm-cursors`(DhvanilPatel) 는 커서 무리가 페이지를 다시 그리는 **크롬 확장**이고, LICENSE 가 없으며 README 가 원작자(Joel Califa, Swarm) 허락 전 재사용을 금한다 → **코드·컨셉 모두 쓰지 않았다.** 대신 slash.page 를 브라우저로 직접 역설계해 4개 기법을 토큰·`fx/` 순수 함수로 이식했다. 새 의존성 없음.

### slash.page 역설계 → 매핑
| slash 실측 | 우리 구현 |
|---|---|
| 히어로: 영상 .4 + 1px `rotate(25deg)` 사선 광선 4개 + 블러 글로우, 로고 160px/500 | `fx/shards.ts` 4개(정적, `.landing-shard` accent 그라디언트) · 이름 `expanded:text-display-xl`(96px, 새 토큰) · 역할 줄 캐럿 · "Clients A / B / C" 줄 |
| Projects 행: 48px 제목 + 호버 시 `\|` 0.8s step-end 깜빡임, 1px 구분선, 호버 bg 3% | `teaching`: 가로 덱 → `<ol>` 행 10개(`data-course-row`), 제목 h2→h1, `.landing-caret` 은 `hover-fine` 에서만, 우측 모노 번호 |
| Downloads: 160px 숫자 1 + 72px 숫자 2, `viewBox 0 0 1000 200` 큐빅 라인 | `about`: 대표 숫자 1,000h+ 를 맨 앞 display-xl, 나머지 4개 display, 카드·틸트 제거. `fx/sparkline.ts` 가 `teaching.courses` hours 를 시작일 순 누적 → 선만(축 숫자 없음, 캡션에 "주요 10개 과정 · 전체 1,000h+ 중 일부" 명시) |
| Principles: 600vh 섹션, 카드 5장 `position: fixed` + 진행도별 좌표·투명도 | `mentoring`: expanded 에서 inner 320vh + **sticky** 스테이지, `fx/stack.ts`(`stackProgress` · `stackCard`: x 4%·i, y −75%+15%·i, opacity 구간 [i/n,(i+.6)/n], scale −2%/단계) 를 rAF 로 DOM 에 직접. compact/medium · reduced-motion 은 기존 그리드 |

### 결정 (2026-11-08)
1. 매핑은 제안대로(히어로 + about + teaching + mentoring).
2. 스파크라인 데이터는 content 의 hours 합산 사용, 라벨에 범위 명시. 축 숫자는 그리지 않는다(규칙 5).
3. `display-xl` 타이포 토큰 추가(96/96/800/−0.04em, expanded 전용, 히어로 이름만).

### 실측에서 바로잡은 것
- 스택 카드 y 오프셋은 slash(−45%) 대신 −75% 기준 — 1280×800 · 1024×768 에서 5장이 스테이지(100svh−topbar) 안에 다 들어온다.
- 스택 카드는 유리(반투명)면 아래 카드 글자가 비쳐 **불투명 `bg/page`** 로(호버 시 `bg/inverse` 반전 유지).
- 숫자 `p` 가 `whitespace-nowrap` 인데도 단위 뒤 `+` 가 다음 줄로 떨어짐(1024~1439) → `flex items-baseline` 로 고정.
- 리빌 전 경력 카드의 `rotateY` 플립이 투영 폭으로 `scrollWidth` 2768@1280 을 만들고 있었다(v2 부터) → `[data-section] { overflow-x: clip }`(스크롤 컨테이너를 만들지 않아 sticky·snap 무영향).

## v3 — "사람이 만든 것처럼" (2026-11-10 적용)

사용자 요청: "좀 더 AI 스럽지 않고, 자연스럽고 역동적이고 인터랙티브하게. 사이트 전부를." 템플릿 인상의 원인을 **반복되는 리듬**(영문 소제목 → 제목 → 유리 카드 그리드, 전부 같은 fade-up)으로 진단하고 그 틀을 깼다.

### 결정 (2026-11-10, 사용자 답)
1. **틀을 깨는 재구성** — 인터랙션만 얹지 않고 섹션별 배치 · 등장을 달리한다.
2. **카피는 1인칭 대화체** — 사실 · 수치 · 기간 · 고객사 표기는 그대로, 말투와 문장 길이만.
3. **범위 = 랜딩 + 공용 셸 + 블로그 · 캘린더 빈 화면.** 블로그 글 목록 · 캘린더 로그인 같은 기능은 제외(Phase 2 별도 세션).
4. **인터랙션 4종 전부** — 강의 필터 + 막대 연동 · ⌘K 팔레트 · 커서 반응 · 이메일 복사 토스트 + 페이지 전환.

### 섹션별 변화
| 섹션 | v2.1 | v3 |
|---|---|---|
| 공통 | 영문 대문자 eyebrow · tinted 교대 · `rotateX 16°` fade-up · 카드 틸트 | eyebrow · tinted · 틸트 삭제. `Section layout="stack"/"split"`(expanded 좌 4칸 sticky 제목 / 우 8칸). 등장 3종: 제목 `rise`(줄 마스크) · 본문 기본(16px) · 보조 `fade` |
| top | 배지 알약 + 이름 + 100자 한 문장 + 버튼 2 + 화살표 | 배지 · 화살표 삭제. 소개 3문장(첫 줄 크게). 「최근 강의」 한 줄(`fx/latest`). 스크롤 시 이름 축소(`fx/hero-fade`). CTA 자석(`fx/magnet`) |
| about | 숫자 + 스파크라인 | + 스파크라인 **스크럽**(role=slider, 포인터 · 좌우 화살표). 읽기는 과정의 원래 날짜 · 제목 · 시간만 |
| expertise | 유리 카드 3 + 칩 | split. 분야 이름이 토글 버튼(`aria-pressed`), 항목은 `/` 로 이은 문장형 목록 |
| audience | 막대 14 | split. 강의 행이 있는 산업군 4개는 `#teaching` 앵커 링크 → 강의 필터를 건다 |
| teaching | 행 10 | 대상 칩(`aria-pressed`) + 산업군 해제 칩 + 결과 수(`aria-live`). 번호는 원래 순서 유지. 행 호버 = 커서 스포트라이트 |
| mentoring | expanded 스택 / 그 외 유리 카드 그리드 | expanded 스택 유지 / 그 외 번호 붙은 평문 목록 |
| career | 유리 카드 타임라인 | 선으로 나눈 2단(좌 기간 · 우 내용). 불릿 6개 → 3개 + 「나머지 3개 더 보기」(`aria-expanded`) |
| feedback | 2열 작은 인용 | 큰 글씨 인용 2개를 엇갈려 쌓기 |
| contact | mailto 버튼 | 이메일 복사 버튼 + 토스트(「메일 앱으로 보내기」 액션), mailto 링크는 따로 유지 |
| 셸 | 정적 탭, 전환 없음 | ⌘K 팔레트(`@sandbox/ui` `CommandDialog`) · TopBar 활성 표시 슬라이드 · 라우트 View Transitions(React `<ViewTransition>`) |
| /blog · /calendar | 범용 EmptyState | 1인칭 안내 + 지금 갈 수 있는 곳(velog · 메일) |

### 계획과 달라진 것
- **cmdk 를 넣지 않았다.** 루트 `package-lock.json` 에 세션 밖 nx 범프가 미커밋으로 남아 있어 의존성을 추가하면 잠금 파일 커밋이 그 변경과 얽힌다. 항목 수십 개 규모라 Dialog 위에 combobox + listbox 를 직접 구현(`packages/ui/src/components/command.tsx`, 테스트 12).
- **전문 분야는 Tabs 대신 토글 버튼.** `@sandbox/ui` Tabs 의 pill/underline 스타일(`glass-subtle`, 가로 스크롤)이 세로 타이포 목록과 맞지 않았다.

### 실측에서 바로잡은 것
- 섹션 등장을 보이는 비율(12%)로 켜면 320vh 멘토링 섹션은 317px 가 보여야 해서 제목이 늦게 뜨고 빈 화면이 생겼다 → 윗변 기준(threshold 0, 아래 15% 선).
- `.landing-spot > * { position: relative }` 는 레이어 밖 CSS 라 Tailwind `absolute` 유틸리티를 이긴다(문의 카드의 유약 고임이 깨질 뻔) → `isolation: isolate` + `::before { z-index: -1 }`.
- 그룹 id 에 그룹 이름을 넣으면 공백 때문에 `aria-labelledby` 가 끊긴다 → 순번 id.

### 확인이 필요한 데이터 (수정하지 않음)
- 산업군 막대 `IT/제조 256h` 와 강의 행 `철강 256h` 는 같은 과정으로 보이는데 표기가 다르다. 그래서 이 막대는 강의 행과 연결되지 않는다(정적). 이력서 기준 어느 쪽이 맞는지 사용자 확인 후 한쪽으로 맞춘다.

