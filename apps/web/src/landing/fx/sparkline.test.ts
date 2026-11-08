import { describe, expect, it } from 'vitest';

import { cumulativeByDate, parseHours, sortKey, sparklinePath } from './sparkline';

describe('parseHours — content 의 hours 문자열("64h" · "28.5h" · "6h+") → 숫자', () => {
  it('정수 · 소수 · 접미 + 를 모두 숫자로', () => {
    expect(parseHours('64h')).toBe(64);
    expect(parseHours('28.5h')).toBe(28.5);
    expect(parseHours('6h+')).toBe(6);
  });
  it('숫자가 없으면 0', () => {
    expect(parseHours('미정')).toBe(0);
  });
});

describe('sortKey — 날짜 문자열 앞부분으로 정렬 키', () => {
  it('"YYYY.MM.DD ~ …" 는 시작일, "YYYY" 만 있으면 그 해 1월 1일', () => {
    expect(sortKey('2026.09.28 ~ 10.08')).toBe('2026.09.28');
    expect(sortKey('2024')).toBe('2024.01.01');
  });
});

describe('cumulativeByDate — 시작일 순 누적 시간', () => {
  const courses = [
    { date: '2026.09.28 ~ 10.08', hours: '64h' },
    { date: '2024', hours: '40h' },
    { date: '2026.09.28 ~ 10.15', hours: '6h+' },
    { date: '2026.01.13 ~ 03.16', hours: '20h' },
  ];
  it('날짜순으로 정렬되고 단조증가하며, 마지막 값은 전체 합', () => {
    const out = cumulativeByDate(courses);
    expect(out.map((p) => p.key)).toEqual(['2024.01.01', '2026.01.13', '2026.09.28']);
    for (let i = 1; i < out.length; i++) expect(out[i].total).toBeGreaterThanOrEqual(out[i - 1].total);
    expect(out.at(-1)?.total).toBe(130);
  });
  it('같은 시작일은 한 점으로 합산된다', () => {
    const out = cumulativeByDate(courses);
    expect(out.find((p) => p.key === '2026.09.28')?.total).toBe(130);
    expect(out).toHaveLength(3);
  });
});

describe('sparklinePath — viewBox 1000×200 큐빅 경로(slash 식 1/3 제어점)', () => {
  it('M 으로 시작하고 점 수 − 1 개의 C 세그먼트', () => {
    const d = sparklinePath([0, 10, 30, 60]);
    expect(d.startsWith('M')).toBe(true);
    expect(d.match(/C/g)?.length).toBe(3);
  });
  it('첫 점은 좌측 하단, 마지막 점은 우측 상단(값이 클수록 y 가 작다)', () => {
    const d = sparklinePath([0, 100], 1000, 200, 8);
    expect(d).toMatch(/^M0,192/);
    expect(d).toMatch(/1000,8$/);
  });
  it('값이 1개면 수평선 하나', () => {
    const d = sparklinePath([42], 1000, 200, 8);
    expect(d).toBe('M0,192 L1000,192');
  });
  it('모든 값이 같으면 수평선(0 으로 나누지 않는다)', () => {
    const d = sparklinePath([5, 5, 5]);
    expect(d).not.toContain('NaN');
  });
});
