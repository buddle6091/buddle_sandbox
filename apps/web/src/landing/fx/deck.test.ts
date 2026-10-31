import { describe, expect, it } from 'vitest';

import { deckDistance, deckTransform } from './deck';

describe('deckTransform — 카드 중심 거리 d(−1~1, 뷰포트 폭 단위) → 3D 변형', () => {
  it('중앙 카드(d=0)는 정면 · 깊이 0 · 불투명', () => {
    expect(deckTransform(0)).toEqual({ rotateY: 0, translateZ: 0, opacity: 1 });
  });

  it('좌우 대칭 — rotateY 부호 반대, 나머지 동일', () => {
    const l = deckTransform(-0.5);
    const r = deckTransform(0.5);
    expect(l.rotateY).toBeCloseTo(-r.rotateY);
    expect(l.translateZ).toBeCloseTo(r.translateZ);
    expect(l.opacity).toBeCloseTo(r.opacity);
  });

  it('회전은 ±38° 로, 깊이는 −140 으로, 투명도는 .45 로 클램프', () => {
    const far = deckTransform(3);
    expect(far.rotateY).toBe(-38);
    expect(far.translateZ).toBe(-140);
    expect(far.opacity).toBe(0.45);
    expect(deckTransform(-3).rotateY).toBe(38);
  });

  it('d=0.5 → rotateY −23°, translateZ −70, opacity .65 (시안 계수 46 · 140 · .7)', () => {
    const t = deckTransform(0.5);
    expect(t.rotateY).toBeCloseTo(-23);
    expect(t.translateZ).toBeCloseTo(-70);
    expect(t.opacity).toBeCloseTo(0.65);
  });
});

describe('deckDistance — 카드 중심과 덱 중심의 거리(덱 폭 단위)', () => {
  it('scrollLeft 300, 폭 1000 → 중심 800; 카드 mid 800 → 0, 1300 → .5', () => {
    expect(deckDistance({ scrollLeft: 300, clientWidth: 1000 }, { offsetLeft: 700, offsetWidth: 200 })).toBe(0);
    expect(deckDistance({ scrollLeft: 300, clientWidth: 1000 }, { offsetLeft: 1200, offsetWidth: 200 })).toBe(0.5);
  });
});
