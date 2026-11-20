/**
 * Liquid glass(렌즈 굴절 유리) 순수 계산 — GlassSurface 가 쓴다. DOM 없이 Vitest 로 고정한다.
 *
 * 굴절은 SVG `feDisplacementMap` 이 한다. 변위 지도(displacement map)는 요소 크기에 맞춘 SVG 이미지:
 *   R 채널 = 가로 위치(왼쪽 0 → 오른쪽 255), G 채널 = 세로 위치(위 0 → 아래 255)
 *   가운데는 중립 회색(128 = 변위 0)을 흐린 둥근 사각형으로 덮는다.
 * → 가장자리일수록 배경이 바깥쪽에서 끌려와 휘어 보이고(볼록 렌즈), 가운데는 그대로 보인다.
 * 지도 안의 색 이름(black · red · lime · gray)은 화면 색이 아니라 **채널 값**이다(디자인 토큰 대상 아님).
 */
export type GlassVariant = 'pill' | 'circle';

export const clamp01 = (n: number) => (Number.isFinite(n) ? Math.min(1, Math.max(0, n)) : 0);

/** 렌즈 세기(0~1) → feDisplacementMap scale(px). 원형 버튼은 같은 세기에서 더 강하게 휜다. */
export function lensScale(intensity: number, variant: GlassVariant): number {
  const i = clamp01(intensity);
  const base = variant === 'circle' ? 28 : 16;
  const range = variant === 'circle' ? 72 : 48;
  return Math.round(base + range * i);
}

/** 굴절 띠 폭(px) — 짧은 변의 22%, 최소 6 · 최대 28. 반지름보다 넓을 수 없다. */
export function lensEdge(width: number, height: number): number {
  const short = Math.max(0, Math.min(width, height));
  return Math.round(Math.min(short / 2, Math.max(6, Math.min(28, short * 0.22))));
}

const n = (v: number) => String(Math.round(v * 100) / 100);

/** 변위 지도 SVG(data URI). 크기가 0 이하면 빈 문자열(아직 재지 못함 → 렌즈를 켜지 않는다). */
export function lensMapUrl(width: number, height: number, variant: GlassVariant): string {
  if (!(width > 0 && height > 0)) return '';
  const w = Math.round(width);
  const h = Math.round(height);
  const r = variant === 'circle' ? Math.min(w, h) / 2 : h / 2;
  const e = lensEdge(w, h);
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">` +
    `<defs>` +
    `<linearGradient id="x" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="black"/><stop offset="1" stop-color="red"/></linearGradient>` +
    `<linearGradient id="y" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="black"/><stop offset="1" stop-color="lime"/></linearGradient>` +
    `<filter id="b" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="${n(e / 2.5)}"/></filter>` +
    `</defs>` +
    `<rect width="${w}" height="${h}" fill="black"/>` +
    `<rect width="${w}" height="${h}" rx="${n(r)}" fill="url(#x)"/>` +
    `<rect width="${w}" height="${h}" rx="${n(r)}" fill="url(#y)" style="mix-blend-mode:screen"/>` +
    `<rect x="${e}" y="${e}" width="${Math.max(0, w - 2 * e)}" height="${Math.max(0, h - 2 * e)}" rx="${n(Math.max(0, r - e))}" fill="gray" filter="url(#b)"/>` +
    `</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/** 활성 glow(0~1) → 층 투명도. 글자 대비(4.5:1)를 지키려고 최대 0.55 에서 자른다. 0 이면 층을 그리지 않는다. */
export function glowOpacity(level: number): number {
  return Math.round(clamp01(level) * 0.55 * 1000) / 1000;
}

/** useId 결과(`«r1»`, `_r_1_` 등)를 SVG id · url(#…) 에 안전한 문자로 */
export function filterId(reactId: string): string {
  return `liquid-${reactId.replace(/[^a-zA-Z0-9_-]/g, '')}`;
}
