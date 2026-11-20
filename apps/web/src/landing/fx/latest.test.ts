import { describe, expect, it } from 'vitest';

import { LANDING } from '../content/landing';
import { latestCourse } from './latest';

describe('latestCourse — 시작일이 가장 늦은 과정', () => {
  it('비어 있으면 null', () => {
    expect(latestCourse([])).toBeNull();
  });
  it('시작일 기준, 연도만 있는 항목은 그 해 1월 1일로 본다', () => {
    const c = [{ date: '2024', t: 'a' }, { date: '2026.01.13 ~ 03.16', t: 'b' }, { date: '2025.12.01', t: 'c' }];
    expect(latestCourse(c)?.t).toBe('b');
  });
  it('같은 시작일이면 먼저 적힌 것', () => {
    const c = [{ date: '2026.09.28 ~ 10.08', t: 'first' }, { date: '2026.09.28 ~ 10.15', t: 'second' }];
    expect(latestCourse(c)?.t).toBe('first');
  });
  it('실제 content — 2026.10.13 시작 과정', () => {
    expect(latestCourse(LANDING.teaching.courses)?.date).toMatch(/^2026\.10\.13/);
  });
});
