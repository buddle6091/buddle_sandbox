import { describe, expect, it } from 'vitest';

import { clamp01, computeProgress } from './progress';

describe('computeProgress — scrollY / (scrollHeight - innerHeight)', () => {
  it('문서 맨 위 0, 맨 아래 1, 중간은 비율', () => {
    expect(computeProgress(0, 5000, 1000)).toBe(0);
    expect(computeProgress(4000, 5000, 1000)).toBe(1);
    expect(computeProgress(2000, 5000, 1000)).toBe(0.5);
  });

  it('스크롤할 수 없는 문서(높이 ≤ 뷰포트)는 0', () => {
    expect(computeProgress(0, 800, 1000)).toBe(0);
    expect(computeProgress(100, 1000, 1000)).toBe(0);
  });

  it('범위 밖(바운스 스크롤)은 0~1 로 클램프', () => {
    expect(computeProgress(-50, 5000, 1000)).toBe(0);
    expect(computeProgress(9000, 5000, 1000)).toBe(1);
    expect(clamp01(Number.NaN)).toBe(0);
  });
});
