# @sandbox/tokens

`design.md` 토큰의 **SSOT**. Primitive → Semantic(Light/Dark) → Tailwind theme 3단 구조.

## 사용법

앱/라이브러리의 최상위 CSS 한 곳에서:

```css
@import "@sandbox/tokens/index.css";
```

이것만으로 Tailwind + 토큰 + `dark:` variant 가 모두 켜진다. 따로 `@import "tailwindcss"` 하지 않는다.

## 레이어

| 파일 | 역할 |
|---|---|
| `primitives.css` | 원시 팔레트(`--bs-color-gray-500` 등). 실제 색 값을 갖는 유일한 레이어. **직접 쓰지 않는다.** |
| `semantic.css` | 의미 토큰(`--bs-color-bg-default` 등). 값은 전부 primitive 참조. |
| `theme.css` | Tailwind `@theme` 매핑. 유틸리티 클래스를 만든다. |
| `index.css` | 진입점. |

## 유틸리티

색은 semantic 이름 그대로 간다.

```html
<div class="bg-bg-default text-fg-default border-border-default">
<button class="bg-accent-default text-accent-fg-on hover:bg-accent-hover">
```

| 종류 | 예 |
|---|---|
| 색 | `bg-bg-subtle` `text-fg-muted` `border-border-strong` `bg-danger-default` |
| 타이포 | `text-display` `text-h1` `text-body` `text-caption` `text-code` — size·line-height·weight 가 한 번에 적용된다 |
| 간격 | `p-6`(24px) `gap-4`(16px) — 4px 베이스 곱셈이라 `p-7` 처럼 표에 없는 값도 쓸 수 있다 |
| radius | `rounded-sm` `rounded-md` `rounded-lg` `rounded-full` |
| shadow | `shadow-sm` `shadow-md` `shadow-lg` |
| 최대 폭 | `max-w-landing`(1120px) `max-w-content`(720px) |
| 폰트 | `font-sans`(Pretendard) `font-mono`(JetBrains Mono) |

## 다크모드

세 갈래로 동작한다.

1. **시스템 설정** — 아무것도 안 하면 `prefers-color-scheme` 를 따른다.
2. **명시적 선택** — 루트에 `.dark` 또는 `[data-theme="dark"]`. next-themes 는 `attribute="class"` 로 쓰면 된다.
3. **라이트 고정** — `[data-theme="light"]` 면 시스템이 다크여도 라이트로 남는다.

컴포넌트에서 `dark:` 를 쓸 일은 거의 없다. semantic 토큰이 이미 모드별로 바뀌므로 `bg-bg-default` 하나면 양쪽이 다 맞는다.

## 주의

- **`@theme inline` 에서 `inline` 을 지우지 말 것.** 지우면 Tailwind 가 `:root` 에 전역 `--color-*` 를 만들어 간접참조를 접어버리고, `.dark` 재정의가 흐르지 않는다. 에러도 안 나고 유틸리티도 계속 생성돼서 육안으로 못 잡는다. `tokens.contract.test.ts` 5번이 이걸 잠근다.
- **`bg-accent-subtle-bg` 에 opacity 수식어를 붙이지 말 것.** 이미 `color-mix` 로 투명도가 들어간 토큰이라 `/50` 을 붙이면 알파가 중첩된다.
- **`max-w-prose` 는 우리 토큰이 아니다.** Tailwind 내장값(65ch)이다. 블로그 본문 폭은 `max-w-content`.
- 색·간격·radius·shadow 를 하드코딩하지 말 것 (루트 `CLAUDE.md` 규칙).

## 토큰 바꾸기

1. `design.md` 를 먼저 고친다 (진짜 SSOT).
2. `tests/fixtures/expected-tokens.ts` 에 반영한다.
3. 테스트가 실패하는 걸 확인한다(Red).
4. `src/*.css` 를 고쳐 통과시킨다(Green).

```bash
npx nx test tokens
```

## 테스트

`tests/tokens.contract.test.ts` — CSS 를 텍스트로 파싱하는 계약 테스트 45개. 브라우저 불필요.

Light/Dark **키 패리티** 검사가 핵심이다. light 에만 토큰을 추가하고 dark 를 빠뜨리는 실패는 테마를 토글하기 전까지 보이지 않는데, 이 테스트가 커밋 시점에 잡는다.
