/**
 * 3D 테마 크로스페이드 — mix 0(라이트 「백자」) ↔ 1(다크 「흑유」). 약 1초(dt·2.2) 수렴, smoothstep 페이드.
 * 라이트 그룹은 0.85배로 줄며 사라지고, 다크 그룹은 0.8→1배로 커지며 나타난다. 순수 함수.
 */
export function stepMix(mix: number, target: 0 | 1, dt: number, reduce = false): number {
  if (reduce) return target;
  const d = Math.min(0.1, Math.max(0, dt));
  const next = mix + (target - mix) * Math.min(1, d * 2.2);
  return Math.abs(target - next) < 0.001 ? target : next;
}

export type Fades = {
  lf: number;
  df: number;
  lightScale: number;
  darkScale: number;
  lightVisible: boolean;
  darkVisible: boolean;
};

export function mixToFades(mix: number): Fades {
  const m = Math.min(1, Math.max(0, mix));
  const e = m * m * (3 - 2 * m);
  const lf = 1 - e;
  const df = e;
  return {
    lf,
    df,
    lightScale: 0.85 + 0.15 * lf,
    darkScale: 0.8 + 0.2 * df,
    lightVisible: lf > 0.001,
    darkVisible: df > 0.001,
  };
}
