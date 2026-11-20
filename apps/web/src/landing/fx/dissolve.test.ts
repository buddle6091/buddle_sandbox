import { describe, expect, it } from 'vitest';

import { heroDissolve } from './dissolve';

describe('heroDissolve', () => {
  it('맨 위에서는 그대로', () => {
    expect(heroDissolve(0, 800)).toEqual({ opacity: 1, shift: 0 });
  });
  it('히어로 높이의 80% 를 지나면 완전히 녹는다', () => {
    expect(heroDissolve(640, 800).opacity).toBe(0);
    expect(heroDissolve(2000, 800).opacity).toBe(0);
  });
  it('중간은 선형 · 배경은 스크롤의 30% 만큼만 따라 내려간다(시차)', () => {
    const d = heroDissolve(320, 800);
    expect(d.opacity).toBeCloseTo(0.5);
    expect(d.shift).toBeCloseTo(96);
  });
  it('음수 · 0 높이 · NaN 은 안전한 값', () => {
    expect(heroDissolve(-50, 800)).toEqual({ opacity: 1, shift: 0 });
    expect(heroDissolve(100, 0)).toEqual({ opacity: 1, shift: 0 });
    expect(heroDissolve(Number.NaN, 800)).toEqual({ opacity: 1, shift: 0 });
  });
});
