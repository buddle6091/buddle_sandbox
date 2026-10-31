import { describe, expect, it } from 'vitest';

import { tiltFor, tiltFromPointer } from './tilt';

describe('tiltFor — 카드 안 정규화 좌표(−.5~.5) → rotateX/rotateY(deg)', () => {
  it('중앙은 0, 우하단으로 갈수록 rotateY +, rotateX −', () => {
    expect(tiltFor(0, 0)).toEqual({ rotateX: 0, rotateY: 0 });
    const t = tiltFor(0.5, 0.5);
    expect(t.rotateY).toBeCloseTo(6); // x·12
    expect(t.rotateX).toBeCloseTo(-5); // −y·10
  });
  it('범위 밖 입력은 ±.5 로 클램프', () => {
    expect(tiltFor(3, -3)).toEqual({ rotateX: 5, rotateY: 6 });
  });
});

describe('tiltFromPointer — 포인터 좌표와 요소 rect 로', () => {
  it('rect 중앙 → 0', () => {
    const rect = { left: 100, top: 100, width: 200, height: 100 };
    expect(tiltFromPointer(200, 150, rect)).toEqual({ rotateX: 0, rotateY: 0 });
    expect(tiltFromPointer(300, 200, rect)).toEqual(tiltFor(0.5, 0.5));
  });
});
