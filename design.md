# Buddle SandBox — Design System v0.2 (Glass)

포트폴리오 랜딩 + 개발 블로그를 위한 디자인 시스템.
v0.1의 뉴트럴 + Indigo 1색 구조를 **백자(porcelain) 뉴트럴 + 벽청(primary) / 청자(tertiary) / 자운(secondary)** 으로 교체하고, 유리(glass) 표면 레이어를 추가한다.
모든 토큰은 **Primitive → Semantic(Light/Dark 모드) → Component** 3단 구조.

-   네이밍 컨벤션: `category/group/name` (Figma variables 기준), 코드에서는 `--bs-color-bg-default` 형태
-   Figma 구성: `Primitives` / `Semantic` 두 개의 variable collection, Semantic에 Light·Dark 모드
-   코드 단일 출처: `libs/tokens/index.css` (CSS 변수 + Tailwind v4 `@theme`). 이 문서와 코드가 다르면 질문한다.
-   콘셉트 한 줄: 백자 표면 위에 청자 유약이 아래쪽으로 고인 유리. 블롭 그래디언트·장식 패턴·세리프 서체는 쓰지 않는다.

---

## 1. Color

### 1.1 Primitives (`Primitives` collection, 단일 모드)

**gray (냉회색 — 벽청 색조 포함)**

| Token      | Value     |     | Token      | Value     |
| ---------- | --------- | --- | ---------- | --------- |
| `gray/0`   | `#FDFDFE` |     | `gray/500` | `#6B7488` |
| `gray/50`  | `#F7F8FB` |     | `gray/600` | `#4A5263` |
| `gray/100` | `#EEF0F6` |     | `gray/700` | `#343A47` |
| `gray/200` | `#DFE3ED` |     | `gray/800` | `#22262F` |
| `gray/300` | `#C5CBD9` |     | `gray/900` | `#14171D` |
| `gray/400` | `#98A1B5` |     | `gray/950` | `#0B0D11` |

`gray/0`은 순백이 아니다(`#FFFFFF` 금지). 유리 알파의 베이스가 되므로 설백 `#FDFDFE`를 쓴다.

**porcelain (라이트 표면)** / **obsidian (다크 표면)**

| Token            | Value     |     | Token            | Value     |
| ---------------- | --------- | --- | ---------------- | --------- |
| `porcelain/snow` | `#FDFDFE` |     | `obsidian/ink`   | `#0B0E16` |
| `porcelain/milk` | `#F7F9FD` |     | `obsidian/glaze` | `#131826` |
| `porcelain/ash`  | `#EEF2F9` |     | `obsidian/ash`   | `#1B2233` |
| `porcelain/blue` | `#E6EDF6` |     | `obsidian/foot`  | `#252E42` |
| `porcelain/page` | `#F4F6FB` |     |                  |           |

**blue (벽청 — primary)**

| Token      | Value     |     | Token      | Value     |
| ---------- | --------- | --- | ---------- | --------- |
| `blue/50`  | `#EEF3FF` |     | `blue/600` | `#2F5CE6` |
| `blue/100` | `#DDE7FF` |     | `blue/700` | `#2447B4` |
| `blue/200` | `#C2D2FF` |     | `blue/800` | `#1E3A8C` |
| `blue/300` | `#9BB4FF` |     | `blue/900` | `#1B3169` |
| `blue/400` | `#6E93FF` |     | `blue/950` | `#121F42` |
| `blue/500` | `#4275FF` |     |            |           |

**celadon (청자 — tertiary)** / **violet (자운 — secondary)**

| Token         | Value     |     | Token        | Value     |
| ------------- | --------- | --- | ------------ | --------- |
| `celadon/100` | `#E6F8FC` |     | `violet/100` | `#F1EDFF` |
| `celadon/300` | `#9ADFF0` |     | `violet/300` | `#CFC2FF` |
| `celadon/500` | `#35C6E8` |     | `violet/500` | `#7B5CFF` |
| `celadon/700` | `#1B93B4` |     | `violet/700` | `#5A3CE0` |
| `celadon/900` | `#124C63` |     | `violet/900` | `#33207F` |

