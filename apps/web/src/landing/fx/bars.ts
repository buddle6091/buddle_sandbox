/** 산업군 막대 — 누적 시간 → 폭 %(소수 첫째 자리), 최대값 기준. */
export function barPercent(hours: number, max: number) {
  if (!Number.isFinite(hours) || hours <= 0 || !Number.isFinite(max) || max <= 0) return 0;
  return Math.round(Math.min(1, hours / max) * 1000) / 10;
}
