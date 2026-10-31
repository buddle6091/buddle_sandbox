import { describe, expect, it } from 'vitest';

import { barPercent } from './bars';

describe('barPercent — 누적 시간 → 막대 폭 % (최대값 기준)', () => {
  it('최대값은 100, 절반은 50, 소수 첫째 자리', () => {
    expect(barPercent(329, 329)).toBe(100);
    expect(barPercent(164.5, 329)).toBe(50);
    expect(barPercent(35, 329)).toBe(10.6);
  });
  it('0 과 음수·NaN 은 0, 최대 초과는 100 으로 클램프', () => {
    expect(barPercent(0, 329)).toBe(0);
    expect(barPercent(-5, 329)).toBe(0);
    expect(barPercent(Number.NaN, 329)).toBe(0);
    expect(barPercent(500, 329)).toBe(100);
  });
});
