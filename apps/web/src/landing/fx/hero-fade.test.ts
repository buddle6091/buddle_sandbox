import { describe, expect, it } from 'vitest';

import { heroFade } from './hero-fade';

describe('heroFade — 히어로 이름의 스크롤 축소', () => {
  it('맨 위에서는 그대로', () => {
    expect(heroFade(0)).toEqual({ scale: 1, opacity: 1 });
  });
  it('range 끝에서 scale .94 · opacity .35, 그 뒤는 고정', () => {
    expect(heroFade(480).scale).toBeCloseTo(0.94);
    expect(heroFade(480).opacity).toBeCloseTo(0.35);
    expect(heroFade(9999)).toEqual(heroFade(480));
  });
  it('중간은 선형, 음수 스크롤(바운스)은 클램프', () => {
    expect(heroFade(240).scale).toBeCloseTo(0.97);
    expect(heroFade(-50)).toEqual({ scale: 1, opacity: 1 });
  });
});
