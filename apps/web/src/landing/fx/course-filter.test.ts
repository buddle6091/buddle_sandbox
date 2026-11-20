import { describe, expect, it } from 'vitest';

import { LANDING } from '../content/landing';
import { NO_FILTER, countLabel, courseCountByIndustry, filterCourses, isFiltered, targetsOf } from './course-filter';

const C = [
  { target: '개발자', industry: 'A', title: '1' },
  { target: '임원', industry: 'A', title: '2' },
  { target: '개발자', industry: 'B', title: '3' },
];

describe('filterCourses — 대상 · 산업군 두 축', () => {
  it('필터가 없으면 전부, 순서 유지', () => {
    expect(filterCourses(C, NO_FILTER).map((c) => c.title)).toEqual(['1', '2', '3']);
  });
  it('target 만 / industry 만 / 둘 다(AND)', () => {
    expect(filterCourses(C, { target: '개발자', industry: null }).map((c) => c.title)).toEqual(['1', '3']);
    expect(filterCourses(C, { target: null, industry: 'A' }).map((c) => c.title)).toEqual(['1', '2']);
    expect(filterCourses(C, { target: '임원', industry: 'B' })).toEqual([]);
  });
});

describe('targetsOf · courseCountByIndustry', () => {
  it('대상은 처음 나온 순서 · 중복 없음', () => {
    expect(targetsOf(C)).toEqual(['개발자', '임원']);
  });
  it('강의 행이 있는 막대만 수와 함께 — 없는 막대는 빠진다', () => {
    const m = courseCountByIndustry(['A', 'B', 'Z'], C);
    expect([...m.entries()]).toEqual([['A', 2], ['B', 1]]);
  });
  it('실제 content — 누를 수 있는 막대는 모두 결과가 1건 이상(빈 결과 불가)', () => {
    const bars = LANDING.audience.bars.map((b) => b.name);
    const m = courseCountByIndustry(bars, LANDING.teaching.courses);
    expect(m.size).toBeGreaterThan(0);
    for (const [name, n] of m) {
      expect(filterCourses(LANDING.teaching.courses, { target: null, industry: name })).toHaveLength(n);
    }
  });
});

describe('isFiltered · countLabel', () => {
  it('둘 중 하나라도 있으면 필터 중', () => {
    expect(isFiltered(NO_FILTER)).toBe(false);
    expect(isFiltered({ target: '임원', industry: null })).toBe(true);
  });
  it('전체면 "전체 N개", 걸러지면 "N개 중 M개"', () => {
    expect(countLabel(10, 10)).toBe('전체 10개');
    expect(countLabel(3, 10)).toBe('10개 중 3개');
  });
});
