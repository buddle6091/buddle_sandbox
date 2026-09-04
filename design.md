# Buddle SandBox — Design System v0.1

포트폴리오 랜딩 + 개발 블로그를 위한 미니멀 디자인 시스템.
화이트/블랙 뉴트럴 기반에 포인트 컬러 1개(Indigo)만 사용한다.
모든 토큰은 **Primitive → Semantic(Light/Dark 모드) → Component** 3단 구조.

- 네이밍 컨벤션: `category/group/name` (Figma variables 기준), 코드에서는 `--bs-color-bg-default` 형태
- Figma 구성: `Primitives` / `Semantic` 두 개의 variable collection, Semantic에 Light·Dark 모드

---

## 1. Color

### 1.1 Primitives (`Primitives` collection, 단일 모드)

| Token | Value |
|---|---|
| `gray/0` | `#FFFFFF` |
| `gray/50` | `#FAFAFA` |
| `gray/100` | `#F4F4F5` |
| `gray/200` | `#E4E4E7` |
| `gray/300` | `#D4D4D8` |
| `gray/400` | `#A1A1AA` |
| `gray/500` | `#71717A` |
| `gray/600` | `#52525B` |
| `gray/700` | `#3F3F46` |
| `gray/800` | `#27272A` |
| `gray/900` | `#18181B` |
| `gray/950` | `#0B0B0E` |
| `indigo/300` | `#A5B4FC` |
| `indigo/400` | `#818CF8` |
| `indigo/500` | `#6366F1` |
| `indigo/600` | `#4F46E5` |
| `indigo/700` | `#4338CA` |
| `red/500` | `#EF4444` |
| `green/500` | `#22C55E` |
| `amber/500` | `#F59E0B` |

### 1.2 Semantic (`Semantic` collection, Light / Dark 모드)

| Token | Light | Dark |
|---|---|---|
| `bg/default` | `gray/0` | `gray/950` |
| `bg/subtle` | `gray/50` | `gray/900` |
| `bg/muted` | `gray/100` | `gray/800` |
| `fg/default` | `gray/900` | `gray/50` |
| `fg/muted` | `gray/500` | `gray/400` |
| `fg/subtle` | `gray/400` | `gray/500` |
| `border/default` | `gray/200` | `gray/800` |
| `border/strong` | `gray/300` | `gray/700` |
| `accent/default` | `indigo/600` | `indigo/400` |
| `accent/hover` | `indigo/700` | `indigo/300` |
| `accent/subtle-bg` | `indigo/500 @ 10%` | `indigo/400 @ 16%` |
| `accent/fg-on` | `gray/0` | `gray/950` |
| `danger/default` | `red/500` | `red/500` |
| `success/default` | `green/500` | `green/500` |
| `warning/default` | `amber/500` | `amber/500` |

---

## 2. Typography

폰트: **Pretendard** (한글/영문 겸용), 코드 블록은 **JetBrains Mono**.

| Style | Size / Line-height | Weight | 용도 |
|---|---|---|---|
| `display` | 48 / 56 | 700 | 랜딩 히어로 |
| `h1` | 32 / 40 | 700 | 페이지 제목 |
| `h2` | 24 / 32 | 600 | 섹션 제목 |
| `h3` | 20 / 28 | 600 | 카드/서브섹션 제목 |
| `body-lg` | 18 / 28 | 400 | 블로그 본문 |
| `body` | 16 / 24 | 400 | 기본 본문 |
| `body-sm` | 14 / 20 | 400 | 보조 텍스트 |
| `caption` | 12 / 16 | 500 | 라벨, 메타 정보 |
| `code` | 14 / 22 | 400 (Mono) | 인라인/블록 코드 |

---

## 3. Spacing & Layout

4px 베이스 스케일.

| Token | Value |
|---|---|
| `space/1` | 4 |
| `space/2` | 8 |
| `space/3` | 12 |
| `space/4` | 16 |
| `space/5` | 20 |
| `space/6` | 24 |
| `space/8` | 32 |
| `space/10` | 40 |
| `space/12` | 48 |
| `space/16` | 64 |
| `space/20` | 80 |

- 콘텐츠 최대 폭: 랜딩 `1120px`, 블로그 본문 `720px`
- 그리드: 12 columns / gutter 24 / margin 24 (desktop)

## 4. Radius & Shadow

| Token | Value |
|---|---|
| `radius/sm` | 6 |
| `radius/md` | 10 |
| `radius/lg` | 16 |
| `radius/full` | 999 |
| `shadow/sm` | `0 1px 2px rgba(0,0,0,0.06)` |
| `shadow/md` | `0 4px 12px rgba(0,0,0,0.08)` |
| `shadow/lg` | `0 12px 32px rgba(0,0,0,0.12)` |

---

## 5. Components (기초)

### 5.1 Button
- Variants: `primary` (accent bg + fg-on), `secondary` (bg/muted + fg/default), `ghost` (투명 bg + fg/default, hover 시 bg/subtle), `danger`
- Sizes: `sm` 32h / `md` 40h / `lg` 48h, 좌우 패딩 `space/4`(sm은 `space/3`)
- Radius `radius/md`, 타이포 `body-sm`(sm) / `body`(md·lg) weight 600
- States: default / hover / disabled(40% opacity)

### 5.2 Input
- Height 40, 패딩 좌우 `space/3`, radius `radius/md`
- bg `bg/default`, border `border/default` → focus 시 `accent/default` 1.5px
- Placeholder `fg/subtle`, 라벨 `caption` + `fg/muted`
- States: default / focus / error(border `danger/default`) / disabled

### 5.3 Card
- bg `bg/default`(다크에선 `bg/subtle`), border `border/default`, radius `radius/lg`, 패딩 `space/6`, `shadow/sm`
- 블로그 포스트 카드: 썸네일(16:9) + `h3` 제목 + `body-sm` 요약 + Tag 목록 + `caption` 메타

### 5.4 Tag
- Height 24, 패딩 좌우 `space/2`, radius `radius/full`
- 기본: bg `bg/muted` + `caption` `fg/muted`
- 액센트: bg `accent/subtle-bg` + `caption` `accent/default`

---

## 6. Figma 페이지 구성 (구축 시)

1. **Cover** — 시스템 이름/버전
2. **01 Foundations** — 컬러 팔레트 스와치, 타이포 스케일, 스페이싱/radius/shadow 시각화
3. **02 Components** — Button/Input/Card/Tag, variant × state × 모드별 배치
