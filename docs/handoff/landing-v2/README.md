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
