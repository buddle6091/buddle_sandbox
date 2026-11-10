import { describe, expect, it } from 'vitest';

import { magnetOffset, magnetStyle } from './magnet';

describe('magnetOffset — 자석 버튼 끌림', () => {
  it('중심이면 0, 반경 밖이면 0', () => {
    expect(magnetOffset(0, 0, 80)).toEqual({ x: 0, y: 0 });
    expect(magnetOffset(100, 0, 80)).toEqual({ x: 0, y: 0 });
    expect(magnetOffset(10, 10, 0)).toEqual({ x: 0, y: 0 });
  });
  it('반경 안이면 거리 × strength, 방향 유지', () => {
    expect(magnetOffset(20, -12, 80, 0.25)).toEqual({ x: 5, y: -3 });
  });
  it('한 축 최대 max 로 클램프', () => {
    expect(magnetOffset(70, -70, 200, 0.5, 8)).toEqual({ x: 8, y: -8 });
  });
});

describe('magnetStyle', () => {
  it('0 이면 빈 문자열(인라인 transform 제거), 아니면 translate3d', () => {
    expect(magnetStyle({ x: 0, y: 0 })).toBe('');
    expect(magnetStyle({ x: 5, y: -3 })).toBe('translate3d(5.0px, -3.0px, 0)');
  });
});
