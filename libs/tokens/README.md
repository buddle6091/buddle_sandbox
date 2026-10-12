# @sandbox/tokens

`../../design.md` **v0.2 (Glass)** 토큰의 **SSOT**. Primitive → Semantic(Light/Dark) → Tailwind theme 3단 구조.

## 사용법

앱/라이브러리의 최상위 CSS 한 곳에서:

```css
@import "@sandbox/tokens/index.css";
```

이것만으로 Tailwind + 토큰 + 폰트 로드 + `dark:` / `hover-fine:` / `medium:` `expanded:` `wide:` variant 가 모두 켜진다. 따로 `@import "tailwindcss"` 하지 않는다.

## 레이어

| 파일 | 역할 |
|---|---|
| `primitives.css` | 원시 팔레트(`--bs-color-blue-500` 등). 실제 색 값을 갖는 유일한 레이어. **직접 쓰지 않는다.** |
| `semantic.css` | 의미 토큰. 색(`--bs-color-bg-default`)과 비색(`--bs-shadow-*` `--bs-glaze-pool` `--bs-orb-*` `--bs-glass-blur-*`). 값은 전부 primitive 참조. |
| `theme.css` | Tailwind `@theme` 매핑 + 모션 지속시간. 유틸리티 클래스를 만든다. |
| `index.css` | 진입점. 폰트, custom variant, 셸 레이아웃 치수. |

## 유틸리티

색은 semantic 이름 그대로 간다.

```html
<div class="bg-bg-default text-fg-default border-border-default">
<button class="bg-accent-default text-accent-fg-on hover-fine:bg-accent-hover">
```

| 종류 | 예 |
|---|---|
| 표면 | `bg-bg-page`(페이지) `bg-bg-default` `bg-bg-subtle` `bg-bg-muted` |
| 텍스트 | `text-fg-default` `text-fg-body`(본문) `text-fg-muted` `text-fg-subtle` `text-fg-link` — **알파 금지, 전부 불투명** |
| accent | `bg-accent-default` `text-accent-secondary`(자운) `text-accent-tertiary`(청자) `bg-accent-subtle-bg` `text-accent-fg-on` |
| status | `bg-danger-default` `text-success-default` `bg-warning-default` |
| glass | `bg-glass-{subtle,base,solid}-bg` `border-glass-{subtle,base,solid}-border` `border-glass-foot` `bg-glass-fallback-bg` `backdrop-blur-glass-{sm,md,lg}` |
| glaze | `bg-glaze-pool`(고임 그래디언트) `bg-glaze-tint` |
| orb | `bg-orb-primary` `bg-orb-tertiary` `bg-orb-secondary` (+ 크기 `--bs-orb-size-*`, 흐림 `--bs-orb-blur`) |
| shadow | `shadow-sm` `shadow-md` `shadow-lg` `shadow-glass` `shadow-ring`(focus) `shadow-intaglio`(음각 인풋) |
| 타이포 | `text-display` `text-h1` `text-h2` `text-h3` `text-body-lg` `text-body` `text-body-sm` `text-label` `text-caption` `text-code` — size·line-height·weight·letter-spacing 이 한 번에 적용된다 |
| 간격 | `p-6`(24px) `gap-4`(16px) — 4px 베이스 곱셈이라 `p-7` 처럼 표에 없는 값도 쓸 수 있다 |
| radius | `rounded-sm`(6) `rounded-md`(10) `rounded-lg`(16) `rounded-xl`(24) `rounded-full` |
| 모션 | `ease-bs`(유일한 이징) + `duration-[var(--bs-motion-control)]`(170) / `--bs-motion-surface`(300) / `--bs-motion-pool`(420) |
| 브레이크포인트 | 기본=compact(390~) `medium:`(600~) `expanded:`(1024~) `wide:`(1440~) |
| 레이아웃 | `h-[var(--bs-layout-topbar-h)]`(52→60) `--bs-layout-tabbar-h`(56) `--bs-layout-rail-w`(72) `--bs-layout-sidebar-w`(248) `--bs-layout-touch`(44→36) |
| 최대 폭 | `max-w-landing`(1120px) `max-w-content`(720px) |
| 폰트 | `font-sans`(Pretendard Variable) `font-mono`(JetBrains Mono). 세리프 토큰은 없다. |

### 유리 표면 레시피 (design.md §5)

세 단계만 있고, 같은 화면에서 blur 레이어를 겹치지 않는다. `@supports not` 폴백은 필수.

