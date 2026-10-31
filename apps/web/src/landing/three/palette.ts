/**
 * 토큰 → Three.js 색. hex 하드코딩 대신 문서의 CSS 변수를 읽는다(라이트/다크 자동).
 * 프로브 엘리먼트의 computed color 를 읽어 `#rrggbb` 로 정규화한다(three 의 Color.set 이 확실히 받는 형식).
 * 3D 재질은 디자인 콘셉트(백자/청자/흑요석)에 묶여 있어 일부 primitive 를 직접 읽는다 — 허용된 유일한 예외(README 토큰 매핑).
 */
export type Palette = {
  page: string;
  accent: string;
  celadon: string;
  violet: string;
  /** 청자 유약 안쪽(celadon/100) — 라이트 방울의 바탕 */
  celadonInner: string;
  /** 흑요석 두 단계 — 다크 구체의 바탕 */
  obsidian: string;
  obsidianGlaze: string;
  /** 하이라이트 — 알파 베이스 전용 primitive(white) */
  highlight: string;
  dark: boolean;
};

const TOKENS: Record<Exclude<keyof Palette, 'dark'>, string> = {
  page: '--bs-color-bg-page',
  accent: '--bs-color-accent-default',
  celadon: '--bs-color-accent-tertiary',
  violet: '--bs-color-accent-secondary',
  celadonInner: '--bs-color-celadon-100',
  obsidian: '--bs-color-obsidian-ink',
  obsidianGlaze: '--bs-color-obsidian-glaze',
  highlight: '--bs-color-white',
};

/** `rgb(r g b)` · `rgb(r, g, b)` · `rgba(...)` → `#rrggbb`. 못 읽으면 폴백(벽청) */
export function toHex(css: string, fallback = '#4275ff') {
  const m = css.match(/\d+(\.\d+)?/g);
  if (!m || m.length < 3) return fallback;
  const [r, g, b] = m.slice(0, 3).map((n) => Math.max(0, Math.min(255, Math.round(Number(n)))));
  return `#${[r, g, b].map((n) => n.toString(16).padStart(2, '0')).join('')}`;
}

export function readPalette(root: HTMLElement = document.documentElement): Palette {
  const probe = document.createElement('span');
  probe.style.position = 'absolute';
  probe.style.visibility = 'hidden';
  root.appendChild(probe);
  const out = {} as Palette;
  for (const key of Object.keys(TOKENS) as Array<keyof typeof TOKENS>) {
    probe.style.color = `var(${TOKENS[key]})`;
    out[key] = toHex(getComputedStyle(probe).color);
  }
  probe.remove();
  const m = out.page.slice(1).match(/.{2}/g)?.map((h) => parseInt(h, 16)) ?? [255, 255, 255];
  out.dark = (m[0] + m[1] + m[2]) / 3 < 128;
  return out;
}
