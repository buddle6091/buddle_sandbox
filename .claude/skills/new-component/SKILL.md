---
name: new-component
description: packages/ui에 shadcn 기반 새 공용 컴포넌트를 추가할 때 사용. shadcn add -> packages/ui 이동 -> 토큰 바인딩 -> Storybook 스토리 -> Vitest 테스트까지 한 번에 처리. "새 컴포넌트 만들어", "Button 추가해줘", "packages/ui에 X 컴포넌트" 등.
---

# 새 공용 컴포넌트 추가 (packages/ui)

`packages/ui`에 shadcn 기반 컴포넌트를 추가하는 표준 절차. **색/간격은 절대 하드코딩하지 말고 `packages/tokens` 변수로만** 바인딩한다. `../../../design.md`의 variant/size/state 스펙을 근거로 한다.

## 절차

1. **스펙 확인**: `../../../design.md`에서 대상 컴포넌트의 variant / size / state / 토큰 매핑을 읽는다. 스펙이 없으면 먼저 사용자에게 확인.

2. **shadcn add**: `packages/ui` 워크스페이스에서 `npx shadcn@latest add <component>` 실행. base 컴포넌트가 `packages/ui/src/components`로 들어가는지 확인(모노레포 라우팅). 앱 전용 블록은 앱으로.

3. **토큰 바인딩**: 추가된 컴포넌트의 하드코딩된 색/간격/radius/shadow를 전부 제거하고 `packages/tokens`의 CSS 변수(`--bs-color-*`) 또는 Tailwind theme 유틸로 교체한다. `../../../design.md`의 Semantic 토큰(bg/fg/border/accent/danger...)에 맞춘다. Light/Dark 모두 자동 대응되는지 확인.

4. **variant/state 반영**: `../../../design.md` 스펙의 모든 variant x size x state를 cva(class-variance-authority) 기반으로 구현. disabled 40% opacity, focus ring accent 등 상태 규칙 준수.

5. **Storybook 스토리**: `<Component>.stories.tsx` 생성 - 모든 variant/state를 보여주는 스토리 + Light/Dark 토글. a11y addon 통과 확인.

6. **테스트(Vitest + Testing Library)**: `<Component>.test.tsx` - 렌더, variant별 클래스/역할, 상호작용(클릭/포커스), disabled 동작, 접근성 role/aria 검증. **먼저 실패하는 테스트를 쓰고**(Red) 구현이 통과하도록.

7. **export**: `packages/ui`의 배럴/서브패스 export에 추가해 `@sandbox/ui/components/<component>`로 소비 가능하게 한다.

8. **검증**: `npx nx affected -t lint test typecheck`를 돌리고, 완료 판정은 `qa-verifier` 서브에이전트에 맡긴다(구현 세션이 스스로 "완료" 선언 금지).

## 체크리스트 (완료 전)
- [ ] 하드코딩된 색/간격/radius/shadow 0개 (전부 토큰)
- [ ] Light/Dark 모두 정상
- [ ] 모든 variant x state 커버 (Storybook + 테스트)
- [ ] a11y(role/aria/키보드) 통과
- [ ] `@sandbox/ui`에서 import 가능
- [ ] `nx affected -t lint test typecheck` green