**status**

| Token       | Value     |
| ----------- | --------- |
| `red/500`   | `#E5484D` |
| `green/500` | `#22B07D` |
| `amber/500` | `#E8A33D` |

**navy (그림자 전용)**: `navy/shadow` = `rgb(23 42 94)`. 라이트 모드 그림자는 이 색의 알파만 쓴다. 중성 검정 그림자 금지.

### 1.2 Semantic (`Semantic` collection, Light / Dark 모드)

v0.1 토큰 이름은 전부 유지한다(기존 컴포넌트 무수정). `glass/*`, `glaze/*`, `shadow/*` 그룹을 추가한다.

**surface / text / border**

| Token            | Light            | Dark             |
| ---------------- | ---------------- | ---------------- |
| `bg/page`        | `porcelain/page` | `obsidian/ink`   |
| `bg/default`     | `gray/0`         | `obsidian/glaze` |
| `bg/subtle`      | `porcelain/milk` | `obsidian/ash`   |
| `bg/muted`       | `porcelain/ash`  | `obsidian/foot`  |
| `fg/default`     | `gray/800`       | `gray/50`        |
| `fg/body`        | `gray/700`       | `gray/300`       |
| `fg/muted`       | `#5D6679`        | `gray/400`       |
| `fg/subtle`      | `gray/400`       | `gray/500`       |
| `fg/link`        | `blue/600`       | `blue/300`       |
| `border/default` | `gray/200`       | `obsidian/foot`  |
| `border/strong`  | `gray/300`       | `gray/700`       |

`fg/muted` 라이트 값 `#5D6679`는 `gray/500`보다 어둡게 따로 둔 값이다. `bg/page`·`bg/subtle`·`gray/0` 위에서 4.5:1을 넘기기 위함. **텍스트에 알파 금지** — 유리 위 본문도 불투명 `fg/*`만 쓴다.

**accent**

| Token              | Light            | Dark             |
| ------------------ | ---------------- | ---------------- |
| `accent/default`   | `blue/500`       | `blue/400`       |
| `accent/hover`     | `blue/600`       | `blue/300`       |
| `accent/subtle-bg` | `blue/500 @ 10%` | `blue/400 @ 16%` |
| `accent/fg-on`     | `gray/0`         | `obsidian/ink`   |
| `accent/secondary` | `violet/500`     | `violet/300`     |
| `accent/tertiary`  | `celadon/500`    | `celadon/300`    |
| `danger/default`   | `red/500`        | `red/500`        |
| `success/default`  | `green/500`      | `green/500`      |
| `warning/default`  | `amber/500`      | `amber/500`      |

다크 모드 solid 버튼의 글자는 `accent/fg-on` = `obsidian/ink`(6.69:1). 흰 글자는 2.88:1로 실패한다.

**glass (유리 3단계)**

| Token                 | Light            | Dark                 |
| --------------------- | ---------------- | -------------------- |
| `glass/subtle-bg`     | `gray/0 @ 45%`   | `#FFFFFF @ 5%`       |
| `glass/subtle-border` | `gray/0 @ 60%`   | `#FFFFFF @ 9%`       |
| `glass/base-bg`       | `gray/0 @ 62%`   | `obsidian/ash @ 72%` |
| `glass/base-border`   | `gray/0 @ 80%`   | `#FFFFFF @ 14%`      |
| `glass/foot`          | `blue/300 @ 42%` | `blue/300 @ 40%`     |
| `glass/solid-bg`      | `gray/0 @ 80%`   | `#161A22 @ 78%`      |
| `glass/solid-border`  | `gray/0 @ 90%`   | `#FFFFFF @ 18%`      |
| `glass/blur-sm`       | 8px              | 8px                  |
| `glass/blur-md`       | 16px             | 16px                 |
| `glass/blur-lg`       | 28px             | 28px                 |
| `glass/saturate`      | 150%             | 150%                 |
| `glass/fallback-bg`   | `gray/0 @ 92%`   | `#161A22 @ 94%`      |

**glaze (고임 — 카드 아래 절반에만)**

