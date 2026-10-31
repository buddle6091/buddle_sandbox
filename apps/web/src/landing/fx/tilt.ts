/** 카드 기울임 — 정규화 좌표(−.5~.5) → rotateX(−y·10°) / rotateY(x·12°). fine pointer 전용. */
const clamp = (n: number) => Math.min(0.5, Math.max(-0.5, n));

export type Tilt = { rotateX: number; rotateY: number };

export function tiltFor(x: number, y: number): Tilt {
  const cx = clamp(x);
  const cy = clamp(y);
  return { rotateX: -cy * 10 || 0, rotateY: cx * 12 || 0 };
}

export function tiltFromPointer(
  clientX: number,
  clientY: number,
  rect: { left: number; top: number; width: number; height: number },
): Tilt {
  return tiltFor((clientX - rect.left) / rect.width - 0.5, (clientY - rect.top) / rect.height - 0.5);
}

export function tiltStyle(t: Tilt) {
  return `perspective(900px) rotateX(${t.rotateX.toFixed(2)}deg) rotateY(${t.rotateY.toFixed(2)}deg) translateZ(0)`;
}
