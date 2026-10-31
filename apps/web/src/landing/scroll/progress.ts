/** 스크롤 → 진행도. 순수 함수. */
export const clamp01 = (n: number) => (Number.isFinite(n) ? Math.min(1, Math.max(0, n)) : 0);

/** 문서 전체 진행도 0~1 */
export function computeProgress(scrollY: number, scrollHeight: number, innerHeight: number) {
  const max = scrollHeight - innerHeight;
  if (max <= 0) return 0;
  return clamp01(scrollY / max);
}
