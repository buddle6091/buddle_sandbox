/**
 * 자석 버튼 — 포인터가 요소 중심에서 (dx, dy) 떨어져 있을 때 요소가 끌려갈 거리(px).
 * 반경 밖이면 0, 안이면 거리 × strength, 한 축 최대 max. fine pointer + reduced-motion 아님에서만 쓴다.
 */
export type Offset = { x: number; y: number };

export function magnetOffset(dx: number, dy: number, radius: number, strength = 0.25, max = 8): Offset {
  if (radius <= 0 || Math.hypot(dx, dy) > radius) return { x: 0, y: 0 };
  const clamp = (n: number) => Math.min(max, Math.max(-max, n)) || 0;
  return { x: clamp(dx * strength), y: clamp(dy * strength) };
}

export function magnetStyle(o: Offset) {
  return o.x === 0 && o.y === 0 ? '' : `translate3d(${o.x.toFixed(1)}px, ${o.y.toFixed(1)}px, 0)`;
}