| Token           | Light                                                                                      | Dark                                                                      |
| --------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------- |
| `glaze/tint`    | `blue/500 @ 10%`                                                                           | `blue/400 @ 14%`                                                          |
| `glaze/celadon` | `celadon/500 @ 16%`                                                                        | `celadon/500 @ 14%`                                                       |
| `glaze/pool`    | `radial-gradient(150% 86% at 50% 116%, glaze/celadon 0%, glaze/tint 38%, transparent 66%)` | `linear-gradient(200deg, transparent 46%, glaze/tint 78%, glaze/celadon)` |

**shadow**

| Token             | Light                                                    | Dark                                                     |
| ----------------- | -------------------------------------------------------- | -------------------------------------------------------- |
| `shadow/sm`       | `0 1px 2px navy @ 10%`                                   | `0 1px 2px #000 @ 40%`                                   |
| `shadow/md`       | `0 6px 16px -6px navy @ 18%`                             | `0 8px 20px -8px #000 @ 55%`                             |
| `shadow/lg`       | `0 28px 64px -20px navy @ 34%`                           | `0 28px 64px -20px #000 @ 70%`                           |
| `shadow/glass`    | `inset 0 1px 0 #FFF @ 95%, 0 10px 30px -14px navy @ 18%` | `inset 0 1px 0 #FFF @ 12%, 0 18px 44px -14px #000 @ 65%` |
| `shadow/ring`     | `0 0 0 3px blue/500 @ 35%`                               | `0 0 0 3px blue/400 @ 40%`                               |
| `shadow/intaglio` | `inset 0 1px 2px navy @ 8%`                              | `inset 0 2px 5px #000 @ 40%`                             |

**background (ambient — 페이지 배경 광원)**

| Token           | Light                          | Dark                    |
| --------------- | ------------------------------ | ----------------------- |
| `orb/primary`   | `blue/500 @ 38% → 0`, 720px    | `blue/400 @ 26% → 0`    |
| `orb/tertiary`  | `celadon/500 @ 32% → 0`, 640px | `celadon/500 @ 18% → 0` |
| `orb/secondary` | `violet/500 @ 15% → 0`, 680px  | `violet/500 @ 12% → 0`  |
| `orb/blur`      | 30px (compact 24px)            | 30px                    |

---

## 2. Typography

폰트: **Pretendard Variable**(한글/영문, 모든 위계), 코드는 **JetBrains Mono**. 세리프·명조 계열 서체는 사용하지 않는다(display 포함).

| Style     | Size / Line-height        | Weight     | Letter-spacing | 용도                      |
| --------- | ------------------------- | ---------- | -------------- | ------------------------- |
| `display` | 56 / 64 (compact 36 / 44) | 800        | -0.03em        | 랜딩 히어로, 페이지당 1개 |
| `h1`      | 32 / 40 (compact 26 / 34) | 700        | -0.02em        | 페이지 제목               |
| `h2`      | 24 / 32                   | 700        | -0.015em       | 섹션 제목                 |
| `h3`      | 20 / 28                   | 600        | -0.01em        | 카드/서브섹션 제목        |
| `body-lg` | 17 / 30                   | 400        | 0              | 블로그 본문               |
| `body`    | 15 / 26                   | 400        | 0              | UI 본문                   |
| `body-sm` | 14 / 20                   | 400        | 0              | 보조 텍스트               |
| `label`   | 13 / 18                   | 600        | 0              | 버튼·인풋 레이블          |
| `caption` | 12 / 16                   | 500        | 0              | 날짜·메타 (`fg/muted`)    |
| `code`    | 13 / 22                   | 400 (Mono) | 0              | 인라인/블록 코드          |

-   한글 제목(`display`~`h3`)은 `word-break: keep-all; text-wrap: balance`. 본문은 `text-wrap: pretty`.
-   다크 모드에서 `display`·`h1`은 weight 700으로 한 단계 낮춘다(발광 번짐 방지).
-   compact(390~)에서 입력 요소 font-size 16px 미만 금지(iOS 자동 확대).

폰트 로드:

