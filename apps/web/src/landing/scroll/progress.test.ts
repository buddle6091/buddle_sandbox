import { describe, expect, it } from 'vitest';

import { SECTION_IDS } from '../content/landing';
import {
  KEYFRAMES,
  SECTION_RANGES,
  clamp01,
  computeProgress,
  sample,
  sectionAt,
  sectionLocal,
  shouldRender3D,
  snapSample,
} from './progress';

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

describe('섹션 구간', () => {
  it('SECTION_RANGES 는 content 의 섹션 순서와 같고, 0 에서 1 까지 빈틈 없이 이어진다', () => {
    expect(SECTION_RANGES.map((r) => r.id)).toEqual([...SECTION_IDS]);
    expect(SECTION_RANGES[0].from).toBe(0);
    expect(SECTION_RANGES.at(-1)?.to).toBe(1);
    for (let i = 1; i < SECTION_RANGES.length; i++) {
      expect(SECTION_RANGES[i].from).toBe(SECTION_RANGES[i - 1].to);
    }
  });

  it('sectionAt — 진행도가 속한 섹션 인덱스', () => {
    expect(sectionAt(0)).toBe(0);
    expect(sectionAt(SECTION_RANGES[2].from)).toBe(2);
    expect(sectionAt(0.999)).toBe(SECTION_RANGES.length - 1);
    expect(sectionAt(1)).toBe(SECTION_RANGES.length - 1);
  });

  it('sectionLocal — 섹션 안의 0~1 진행도, 바깥은 클램프', () => {
    const r = SECTION_RANGES[1];
    const mid = (r.from + r.to) / 2;
    expect(sectionLocal(r.from, r)).toBe(0);
    expect(sectionLocal(mid, r)).toBeCloseTo(0.5);
    expect(sectionLocal(r.to, r)).toBe(1);
    expect(sectionLocal(r.from - 0.1, r)).toBe(0);
    expect(sectionLocal(r.to + 0.1, r)).toBe(1);
  });
});

describe('sample — 키프레임 보간', () => {
  it('키프레임은 섹션마다 하나, at 은 단조 증가하고 0 에서 시작해 1 로 끝난다', () => {
    expect(KEYFRAMES).toHaveLength(SECTION_IDS.length);
    expect(KEYFRAMES[0].at).toBe(0);
    expect(KEYFRAMES.at(-1)?.at).toBe(1);
    for (let i = 1; i < KEYFRAMES.length; i++) {
      expect(KEYFRAMES[i].at).toBeGreaterThan(KEYFRAMES[i - 1].at);
    }
  });

  it('키 위치에서는 정확히 그 키 값, 사이에서는 양쪽 사이 값', () => {
    const k0 = KEYFRAMES[0];
    const k1 = KEYFRAMES[1];
    expect(sample(KEYFRAMES, k0.at)).toEqual(k0);
    expect(sample(KEYFRAMES, k1.at)).toEqual(k1);
    const mid = sample(KEYFRAMES, (k0.at + k1.at) / 2);
    for (let i = 0; i < 3; i++) {
      const lo = Math.min(k0.camera[i], k1.camera[i]);
      const hi = Math.max(k0.camera[i], k1.camera[i]);
      expect(mid.camera[i]).toBeGreaterThanOrEqual(lo);
      expect(mid.camera[i]).toBeLessThanOrEqual(hi);
    }
    expect(mid.jar.rot).toBeGreaterThanOrEqual(Math.min(k0.jar.rot, k1.jar.rot));
    expect(mid.jar.rot).toBeLessThanOrEqual(Math.max(k0.jar.rot, k1.jar.rot));
  });

  it('범위 밖은 양 끝 키로 클램프', () => {
    expect(sample(KEYFRAMES, -1)).toEqual(KEYFRAMES[0]);
    expect(sample(KEYFRAMES, 2)).toEqual(KEYFRAMES.at(-1));
  });

  it('유약 고임(glaze)은 마지막 섹션에서 1 에 도달한다 (contact: pool 차오름)', () => {
    expect(sample(KEYFRAMES, 1).glaze).toBe(1);
    expect(sample(KEYFRAMES, 0).glaze).toBeLessThan(0.5);
  });

  it('snapSample — reduced-motion: 섹션 키프레임으로 스냅, 보간 없음', () => {
    const r = SECTION_RANGES[3];
    const mid = (r.from + r.to) / 2;
    expect(snapSample(KEYFRAMES, mid)).toEqual(KEYFRAMES[3]);
  });

  it('카메라는 항상 기물 앞(z > 0)에 있어 뒤집히지 않는다', () => {
    for (let p = 0; p <= 1; p += 0.05) {
      expect(sample(KEYFRAMES, p).camera[2]).toBeGreaterThan(0);
    }
  });
});

describe('shouldRender3D', () => {
  it('WebGL 이 없으면 렌더하지 않는다', () => {
    expect(shouldRender3D({ webgl: false, reducedMotion: false, compact: false })).toBe(false);
  });
  it('reduced-motion 이어도 정지 프레임은 렌더한다(mode: static)', () => {
    expect(shouldRender3D({ webgl: true, reducedMotion: true, compact: false })).toBe('static');
  });
  it('compact 는 lite, 그 외 full', () => {
    expect(shouldRender3D({ webgl: true, reducedMotion: false, compact: true })).toBe('lite');
    expect(shouldRender3D({ webgl: true, reducedMotion: false, compact: false })).toBe('full');
  });
});
