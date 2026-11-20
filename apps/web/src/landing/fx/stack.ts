/**
 * 멘토링 스택 카드 — slash.page Principles 실측(2026-11-08)을 순수 함수로.
 * slash 는 카드를 position:fixed 로 두고 JS 로 좌표를 썼지만, 우리는 sticky 스테이지 안에서
 * 비슷한 수식(x 4%·i, y −75%+15%·i, 진행도별 opacity)을 transform 으로만 적용한다.
 * y 는 slash(−45%)보다 30% 위로 — 스테이지(100svh−topbar) 안에서 5장 부채꼴이 위아래로 잘리지 않게(1280×800 실측).
 */
const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/**
 * 섹션(top: 문서 기준 px, height px) 안에서 스테이지가 sticky 로 머무는 구간의 진행도.
 * 스크롤 구간 = height − vh. 구간이 0 이하(섹션이 뷰포트보다 낮음)면 1.
 */
export function stackProgress(sectionTop: number, sectionHeight: number, vh: number, scrollY: number): number {
  const range = sectionHeight - vh;
  if (range <= 0) return 1;
  return clamp01((scrollY - sectionTop) / range);
}

export type StackCard = { x: number; y: number; opacity: number; scale: number };

/** 카드 i/n 의 진행도 p 에서의 위치(%) · 투명도 · 크기. 카드 i 는 p ∈ [i/n, (i+.6)/n] 에서 0→1. */
export function stackCard(i: number, n: number, p: number): StackCard {
  const pp = clamp01(p);
  const start = i / n;
  const end = (i + 0.6) / n;
  const opacity = i === 0 ? 1 : clamp01((pp - start) / (end - start));
  // 활성 카드 = 등장을 시작한 카드 중 마지막
  let active = 0;
  for (let k = 0; k < n; k++) if (pp >= k / n) active = k;
  const scale = Math.max(0.9, 1 - 0.02 * (active - i));
  return { x: 4 * i, y: -75 + 15 * i, opacity, scale: Math.min(1, scale) };
}

export function stackStyle(c: StackCard) {
  return `translate(calc(-60% + ${c.x}%), ${c.y}%) scale(${c.scale.toFixed(3)})`;
}
