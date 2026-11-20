/**
 * 숫자 섹션 스파크라인 — 주요 과정(content `teaching.courses`)의 시작일 순 누적 강의 시간.
 * 축 숫자는 그리지 않는다(이력서에 없는 수치를 만들지 않기 위해, apps/web 규칙 5). 추세만.
 * 경로는 slash.page 와 같은 1/3 지점 제어점 큐빅 베지어(viewBox 1000×200).
 */
export type CourseLike = { date: string; hours: string };
export type CumulativePoint = { key: string; total: number };

/** "64h" · "28.5h" · "6h+" → 숫자. 숫자가 없으면 0. */
export function parseHours(hours: string): number {
  const m = hours.match(/\d+(?:\.\d+)?/);
  return m ? Number(m[0]) : 0;
}

/** 날짜 문자열의 시작일 → "YYYY.MM.DD" 정렬 키. "2024" 처럼 연도만 있으면 그 해 1월 1일. */
export function sortKey(date: string): string {
  const full = date.match(/^(\d{4})\.(\d{2})\.(\d{2})/);
  if (full) return `${full[1]}.${full[2]}.${full[3]}`;
  const year = date.match(/^(\d{4})/);
  return year ? `${year[1]}.01.01` : date;
}

/** 시작일 순으로 정렬 · 같은 시작일 합산 · 누적. */
export function cumulativeByDate(courses: readonly CourseLike[]): CumulativePoint[] {
  const byKey = new Map<string, number>();
  for (const c of courses) {
    const k = sortKey(c.date);
    byKey.set(k, (byKey.get(k) ?? 0) + parseHours(c.hours));
  }
  const keys = [...byKey.keys()].sort();
  let total = 0;
  return keys.map((key) => {
    total += byKey.get(key) ?? 0;
    return { key, total };
  });
}

const fmt = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(2).replace(/\.?0+$/, ''));

/** 값 배열 → 점 좌표. 값이 클수록 위(y 작음). 전부 같은 값이면 바닥선. 1개면 x=0. */
export function sparklinePoints(values: readonly number[], width = 1000, height = 200, pad = 8): Array<readonly [number, number]> {
  if (values.length === 0) return [];
  const max = Math.max(...values);
  const min = Math.min(...values);
  const span = max - min;
  const innerH = height - pad * 2;
  const y = (v: number) => (span === 0 ? height - pad : height - pad - ((v - min) / span) * innerH);
  const step = values.length > 1 ? width / (values.length - 1) : 0;
  return values.map((v, i) => [i * step, y(v)] as const);
}

/** 값 배열 → SVG path d. 값 1개면 수평선. */
export function sparklinePath(values: readonly number[], width = 1000, height = 200, pad = 8): string {
  const pts = sparklinePoints(values, width, height, pad);
  if (pts.length === 0) return '';
  if (pts.length === 1) return `M0,${fmt(pts[0][1])} L${fmt(width)},${fmt(pts[0][1])}`;
  let d = `M${fmt(pts[0][0])},${fmt(pts[0][1])}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    const cx = (x1 - x0) / 3;
    d += ` C${fmt(x0 + cx)},${fmt(y0)} ${fmt(x1 - cx)},${fmt(y1)} ${fmt(x1)},${fmt(y1)}`;
  }
  return d;
}

/**
 * 스크럽 — 선 위 각 점(시작일)에 해당하는 과정들. 표시에는 과정의 원래 값(날짜·제목·시간)만 쓴다.
 * 누적 합은 선의 높이로만 쓰고 숫자로 보여주지 않는다(규칙 5).
 */
export type ScrubPoint<T> = { key: string; total: number; courses: T[] };

export function scrubPoints<T extends CourseLike>(courses: readonly T[]): ScrubPoint<T>[] {
  return cumulativeByDate(courses).map((p) => ({ ...p, courses: courses.filter((c) => sortKey(c.date) === p.key) }));
}

/** 가로 비율(0~1) → 가장 가까운 점 index. n 이 0 이면 -1. */
export function nearestIndex(ratio: number, n: number): number {
  if (n <= 0) return -1;
  if (n === 1) return 0;
  const r = Math.min(1, Math.max(0, ratio));
  return Math.round(r * (n - 1));
}