```css
@import url("https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css");
@import url("https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap");
```

---

## 3. Spacing & Layout

4px 베이스 스케일 (v0.1과 동일).

| Token     | Value |     | Token      | Value |
| --------- | ----- | --- | ---------- | ----- |
| `space/1` | 4     |     | `space/8`  | 32    |
| `space/2` | 8     |     | `space/10` | 40    |
| `space/3` | 12    |     | `space/12` | 48    |
| `space/4` | 16    |     | `space/16` | 64    |
| `space/5` | 20    |     | `space/20` | 80    |
| `space/6` | 24    |     | `space/24` | 96    |

-   콘텐츠 최대 폭: 랜딩 `1200px`, 블로그 본문 `720px`
-   그리드: 12 columns / gutter `clamp(16px, 4vw, 32px)`
-   카드 그리드: `repeat(auto-fit, minmax(260px, 1fr))`. 고정 px 폭 금지.

### 3.1 Breakpoints (mobile first, 최소 390 = iPhone 14)

| 클래스     | 폭        | 내비                       | 열               | 검증 뷰포트 |
| ---------- | --------- | -------------------------- | ---------------- | ----------- |
| `compact`  | 390~599   | 하단 탭바 56 + safe-bottom | 1                | 390×844     |
| `medium`   | 600~1023  | 좌측 레일 72               | 2                | 768×1024    |
| `expanded` | 1024~1439 | 사이드바 248 (접으면 레일) | 3                | 1280×800    |
| `wide`     | 1440~     | 사이드바 248               | 3, max 1200 중앙 | 1440×900    |

| Token              | compact | medium | expanded+ |
| ------------------ | ------- | ------ | --------- |
| `layout/topbar-h`  | 52      | 52     | 60        |
| `layout/tabbar-h`  | 56      | —      | —         |
| `layout/rail-w`    | —       | 72     | 72        |
| `layout/sidebar-w` | —       | —      | 248       |
| `layout/touch`     | 44      | 44     | 36        |
| `glass/alpha`      | .72     | .66    | .62       |
| `glass/blur`       | 12      | 16     | 16        |
| `radius/card`      | 12      | 14     | 16        |

-   높이는 `100dvh`, safe-area는 `env(safe-area-inset-*)`로만. 390px에서 가로 스크롤 0.
-   컴포넌트 내부 반응은 컨테이너 쿼리(`@container`), 셸 레이아웃만 뷰포트 미디어 쿼리.
-   compact에서 backdrop-filter 요소는 화면당 최대 2개(TopBar, TabBar). 리스트 안 카드는 blur 없이 `glass/fallback-bg` + 고임만.

---

## 4. Radius, Motion

| Token            | Value                                          |
| ---------------- | ---------------------------------------------- |
| `radius/sm`      | 6                                              |
| `radius/md`      | 10                                             |
| `radius/lg`      | 16                                             |
| `radius/xl`      | 24                                             |
| `radius/full`    | 999                                            |
| `motion/ease`    | `cubic-bezier(0.22, 1, 0.36, 1)` — 유일한 이징 |
| `motion/control` | 170ms (버튼·탭·링크 색 전환)                   |
| `motion/surface` | 300ms (테두리·그림자·열림)                     |
| `motion/pool`    | 420ms (고임 차오름)                            |

-   `transition: all` 금지. 대상 속성을 나열한다.
-   hover는 `@media (hover: hover) and (pointer: fine)` 안에서만. 터치는 `:active { transform: scale(.985) }`.
-   `prefers-reduced-motion: reduce`에서 transform·background-size 전환 제거, 색만 170ms linear.

---

## 5. Glass Surface (유리 표면)

세 단계만 존재한다. **같은 화면에서 두 단계 이상 겹치지 않는다**(blur 레이어 중첩 금지).

| 단계          | 구성                                                                               | 용도                          |
| ------------- | ---------------------------------------------------------------------------------- | ----------------------------- |
| `subtle`      | `glass/subtle-bg` + blur-sm + `glass/subtle-border`                                | 태그·칩·보조 패널             |
| `base` (기본) | `glass/base-bg` + `glaze/pool` + blur-md + `glass/base-border` + 굽선 `glass/foot` | 카드·헤더                     |
| `solid`       | `glass/solid-bg` + blur-lg + `glass/solid-border`                                  | Dialog·Popover·Select content |

