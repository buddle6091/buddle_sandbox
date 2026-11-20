import { describe, expect, it } from 'vitest';

import { SHARDS } from './shards';

describe('SHARDS — 히어로 사선 광선(slash.page 실측: 1px · rotate 25° · 4개 · 정적)', () => {
  it('4개, 전부 우측 상단 영역에, 투명도는 .3 이하', () => {
    expect(SHARDS).toHaveLength(4);
    for (const s of SHARDS) {
      expect(s.right).toBeGreaterThanOrEqual(0);
      expect(s.right).toBeLessThanOrEqual(40);
      expect(s.height).toBeGreaterThan(0);
      expect(s.opacity).toBeLessThanOrEqual(0.3);
    }
  });
});
