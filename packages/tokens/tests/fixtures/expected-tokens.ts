/**
 * ../../../design.md v0.2 의 토큰 표를 그대로 옮긴 기대값. 이 파일이 계약(contract)의 기준이다.
 * design.md 가 바뀌면 여기부터 고치고, 테스트가 CSS를 따라오게 한다.
 */

/** design.md §1.1 Primitives — 단일 모드 */
export const PRIMITIVES: Record<string, string> = {
  // gray (냉회색)
  'gray-0': '#FDFDFE',
  'gray-50': '#F7F8FB',
  'gray-100': '#EEF0F6',
  'gray-200': '#DFE3ED',
  'gray-300': '#C5CBD9',
  'gray-400': '#98A1B5',
  'gray-500': '#6B7488',
  'gray-600': '#4A5263',
  'gray-700': '#343A47',
  'gray-800': '#22262F',
  'gray-900': '#14171D',
  'gray-950': '#0B0D11',
  // 특수 primitive — semantic 에 raw hex 를 두지 않기 위한 이름
  'gray-550': '#5D6679',
  white: '#FFFFFF',
  black: '#000000',
  // porcelain (라이트 표면)
  'porcelain-snow': '#FDFDFE',
  'porcelain-milk': '#F7F9FD',
  'porcelain-ash': '#EEF2F9',
  'porcelain-blue': '#E6EDF6',
  'porcelain-page': '#F4F6FB',
  // obsidian (다크 표면)
  'obsidian-ink': '#0B0E16',
  'obsidian-glaze': '#131826',
  'obsidian-ash': '#1B2233',
  'obsidian-foot': '#252E42',
  'obsidian-panel': '#161A22',
  // blue (벽청 — primary)
  'blue-50': '#EEF3FF',
  'blue-100': '#DDE7FF',
  'blue-200': '#C2D2FF',
  'blue-300': '#9BB4FF',
  'blue-400': '#6E93FF',
  'blue-500': '#4275FF',
  'blue-600': '#2F5CE6',
  'blue-700': '#2447B4',
  'blue-800': '#1E3A8C',
  'blue-900': '#1B3169',
  'blue-950': '#121F42',
  // celadon (청자 — tertiary)
  'celadon-100': '#E6F8FC',
  'celadon-300': '#9ADFF0',
  'celadon-500': '#35C6E8',
  'celadon-700': '#1B93B4',
  'celadon-900': '#124C63',
  // violet (자운 — secondary)
  'violet-100': '#F1EDFF',
  'violet-300': '#CFC2FF',
  'violet-500': '#7B5CFF',
  'violet-700': '#5A3CE0',
  'violet-900': '#33207F',
  // status
  'red-500': '#E5484D',
  'green-500': '#22B07D',
  'amber-500': '#E8A33D',
  // navy (그림자 전용)
  'navy-shadow': 'rgb(23 42 94)',
};

/**
 * design.md §1.2 Semantic 색 토큰 — Light / Dark.
 * 값은 참조할 primitive 이름. 알파 합성 토큰은 ALPHA_TOKENS 에 퍼센트를 따로 둔다.
 */
export const SEMANTIC: Record<string, { light: string; dark: string }> = {
  // surface / text / border
  'bg-page': { light: 'porcelain-page', dark: 'obsidian-ink' },
  'bg-default': { light: 'gray-0', dark: 'obsidian-glaze' },
  'bg-subtle': { light: 'porcelain-milk', dark: 'obsidian-ash' },
  'bg-muted': { light: 'porcelain-ash', dark: 'obsidian-foot' },
  'fg-default': { light: 'gray-800', dark: 'gray-50' },
  'fg-body': { light: 'gray-700', dark: 'gray-300' },
  'fg-muted': { light: 'gray-550', dark: 'gray-400' },
  'fg-subtle': { light: 'gray-400', dark: 'gray-500' },
  'fg-link': { light: 'blue-600', dark: 'blue-300' },
  'border-default': { light: 'gray-200', dark: 'obsidian-foot' },
  'border-strong': { light: 'gray-300', dark: 'gray-700' },
  // 불투명 반전 표면(Tooltip·Toast) + 오버레이
  'bg-inverse': { light: 'gray-900', dark: 'gray-100' },
  'fg-inverse': { light: 'gray-0', dark: 'gray-900' },
  'overlay-bg': { light: 'obsidian-ink', dark: 'obsidian-ink' },
  // accent
  'accent-default': { light: 'blue-500', dark: 'blue-400' },
  'accent-hover': { light: 'blue-600', dark: 'blue-300' },
  'accent-subtle-bg': { light: 'blue-500', dark: 'blue-400' },
  'accent-fg-on': { light: 'gray-0', dark: 'obsidian-ink' },
  'accent-fg-strong': { light: 'blue-700', dark: 'blue-200' },
  'accent-secondary': { light: 'violet-500', dark: 'violet-300' },
  'accent-tertiary': { light: 'celadon-500', dark: 'celadon-300' },
  'danger-default': { light: 'red-500', dark: 'red-500' },
  'success-default': { light: 'green-500', dark: 'green-500' },
  'warning-default': { light: 'amber-500', dark: 'amber-500' },
  // glass (유리 3단계)
  'glass-subtle-bg': { light: 'gray-0', dark: 'white' },
  'glass-subtle-border': { light: 'gray-0', dark: 'white' },
  'glass-base-bg': { light: 'gray-0', dark: 'obsidian-ash' },
  'glass-base-border': { light: 'gray-0', dark: 'white' },
  'glass-foot': { light: 'blue-300', dark: 'blue-300' },
  'glass-solid-bg': { light: 'gray-0', dark: 'obsidian-panel' },
  'glass-solid-border': { light: 'gray-0', dark: 'white' },
  'glass-fallback-bg': { light: 'gray-0', dark: 'obsidian-panel' },
  // glaze (고임)
  'glaze-tint': { light: 'blue-500', dark: 'blue-400' },
  'glaze-celadon': { light: 'celadon-500', dark: 'celadon-500' },
};