규칙

-   고임(`glaze/pool`)은 **아래 절반에만**. 카드 전체를 물들이는 그래디언트 카드 금지.
-   굽선: 라이트 = `border-bottom`, 다크 = `border-top`.
-   `@supports not (backdrop-filter: blur(1px))` 폴백 필수 → `glass/fallback-bg`.
-   유리 헤더에 `will-change: backdrop-filter` 금지.
-   표·폼·차트 컨테이너는 유리가 아니라 `bg/default` 불투명.

### 5.1 Hover (하나만 선택)

1. **고임 차오름**(기본): `background-size` 100%→138%(pool 레이어만), 굽선 `blue/500 @ 55%`, 420ms.
2. **3px 부상**: 카드 전체가 링크일 때만. `translateY(-3px)` + `shadow/md`, 300ms.
3. **테두리만**: 표·목록처럼 항목이 많은 자리. `border-color → accent/default`, 170ms.

### 5.2 Page Background (ambient)

`bg/page` 위에 흐린 광원 3개 + 옅은 먹선. 문양·질감 이미지 없음, 정적(애니메이션 금지).

| 레이어          | 위치 (desktop)         | 비고                                       |
| --------------- | ---------------------- | ------------------------------------------ |
| `orb/primary`   | top -220 · left -140   | 주 광원                                    |
| `orb/tertiary`  | top 340 · right -200   | 보조                                       |
| `orb/secondary` | bottom -260 · left 38% | 보조 1개까지, 알파 .15                     |
| 먹선 SVG        | 전체, slice            | 곡선 5줄 `gray/900 @ 7%`, compact에서 숨김 |

-   레이어는 `position: fixed; inset: 0; pointer-events: none; z-index: 0`, 콘텐츠 `z-index: 1`.
-   orb 중심을 콘텐츠 중앙에 두지 않는다(본문 뒤 명도 변화 ≤ 4%).

---

## 6. Components

shadcn 원본 유지, cva variant만 추가(기존 variant 삭제 금지). 모든 주요 컴포넌트에 `glass` variant.

### 6.1 Button

-   Variants: `primary` (accent bg + fg-on, `shadow/md`), `glass` (base 유리 + 굽선, `fg/default`), `secondary` (bg/muted + fg/default), `ghost` (hover `accent/subtle-bg`), `outline` (border/default → hover accent), `danger`
-   Sizes: `sm` 32h / `md` 40h / `lg` 48h / `icon` 40², compact에서 md = 44h. 좌우 패딩 `space/4`(sm `space/3`, lg `space/6`)
-   Radius `radius/md`(lg는 `radius/lg`), 타이포 `label`(sm 12px, lg 15px)
-   States: default / hover(`accent/hover`, 170ms) / focus-visible(`shadow/ring`) / disabled(50% opacity)

### 6.2 Input · Textarea

-   Height 40(compact 44), 패딩 좌우 `space/3`, radius `radius/md`, font 16px(compact)
-   bg `bg/default` + `shadow/intaglio`(음각), border `border/default` → focus `accent/default` + `shadow/ring`
-   Placeholder `fg/subtle`, 라벨 `label` + `fg/body`
-   States: default / focus / error(border `danger/default` + 하단 메시지 `caption`) / disabled
-   Textarea min-h 80, `resize-y`

### 6.3 Card

-   기본 = glass `base`: `glass/base-bg` + `glaze/pool`, border `glass/base-border`, 굽선 `glass/foot`, radius `radius/card`, 패딩 `space/6`, `shadow/glass`
-   `flat` variant: `bg/default` + `border/default` + `shadow/sm` (리스트·표 안, compact 리스트)
-   구조: Header(Title `h3` / Description `body-sm` `fg/muted`) → Content → Footer, gap `space/3`
-   블로그 포스트 카드: 썸네일(16:9, radius `radius/md`) + `h3` + `body-sm` 요약 + Tag 목록 + `caption` 메타

