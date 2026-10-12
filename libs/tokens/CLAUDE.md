# libs/tokens — 패키지 규칙

`../../design.md` 토큰의 SSOT. 사용법은 `README.md`, 배경은 루트 `CLAUDE.md`.

## 이 패키지의 성격
- **CSS 전용.** 런타임 TS export 를 두지 않는다. TS 토큰 맵은 CSS 와 조용히 어긋나는 두 번째 SSOT 가 된다. 필요해지면(예: 차트 색) 그때 CSS 에서 생성하는 방식으로 추가한다.
- 소비는 TS path alias 가 아니라 패키지 export: `@import "@sandbox/tokens/index.css";`
- `tags: scope:shared, type:util` — 아무것도 import 하지 않는 최하위 레이어다.

## 절대 규칙
1. **`../../design.md` 가 먼저다.** 토큰을 바꾸려면 `../../design.md` → 픽스처 → 테스트(Red) → CSS(Green) 순서. 코드에서 시작하지 않는다.
2. **`@theme inline` 의 `inline` 을 지우지 않는다.** 지우면 다크모드가 무증상으로 죽는다 (`theme.css` 주석 참고).
3. **semantic 값에 raw hex 를 쓰지 않는다.** 항상 `var(--bs-color-*)` 또는 `color-mix()`.
4. **다크모드 3블록의 키 집합을 항상 일치시킨다.** 토큰을 추가하면 `:root` / `@media` / `.dark` 세 곳 모두에 넣는다.
5. 모드에 따라 변하는 값은 `@theme inline`, 불변 스케일은 일반 `@theme`.

## 검증
```bash
npx nx test tokens
```
계약 테스트 45개. 브라우저 불필요(CSS 텍스트 파싱).

CSS 를 크게 바꿨다면 실제 컴파일 결과도 확인한다:
```bash
npx @tailwindcss/cli -i libs/tokens/src/index.css -o /tmp/out.css
```
`.bg-bg-default` 가 `var(--bs-color-bg-default)` 를 참조하는지(=inline 동작), 전역 `--color-*` 가 `:root` 로 새지 않는지 본다.

## 알려진 이름 충돌
- `max-w-prose` 는 Tailwind 내장(65ch). 블로그 본문 폭은 `max-w-content`.
- `--color-bg-default` → `bg-bg-default` 의 "bg" 중복은 오타가 아니다. Figma 변수명과 1:1 매핑을 유지하기 위한 의도적 선택.