/** 알파 합성 토큰 — design.md 표의 `@ N%` */
export const ALPHA_TOKENS: Record<string, { light: number; dark: number }> = {
  'accent-subtle-bg': { light: 10, dark: 16 },
  'overlay-bg': { light: 42, dark: 42 },
  'glass-subtle-bg': { light: 45, dark: 5 },
  'glass-subtle-border': { light: 60, dark: 9 },
  'glass-base-bg': { light: 62, dark: 72 },
  'glass-base-border': { light: 80, dark: 14 },
  'glass-foot': { light: 42, dark: 40 },
  'glass-solid-bg': { light: 80, dark: 78 },
  'glass-solid-border': { light: 90, dark: 18 },
  'glass-fallback-bg': { light: 92, dark: 94 },
  'glaze-tint': { light: 10, dark: 14 },
  'glaze-celadon': { light: 16, dark: 14 },
};

/**
 * 색이 아닌 semantic 토큰 — 모드에 따라 값이 바뀌므로 3블록 패리티 대상이다.
 * 값은 길이·그래디언트·그림자 등 자유 형식이지만, 안에 등장하는 색은 반드시
 * `var(--bs-color-*)` 또는 `color-mix(... var(--bs-color-*) ...)` 여야 한다(raw hex 금지).
 */
export const NON_COLOR_SEMANTIC = [
  '--bs-shadow-sm',
  '--bs-shadow-md',
  '--bs-shadow-lg',
  '--bs-shadow-glass',
  '--bs-shadow-ring',
  '--bs-shadow-intaglio',
  '--bs-glaze-pool',
  '--bs-orb-primary',
  '--bs-orb-tertiary',
  '--bs-orb-secondary',
  '--bs-orb-blur',
  '--bs-glass-blur-sm',
  '--bs-glass-blur-md',
  '--bs-glass-blur-lg',
  '--bs-glass-saturate',
] as const;

/** 모드와 무관한 비색 토큰(값이 양쪽 같아야 하는 것) */
export const NON_COLOR_STATIC: Record<string, string> = {
  '--bs-glass-blur-sm': '8px',
  '--bs-glass-blur-md': '16px',
  '--bs-glass-blur-lg': '28px',
  '--bs-glass-saturate': '150%',
  '--bs-orb-blur': '30px',
};

/** 그림자가 참조해야 하는 primitive — 라이트는 navy 알파만, 다크는 black 알파만 (design.md §7-3) */
export const SHADOW_BASE = { light: 'navy-shadow', dark: 'black' } as const;

/** design.md §2 Typography — [size, line-height, weight, letter-spacing] */
export const TYPOGRAPHY: Record<string, [string, string, string, string]> = {
  display: ['56px', '64px', '800', '-0.03em'],
  h1: ['32px', '40px', '700', '-0.02em'],
  h2: ['24px', '32px', '700', '-0.015em'],
  h3: ['20px', '28px', '600', '-0.01em'],
  'body-lg': ['17px', '30px', '400', '0'],
  body: ['15px', '26px', '400', '0'],
  'body-sm': ['14px', '20px', '400', '0'],
  label: ['13px', '18px', '600', '0'],
  caption: ['12px', '16px', '500', '0'],
  code: ['13px', '22px', '400', '0'],
};

/** design.md §2 폰트 — 세리프 토큰은 존재하지 않아야 한다 */
export const FONT_FAMILIES = {
  sans: 'Pretendard',
  mono: 'JetBrains Mono',
} as const;

/** design.md §4 Radius */
export const RADIUS: Record<string, string> = {
  sm: '6px',
  md: '10px',
  lg: '16px',
  xl: '24px',
  full: '999px',
};

/** design.md §1.2 Shadow — theme 에서 유틸리티로 노출돼야 하는 단계 */
export const SHADOW_LEVELS = ['sm', 'md', 'lg', 'glass', 'ring', 'intaglio'] as const;

/** design.md §4 Motion — 이징 하나, 지속시간 셋 */
export const MOTION = {
  ease: 'cubic-bezier(0.22, 1, 0.36, 1)',
  durations: { control: '170ms', surface: '300ms', pool: '420ms' },
} as const;

/**
 * design.md §3 — 콘텐츠 최대 폭.
 * Tailwind 내장 max-w-prose(65ch)와 이름이 겹치지 않도록 blog 본문은 content.
 * landing 1120 은 Phase 0 결정값(§3 의 1200 과 다름) — 변경하지 않는다.
 */
export const CONTAINER: Record<string, string> = {
  landing: '1120px',
  content: '720px',
};

/** design.md §3.1 — 셸 레이아웃 치수(expanded+ 기본값). 브레이크포인트별 값은 index.css 미디어 쿼리. */
export const LAYOUT: Record<string, string> = {
  '--bs-layout-topbar-h': '60px',
  '--bs-layout-tabbar-h': '56px',
  '--bs-layout-rail-w': '72px',
  '--bs-layout-sidebar-w': '248px',
  '--bs-layout-touch': '36px',
};
