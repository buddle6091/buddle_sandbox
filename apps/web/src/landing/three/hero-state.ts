import { mixToFades, type Fades } from '../fx/theme-mix';

/**
 * 히어로 3D 공유 상태 — 프레임마다 바뀌는 값이라 React 상태가 아니라 모듈 변수.
 * (useFrame 안에서 prop/useMemo 값을 바꾸면 React Compiler lint 가 막는다 — Phase 2a 교훈)
 */
export const heroState = {
  /** 장면 시간(초). reduced-motion 이면 멈춘다 */
  t: 0,
  /** 0 라이트 ↔ 1 다크 */
  mix: 0,
  fades: mixToFades(0) as Fades,
  /** 포인터 −1~1 */
  px: 0,
  py: 0,
  reduce: false,
};

// 개발 중 진단용 — 프로덕션 번들에는 들어가지 않는다
if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
  (window as unknown as { __heroState?: typeof heroState }).__heroState = heroState;
}
