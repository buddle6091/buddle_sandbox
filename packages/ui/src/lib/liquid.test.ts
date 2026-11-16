import { describe, expect, it } from 'vitest';

import { clamp01, filterId, glowOpacity, lensEdge, lensMapUrl, lensScale } from './liquid';

const decode = (url: string) => decodeURIComponent(url.replace('data:image/svg+xml;charset=utf-8,', ''));

describe('lensScale — 렌즈 세기 → 변위 scale', () => {
  it('세기 0 · 1 의 양 끝, 범위 밖은 클램프', () => {
    expect(lensScale(0, 'pill')).toBe(16);
    expect(lensScale(1, 'pill')).toBe(64);
    expect(lensScale(5, 'pill')).toBe(64);
    expect(lensScale(-1, 'pill')).toBe(16);
    expect(lensScale(Number.NaN, 'pill')).toBe(16);
  });
  it('원형은 같은 세기에서 pill 보다 강하다(내부 버튼 = 더 강한 렌즈)', () => {
    for (const i of [0, 0.3, 0.6, 1]) expect(lensScale(i, 'circle')).toBeGreaterThan(lensScale(i, 'pill'));
  });
});

describe('lensEdge — 굴절 띠 폭', () => {
  it('짧은 변의 22%, 6~28 사이', () => {
    expect(lensEdge(300, 56)).toBe(12);
    expect(lensEdge(40, 20)).toBe(6);
    expect(lensEdge(800, 400)).toBe(28);
  });
  it('반지름(짧은 변 / 2)을 넘지 않는다', () => {
    expect(lensEdge(8, 8)).toBe(4);
    expect(lensEdge(0, 0)).toBe(0);
  });
});

describe('lensMapUrl — 변위 지도', () => {
  it('크기를 아직 모르면 빈 문자열', () => {
    expect(lensMapUrl(0, 40, 'pill')).toBe('');
    expect(lensMapUrl(120, Number.NaN, 'pill')).toBe('');
  });
  it('요소 크기 그대로의 SVG data URI, R=가로 · G=세로 그라디언트 + 가운데 중립 회색', () => {
    const svg = decode(lensMapUrl(300, 56, 'pill'));
    expect(svg).toContain('width="300" height="56" viewBox="0 0 300 56"');
    expect(svg).toContain('stop-color="red"');
    expect(svg).toContain('stop-color="lime"');
    expect(svg).toContain('mix-blend-mode:screen');
    // pill 반지름 = 높이 / 2, 중립 회색은 굴절 띠(12)만큼 안쪽
    expect(svg).toMatch(/rx="28" fill="url\(#x\)"/);
    expect(svg).toContain('<rect x="12" y="12" width="276" height="32" rx="16" fill="gray"');
  });
  it('원형은 짧은 변 기준 반지름', () => {
    const svg = decode(lensMapUrl(48, 48, 'circle'));
    expect(svg).toMatch(/rx="24" fill="url\(#x\)"/);
  });
  it('디자인 색(hex · rgb)을 쓰지 않는다 — 채널 이름만', () => {
    const svg = decode(lensMapUrl(200, 40, 'pill'));
    expect(svg).not.toMatch(/#[0-9a-fA-F]{3,8}\b(?![^"]*\))/);
    expect(svg).not.toMatch(/rgba?\(/);
  });
});

describe('glowOpacity · clamp01 · filterId', () => {
  it('glow 는 0~0.55 로 비례, 0 이면 0', () => {
    expect(glowOpacity(0)).toBe(0);
    expect(glowOpacity(1)).toBe(0.55);
    expect(glowOpacity(0.5)).toBe(0.275);
    expect(glowOpacity(9)).toBe(0.55);
  });
  it('clamp01 은 NaN 을 0 으로', () => {
    expect(clamp01(Number.NaN)).toBe(0);
    expect(clamp01(0.4)).toBe(0.4);
  });
  it('filterId 는 SVG id 에 안전한 문자만', () => {
    expect(filterId('«r12»')).toBe('liquid-r12');
    expect(filterId('_r_6_')).toBe('liquid-_r_6_');
    expect(filterId(':r1:')).toBe('liquid-r1');
  });
});