### 6.4 Tag / Badge

-   Height 22, 패딩 좌우 9, radius `radius/sm`, 타이포 `caption` weight 600, 최대 16자
-   Variants: `default` (bg/muted + fg/muted), `glass` (subtle 유리), `accent` (accent/subtle-bg + accent/default), `outline`, `success` / `warning` / `danger`

### 6.5 Select · DropdownMenu

-   trigger = Input과 동일 치수, content = glass `solid`, radius `radius/md`, offset 8
-   item h 34(expanded) / 40(medium) / 48(compact 하단 Action Sheet로 전환)

### 6.6 Tabs

-   list h 40, radius `radius/full`, 활성 탭만 glass `subtle` 알약. 밑줄형은 본문 내부 탭에만. compact에서 가로 스크롤 + 스냅.

### 6.7 Dialog · Sheet

-   표면 glass `solid`, radius `radius/xl`, 패딩 28, max-w 480
-   overlay `obsidian/ink @ 42%` + blur 4px
-   compact: 하단 Sheet(상단만 radius, 드래그 핸들, max-h 92dvh). medium+: 중앙 Dialog.

### 6.8 Tooltip

-   **유리 금지.** `gray/900` 불투명 + `gray/0` 텍스트, radius `radius/sm`. compact에서는 사용하지 않는다.

### 6.9 Avatar

-   24 / 32 / 40 / 56, fallback = 이니셜 1자 + `blue/100` 배경 + `blue/700` 글자

### 6.10 Navigation

-   TopBar h `layout/topbar-h` + safe-top, sticky. 스크롤 전 투명 → 스크롤 후 glass `base`.
-   compact TabBar(최대 5항목, h 56 + safe-bottom, glass `base`) / medium Rail(72, 아이콘 + 12px 라벨) / expanded Sidebar(248, `bg/subtle` 불투명). 세 형태는 같은 `navItems` 배열에서 렌더.

### 6.11 Table

-   row h 48, head h 40, 컨테이너 `bg/default` 불투명 + `border/default`. zebra 금지, hover 하이라이트만(`bg/subtle`).
-   compact: 카드 리스트로 전환(주요 열 2~3개). medium: 가로 스크롤 + 첫 열 sticky.

### 6.12 Accordion

-   trigger h 52, radius `radius/md`. 열린 항목만 glass `subtle`, 닫힌 항목은 `border/default` 선으로 구분.

---

## 7. 절대 규칙

1. `#FFFFFF`·`#000000`을 표면색으로 쓰지 않는다 → `gray/0`(`#FDFDFE`) / `obsidian/ink`(`#0B0E16`).
2. 텍스트에 알파 금지. 본문 대비 4.5:1 이상, 표 안 보조 요소 2.5:1 이상.
3. 라이트 그림자는 `navy` 알파만. 다크 solid 버튼 글자는 `obsidian/ink`.
4. 유리 단계 중첩 금지, 고임은 아래 절반에만, 폴백 필수.
5. 이징 하나(`motion/ease`), `transition: all` 금지, reduced-motion 처리.
6. 세리프·명조 서체 금지. Pretendard + JetBrains Mono만.
7. 390px에서 가로 스크롤 0, `100dvh`, safe-area `env()`, 터치 44, compact 입력 16px.
8. 한글 제목 `word-break: keep-all`.
9. 이모지·장식 아이콘·가짜 수치·채움용 섹션 금지. 배경 애니메이션 금지.
10. 컴포넌트마다 Storybook story: light/dark × 전 variant × 390/768/1280/1440.

---

## 8. Figma 페이지 구성

1. **Cover** — 시스템 이름/버전
2. **01 Foundations** — 컬러(primitive/semantic), 타이포, 스페이싱/radius/shadow, **유리 3단계 + 고임 + 배경 orb**
3. **02 Components** — 6장의 컴포넌트, variant × state × 모드
4. **03 App Shell** — 390 / 768 / 1280 / 1440 셸 레이아웃
