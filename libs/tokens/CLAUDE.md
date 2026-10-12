# libs/tokens — 패키지 규칙

`../../design.md` 토큰의 SSOT. 사용법은 `README.md`, 배경은 루트 `CLAUDE.md`.

## 이 패키지의 성격
- **CSS 전용.** 런타임 TS export 를 두지 않는다. TS 토큰 맵은 CSS 와 조용히 어긋나는 두 번째 SSOT 가 된다. 필요해지면(예: 차트 색) 그때 CSS 에서 생성하는 방식으로 추가한다.
- 소비는 TS path alias 가 아니라 패키지 export: `@import "@sandbox/tokens/index.css";`
- `tags: scope:shared, type:util` — 아무것도 import 하지 않는 최하위 레이어다.
- ⚠ **여기에 TS export 를 추가한다면 `tsconfig.base.json` 에 `@sandbox/tokens` path 매핑을 같이 넣어라.**
  path 매핑이 없으면 Nx 가 의존 엣지를 만들지 못해서 `@nx/enforce-module-boundaries` 가
  이 패키지에 대해 **조용히 아무것도 검사하지 않는다** (에러가 아니라 무검사로 통과한다).
- ⚠ `tsconfig.json` 의 `include` 는 `tests/` 와 `vite.config.ts` 뿐이라 **`src/` 는 typecheck 대상이 아니다.**
  지금은 `src/` 가 CSS 전용이라 문제없지만, `src/*.ts` 를 만든다면 `include` 를 같이 넓혀라.

## 절대 규칙
1. **`../../design.md` 가 먼저다.** 토큰을 바꾸려면 `../../design.md` → 픽스처 → 테스트(Red) → CSS(Green) 순서. 코드에서 시작하지 않는다.
2. **`@theme inline` 의 `inline` 을 지우지 않는다.** 지우면 다크모드가 무증상으로 죽는다 (`theme.css` 주석 참고).
3. **semantic 값에 raw hex 를 쓰지 않는다.** 색 토큰은 `var(--bs-color-*)` 또는 `color-mix()`. 비색 토큰(`--bs-shadow-*` `--bs-glaze-pool` `--bs-orb-*`) 안의 색도 반드시 `var(--bs-color-*)` 경유 — 표에 이름이 없는 값이면 `../../design.md` §1.1 에 primitive 를 먼저 추가한다(`gray/550` `white` `black` `obsidian/panel` 이 그 예).
4. **다크모드 3블록의 키 집합을 항상 일치시킨다.** 토큰을 추가하면 `:root` / `@media` / `.dark` 세 곳 모두에 넣는다.
5. 모드에 따라 변하는 값(색·그림자·그래디언트·blur)은 `@theme inline`, 불변 스케일은 일반 `@theme`.
6. **토큰 레이어는 모드 축만 가진다.** 브레이크포인트별로 바뀌는 값(glass alpha, radius/card, compact 타이포)은 컴포넌트 CSS 책임. semantic 에 `@media (min-width)` 를 넣지 않는다.
7. 이징은 `--ease-bs` 하나. 다른 `--ease-*` 를 추가하지 않는다.

## 검증
```bash
npx nx test tokens
```
계약 테스트 114개. 브라우저 불필요(CSS 텍스트 파싱).

CSS 를 크게 바꿨다면 실제 컴파일 결과도 확인한다:
```bash
npx @tailwindcss/cli -i libs/tokens/src/index.css -o /tmp/out.css
```
`.bg-bg-default` 가 `var(--bs-color-bg-default)` 를 참조하는지(=inline 동작), 전역 `--color-*` 가 `:root` 로 새지 않는지 본다. `@tailwindcss/cli` 는 설치돼 있지 않으니 `--content` 로 probe HTML 을 주고 `npx` 로 돌린다.

## 알려진 이름 충돌
- `max-w-prose` 는 Tailwind 내장(65ch). 블로그 본문 폭은 `max-w-content`.
- `--color-bg-default` → `bg-bg-default` 의 "bg" 중복은 오타가 아니다. Figma 변수명과 1:1 매핑을 유지하기 위한 의도적 선택.
