/**
 * 토큰 → Three.js 색. hex 하드코딩 대신 문서의 CSS 변수를 읽는다(라이트/다크 자동).
 * color-mix() 토큰은 브라우저가 계산한 값을 얻기 위해 프로브 엘리먼트의 computed color 를 읽는다.
 */
export type Palette = {
  page: string;
  /** 백자 기물 — 모드와 무관하게 설백(gray/0). 컴포넌트가 primitive 를 읽는 유일한 예외(백자는 다크에서도 희다) */
  jar: string;
  accent: string;
  celadon: string;
  violet: string;
  ink: string;
  dark: boolean;
};

const TOKENS: Record<Exclude<keyof Palette, 'dark'>, string> = {
  page: '--bs-color-bg-page',
  jar: '--bs-color-gray-0',
  accent: '--bs-color-accent-default',
  celadon: '--bs-color-accent-tertiary',
  violet: '--bs-color-accent-secondary',
  ink: '--bs-color-fg-default',
};

export function readPalette(root: HTMLElement = document.documentElement): Palette {
  const probe = document.createElement('span');
  probe.style.position = 'absolute';
  probe.style.visibility = 'hidden';
  root.appendChild(probe);
  const out = {} as Palette;
  for (const key of Object.keys(TOKENS) as Array<keyof typeof TOKENS>) {
    probe.style.color = `var(${TOKENS[key]})`;
    out[key] = getComputedStyle(probe).color || 'rgb(66 117 255)';
  }
  probe.remove();
  // 다크 판정: 페이지 배경 밝기
  const m = out.page.match(/\d+(\.\d+)?/g)?.map(Number) ?? [255, 255, 255];
  out.dark = (m[0] + m[1] + m[2]) / 3 < 128;
  return out;
}