```css
/* base — 카드·헤더 */
.glass-base {
  background-color: var(--bs-color-glass-base-bg);
  background-image: var(--bs-glaze-pool);        /* 고임: 아래 절반에만 */
  border: 1px solid var(--bs-color-glass-base-border);
  border-bottom-color: var(--bs-color-glass-foot); /* 굽선: 라이트 bottom, 다크는 top */
  box-shadow: var(--bs-shadow-glass);
  backdrop-filter: blur(var(--bs-glass-blur-md)) saturate(var(--bs-glass-saturate));
}
@supports not (backdrop-filter: blur(1px)) {
  .glass-base { background-color: var(--bs-color-glass-fallback-bg); }
}
```

Tailwind 로는 `bg-glass-base-bg bg-glaze-pool border border-glass-base-border border-b-glass-foot shadow-glass backdrop-blur-glass-md backdrop-saturate-150`. 폴백은 `supports-[not(backdrop-filter:blur(1px))]:bg-glass-fallback-bg`.

### 토큰 레이어가 갖지 않는 축

토큰은 **모드(라이트/다크)** 축만 가진다. 브레이크포인트에 따라 바뀌는 값은 컴포넌트 CSS 가 `medium:`/`expanded:` 변형이나 컨테이너 쿼리로 처리한다:
glass alpha(.72/.66/.62)·blur(12/16), `radius/card`(12/14/16), orb blur(compact 24), display/h1 compact 축소(36/44, 26/34), 다크 모드 display/h1 weight 700.

## 다크모드

세 갈래로 동작한다.

1. **시스템 설정** — 아무것도 안 하면 `prefers-color-scheme` 를 따른다.
2. **명시적 선택** — 루트에 `.dark` 또는 `[data-theme="dark"]`. next-themes 는 `attribute="class"` 로 쓰면 된다.
3. **라이트 고정** — `[data-theme="light"]` 면 시스템이 다크여도 라이트로 남는다.

컴포넌트에서 `dark:` 를 쓸 일은 거의 없다. semantic 토큰이 이미 모드별로 바뀌므로 `bg-bg-default` 하나면 양쪽이 다 맞는다. 그림자도 마찬가지 — `shadow-md` 는 라이트에서 navy 알파, 다크에서 black 알파로 알아서 갈린다.

## 주의

- **`@theme inline` 에서 `inline` 을 지우지 말 것.** 지우면 Tailwind 가 `:root` 에 전역 `--color-*` 를 만들어 간접참조를 접어버리고, `.dark` 재정의가 흐르지 않는다. 에러도 안 나고 유틸리티도 계속 생성돼서 육안으로 못 잡는다. `tokens.contract.test.ts` 5번이 이걸 잠근다.
- **알파 토큰(`accent-subtle-bg`, `glass-*`, `glaze-*`)에 opacity 수식어를 붙이지 말 것.** 이미 `color-mix` 로 투명도가 들어간 토큰이라 `/50` 을 붙이면 알파가 중첩된다.
- **`hover:` 대신 `hover-fine:`.** 터치 기기에서 hover 가 남는 문제를 변형에서 차단한다. 터치 피드백은 `active:scale-[.985]`.
- **`transition-all` 금지.** `transition-colors` `transition-[box-shadow,border-color]` 처럼 대상을 적는다. 이징은 `ease-bs` 하나.
- **`white`/`black` primitive 는 알파 베이스 전용.** 표면·텍스트 색으로 `#FFFFFF`/`#000000` 을 쓰지 않는다(`gray-0` / `obsidian-ink`).
- **`max-w-prose` 는 우리 토큰이 아니다.** Tailwind 내장값(65ch)이다. 블로그 본문 폭은 `max-w-content`.
- 색·간격·radius·shadow 를 하드코딩하지 말 것 (루트 `CLAUDE.md` 규칙).

## 토큰 바꾸기

1. `../../design.md` 를 먼저 고친다 (진짜 SSOT).
2. `tests/fixtures/expected-tokens.ts` 에 반영한다.
3. 테스트가 실패하는 걸 확인한다(Red).
4. `src/*.css` 를 고쳐 통과시킨다(Green). `semantic.css` 의 다크 블록 2개는 내용이 같아야 한다.

```bash
npx nx test tokens
```

## 테스트

`tests/tokens.contract.test.ts` — CSS 를 텍스트로 파싱하는 계약 테스트 114개. 브라우저 불필요.

Light/Dark **키 패리티** 검사가 핵심이다. light 에만 토큰을 추가하고 dark 를 빠뜨리는 실패는 테마를 토글하기 전까지 보이지 않는데, 이 테스트가 커밋 시점에 잡는다. v0.2 에서 추가된 검사: 비색 토큰 안의 색도 primitive 경유, 그림자 베이스(라이트 navy / 다크 black), indigo 잔존 금지, 세리프 토큰 금지, 이징 단일.
