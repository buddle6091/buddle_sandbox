import { describe, expect, it } from 'vitest';

import { stackCard, stackProgress } from './stack';

describe('stackProgress — 섹션 안에서 스테이지가 sticky 로 머무는 구간의 진행도 0~1', () => {
  const vh = 1000;
  it('섹션 top 이 뷰포트 top 에 닿기 전엔 0, 섹션 끝(높이 − vh)에서 1', () => {
    // sectionTop 은 문서 기준 px, 섹션 높이 3200(=320vh), 스크롤 위치 scrollY
    expect(stackProgress(5000, 3200, vh, 0)).toBe(0);
    expect(stackProgress(5000, 3200, vh, 5000)).toBe(0);
    expect(stackProgress(5000, 3200, vh, 5000 + 1100)).toBeCloseTo(0.5);
    expect(stackProgress(5000, 3200, vh, 5000 + 2200)).toBe(1);
    expect(stackProgress(5000, 3200, vh, 99999)).toBe(1);
  });
  it('섹션이 뷰포트보다 낮으면(스크롤 구간 0) 1 — 0 으로 나누지 않는다', () => {
    expect(stackProgress(0, 800, vh, 0)).toBe(1);
  });
});

describe('stackCard — 카드 i/n 의 위치·투명도·크기', () => {
  it('p=0 → 0번 카드만 보인다', () => {
    expect([0, 1, 2, 3, 4].map((i) => stackCard(i, 5, 0).opacity)).toEqual([1, 0, 0, 0, 0]);
  });
  it('p=1 → 전부 보인다', () => {
    for (let i = 0; i < 5; i++) expect(stackCard(i, 5, 1).opacity).toBe(1);
  });
  it('카드 i 는 p ∈ [i/n, (i+.6)/n] 에서 0→1 로 올라가고, 단조증가', () => {
    const n = 5;
    const i = 2;
    expect(stackCard(i, n, i / n).opacity).toBe(0);
    expect(stackCard(i, n, (i + 0.3) / n).opacity).toBeCloseTo(0.5);
    expect(stackCard(i, n, (i + 0.6) / n).opacity).toBe(1);
    let prev = -1;
    for (let p = 0; p <= 1.0001; p += 0.01) {
      const o = stackCard(i, n, p).opacity;
      expect(o).toBeGreaterThanOrEqual(prev);
      prev = o;
    }
  });
  it('부채꼴 오프셋: x = 4%·i, y = −75% + 15%·i (slash 보다 30% 위 — 스테이지 안에 다 들어오게)', () => {
    expect(stackCard(0, 5, 1)).toMatchObject({ x: 0, y: -75 });
    expect(stackCard(3, 5, 1)).toMatchObject({ x: 12, y: -30 });
  });
  it('활성 카드(가장 최근 등장) 뒤로 갈수록 scale 이 2% 씩 줄고 0.9 아래로는 안 간다', () => {
    expect(stackCard(4, 5, 1).scale).toBe(1);
    expect(stackCard(3, 5, 1).scale).toBeCloseTo(0.98);
    expect(stackCard(0, 5, 1).scale).toBeCloseTo(0.92);
    expect(stackCard(0, 20, 1).scale).toBe(0.9);
  });
  it('p 가 범위를 벗어나도 클램프', () => {
    expect(stackCard(0, 5, -1).opacity).toBe(1);
    expect(stackCard(4, 5, 2).opacity).toBe(1);
  });
});
