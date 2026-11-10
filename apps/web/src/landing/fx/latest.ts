import { sortKey } from './sparkline';

/** 시작일이 가장 늦은 과정 — 히어로의 "최근 강의" 한 줄. 같은 날이면 먼저 적힌 것. 비어 있으면 null. */
export function latestCourse<T extends { date: string }>(courses: readonly T[]): T | null {
  let best: T | null = null;
  for (const c of courses) if (best === null || sortKey(c.date) > sortKey(best.date)) best = c;
  return best;
}
