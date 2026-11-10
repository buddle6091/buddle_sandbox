/**
 * 히어로 이름 — 스크롤로 히어로를 벗어나는 동안 살짝 줄고 흐려진다(transform · opacity 만).
 * range(px) 동안 scale 1 → 0.94, opacity 1 → 0.35. 그 밖은 클램프.
 */
export type HeroFade = { scale: number; opacity: number };

export function heroFade(scrollY: number, range = 480): HeroFade {
  const p = range <= 0 ? 1 : Math.min(1, Math.max(0, scrollY / range));
  return { scale: 1 - 0.06 * p, opacity: 1 - 0.65 * p };
}
