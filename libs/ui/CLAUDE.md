# libs/ui — 패키지 규칙

shadcn 기반 공용 컴포넌트(`@sandbox/ui`). 스펙은 `../../design.md` §5~§7, 화면 맥락은 `../../docs/handoff/blog-calendar/SCREENS.md`.
새 컴포넌트는 반드시 `/new-component` 스킬 절차로. 완료 판정은 `qa-verifier`.

## 절대 규칙
1. **색/간격/타이포/radius/shadow 하드코딩 금지.** `@sandbox/tokens` 유틸리티만(`bg-bg-default` `text-fg-muted` `shadow-glass` `text-label` …). `#hex` `rgb(` 가 `src/` 에 있으면 FAIL.
2. **shadcn 의 `--background`/`--primary` 계열 CSS 변수를 쓰지 않는다.** `shadcn add` 가 심는 `bg-background text-foreground` 를 전부 토큰 유틸로 치환한다.
3. **유리 3단계는 `glass-subtle` / `glass-base` / `glass-solid` 유틸리티로만**(`src/styles.css`). 같은 화면에서 blur 레이어를 겹치지 않는다. compact 리스트 안 카드는 `glass-base-flat`(blur 없음).
4. **hover 는 `hover-fine:`** (`hover:` 금지). 터치는 `active:scale-[.985]`.
5. **`transition-all` 금지.** `transition-colors` 또는 `transition-[box-shadow,border-color]` 처럼 대상 나열. 이징 `ease-bs`, 지속시간 `duration-[var(--bs-motion-control|surface|pool)]`. `motion-reduce:` 로 transform 전환 제거.
6. **focus-visible 은 `focus-ring`** 유틸리티(= `shadow/ring`). outline 색을 따로 정하지 않는다.
7. **아이콘은 lucide-react 만, 의미 있는 자리에만.** 이모지·장식 아이콘 금지.
8. **브레이크포인트는 `medium:` `expanded:` `wide:`** (Tailwind 기본 sm/md/lg 를 쓰지 않는다). 컴포넌트 내부 반응은 `@container`.
9. 텍스트에 알파 금지(`text-fg-*/50` 같은 수식어 금지). disabled 는 `opacity-50`.
10. 모든 컴포넌트에 `*.test.tsx`(Testing Library, 실패 테스트 먼저) + `*.stories.tsx`(light/dark × 전 variant; 뷰포트는 툴바 390/768/1280/1440).

## 구조
```
src/components/<name>.tsx      # shadcn 원본 + cva variant. 파일명은 kebab-case
src/components/<name>.test.tsx
src/components/<name>.stories.tsx
src/hooks/use-*.ts
src/lib/utils.ts               # cn
src/stories/                   # 스토리 공용 헬퍼(matrix)
src/styles.css                 # 토큰 import + glass 유틸리티
```
export 는 `src/index.ts` 배럴 + `package.json` 의 `./components/*`.

## 명령
```bash
npx nx test ui              # Vitest(jsdom)
npx nx storybook ui         # :6006
npx nx build-storybook ui   # dist/storybook/ui
npx nx affected -t lint test typecheck
```

## 의존 경계
`scope:ui type:ui` — `@sandbox/tokens`(CSS) 외에 다른 워크스페이스 패키지를 import 하지 않는다. 앱(`apps/*`) 역참조 금지(ESLint 가 잡는다).
