/**
 * 히어로 사선 광선 — slash.page 실측(2026-11-08): width 1px · rotate(25deg) · 세로 그라디언트 · 4개 · 정적.
 * 위치는 섹션 우측 상단 기준(%·px). 색은 CSS(.landing-shard)가 토큰에서 읽는다. 애니메이션 없음(apps/web 규칙 4).
 */
export type Shard = { top: number; right: number; height: number; opacity: number };

export const SHARDS: readonly Shard[] = [
  { top: -50, right: 10, height: 400, opacity: 0.3 },
  { top: 50, right: 20, height: 300, opacity: 0.3 },
  { top: 100, right: 5, height: 500, opacity: 0.15 },
  { top: -20, right: 30, height: 200, opacity: 0.3 },
];
