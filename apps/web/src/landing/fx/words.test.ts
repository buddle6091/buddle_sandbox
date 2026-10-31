import { describe, expect, it } from 'vitest';

import { isLit, wordProgress } from './words';

describe('wordProgress — 문장 블록의 뷰포트 위치 → 0~1', () => {
  const vh = 1000;
  it('블록 top 이 뷰포트 80% 지점에 오면 0, 위로 올라갈수록 커진다', () => {
    expect(wordProgress({ top: 800, height: 200 }, vh)).toBe(0);
    expect(wordProgress({ top: 1200, height: 200 }, vh)).toBe(0); // 아직 아래
    const a = wordProgress({ top: 600, height: 200 }, vh);
    const b = wordProgress({ top: 400, height: 200 }, vh);
    expect(a).toBeGreaterThan(0);
    expect(b).toBeGreaterThan(a);
  });

  it('분모 = height·.6 + vh·.2 — top 이 그만큼 위로 가면 1', () => {
    // height 200 → 분모 120 + 200 = 320 → top = 800 − 320 = 480 에서 1
    expect(wordProgress({ top: 480, height: 200 }, vh)).toBeCloseTo(1);
    expect(wordProgress({ top: 0, height: 200 }, vh)).toBe(1);
  });
});

describe('isLit — i/n < progress 인 단어만 밝다', () => {
  it('progress 0 은 전부 어둡고, 1 은 전부 밝다', () => {
    expect([0, 1, 2].map((i) => isLit(i, 3, 0))).toEqual([false, false, false]);
    expect([0, 1, 2].map((i) => isLit(i, 3, 1))).toEqual([true, true, true]);
  });
  it('progress .5 → 앞 절반', () => {
    expect([0, 1, 2, 3].map((i) => isLit(i, 4, 0.5))).toEqual([true, true, false, false]);
  });
});
