/**
 * 히어로 → 인트로 연결(DayDream 식) — 스크롤로 히어로를 지나는 동안 배경 레이어가 페이지색으로 녹는다.
 * 히어로 높이의 80% 에서 opacity 0. 배경은 스크롤의 30% 만큼 따라 내려가 시차를 만든다(transform 만).
 */
export type HeroDissolve = { opacity: number; shift: number };

const NONE: HeroDissolve = { opacity: 1, shift: 0 };

export function heroDissolve(scrollY: number, heroHeight: number): HeroDissolve {
  if (!Number.isFinite(scrollY) || !(heroHeight > 0) || scrollY <= 0) return NONE;
  const y = Math.min(scrollY, heroHeight);
  const p = Math.min(1, y / (heroHeight * 0.8));
  return { opacity: 1 - p, shift: y * 0.3 };
}
