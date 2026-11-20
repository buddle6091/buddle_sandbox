/**
 * 강의 이력 필터 — 대상(target) · 산업군(industry) 두 축. 둘 다 null 이면 전체.
 * 산업군 막대(audience.bars)와 강의 행(teaching.courses)을 잇는 순수 함수(v3, 2026-11-10).
 * 새 수치를 만들지 않는다 — 기존 행을 고르기만 한다(apps/web 규칙 5).
 */
export type CourseFilter = { target: string | null; industry: string | null };
export const NO_FILTER: CourseFilter = { target: null, industry: null };

type CourseKeys = { target: string; industry: string };

export function filterCourses<T extends CourseKeys>(courses: readonly T[], f: CourseFilter): T[] {
  return courses.filter((c) => (f.target === null || c.target === f.target) && (f.industry === null || c.industry === f.industry));
}

/** 대상 목록 — 처음 나온 순서, 중복 없음 */
export function targetsOf(courses: readonly CourseKeys[]): string[] {
  return [...new Set(courses.map((c) => c.target))];
}

/** 막대 이름 → 그 산업군의 강의 행 수. 행이 없는 막대는 들어가지 않는다(누를 수 없는 막대). */
export function courseCountByIndustry(barNames: readonly string[], courses: readonly CourseKeys[]): Map<string, number> {
  const out = new Map<string, number>();
  for (const name of barNames) {
    const n = courses.filter((c) => c.industry === name).length;
    if (n > 0) out.set(name, n);
  }
  return out;
}

export function isFiltered(f: CourseFilter) {
  return f.target !== null || f.industry !== null;
}

/** 결과 수 안내(aria-live) */
export function countLabel(shown: number, total: number) {
  return shown === total ? `전체 ${total}개` : `${total}개 중 ${shown}개`;
}
