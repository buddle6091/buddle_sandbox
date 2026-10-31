import { describe, expect, it } from 'vitest';

import { mixToFades, stepMix } from './theme-mix';

describe('stepMix — 테마 mix(0 라이트 ↔ 1 다크) 가 목표로 수렴 (dt·2.2, 약 1초)', () => {
  it('목표 쪽으로 움직이고 넘어가지 않는다', () => {
    const a = stepMix(0, 1, 0.1);
    expect(a).toBeGreaterThan(0);
    expect(a).toBeLessThan(1);
    expect(stepMix(0.999, 1, 0.1)).toBe(1); // 0.001 미만이면 스냅
    expect(stepMix(1, 0, 0.5)).toBeLessThan(1);
  });
  it('약 1초 뒤에는 거의 도달한다 (60fps 시뮬)', () => {
    let m = 0;
    for (let i = 0; i < 60; i++) m = stepMix(m, 1, 1 / 60);
    expect(m).toBeGreaterThan(0.88);
  });
  it('reduced-motion 은 즉시 스냅', () => {
    expect(stepMix(0, 1, 0.016, true)).toBe(1);
  });
  it('dt 는 0.1 로 캡 — 탭 복귀 때 튀지 않는다', () => {
    expect(stepMix(0, 1, 5)).toBe(stepMix(0, 1, 0.1));
  });
});

describe('mixToFades — smoothstep 으로 두 장면의 페이드 · 스케일 · 가시성', () => {
  it('mix 0: 라이트만, mix 1: 다크만', () => {
    const l = mixToFades(0);
    expect(l).toMatchObject({ lf: 1, df: 0, lightVisible: true, darkVisible: false, lightScale: 1, darkScale: 0.8 });
    const d = mixToFades(1);
    expect(d).toMatchObject({ lf: 0, df: 1, lightVisible: false, darkVisible: true, lightScale: 0.85, darkScale: 1 });
  });
  it('중간은 둘 다 보이고 합이 1', () => {
    const m = mixToFades(0.5);
    expect(m.lf + m.df).toBeCloseTo(1);
    expect(m.lightVisible && m.darkVisible).toBe(true);
    expect(m.lightScale).toBeCloseTo(0.925);
    expect(m.darkScale).toBeCloseTo(0.9);
  });
});
