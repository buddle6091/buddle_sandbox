/**
 * design.md 의 토큰 표를 그대로 옮긴 기대값. 이 파일이 계약(contract)의 기준이다.
 * design.md 가 바뀌면 여기부터 고치고, 테스트가 CSS를 따라오게 한다.
 */

/** design.md §1.1 Primitives — 단일 모드 */
export const PRIMITIVES: Record<string, string> = {
  'gray-0': '#FFFFFF',
  'gray-50': '#FAFAFA',
  'gray-100': '#F4F4F5',
  'gray-200': '#E4E4E7',
  'gray-300': '#D4D4D8',
  'gray-400': '#A1A1AA',
  'gray-500': '#71717A',
  'gray-600': '#52525B',
  'gray-700': '#3F3F46',
  'gray-800': '#27272A',
  'gray-900': '#18181B',
  'gray-950': '#0B0B0E',
  'indigo-300': '#A5B4FC',
  'indigo-400': '#818CF8',
  'indigo-500': '#6366F1',
  'indigo-600': '#4F46E5',
  'indigo-700': '#4338CA',
  'red-500': '#EF4444',
  'green-500': '#22C55E',
  'amber-500': '#F59E0B',
};

/**
 * design.md §1.2 Semantic — Light / Dark.
 * 값은 참조할 primitive 이름. accent-subtle-bg 만 알파 합성이라 별도 표기.
 */
export const SEMANTIC: Record<string, { light: string; dark: string }> = {
  'bg-default': { light: 'gray-0', dark: 'gray-950' },
  'bg-subtle': { light: 'gray-50', dark: 'gray-900' },
  'bg-muted': { light: 'gray-100', dark: 'gray-800' },
  'fg-default': { light: 'gray-900', dark: 'gray-50' },
  'fg-muted': { light: 'gray-500', dark: 'gray-400' },
  'fg-subtle': { light: 'gray-400', dark: 'gray-500' },
  'border-default': { light: 'gray-200', dark: 'gray-800' },
  'border-strong': { light: 'gray-300', dark: 'gray-700' },
  'accent-default': { light: 'indigo-600', dark: 'indigo-400' },
  'accent-hover': { light: 'indigo-700', dark: 'indigo-300' },
  'accent-subtle-bg': { light: 'indigo-500', dark: 'indigo-400' },
  'accent-fg-on': { light: 'gray-0', dark: 'gray-950' },
  'danger-default': { light: 'red-500', dark: 'red-500' },
  'success-default': { light: 'green-500', dark: 'green-500' },
  'warning-default': { light: 'amber-500', dark: 'amber-500' },
};

/** 알파 합성 토큰 — design.md: indigo/500 @ 10% (light) / indigo/400 @ 16% (dark) */
export const ALPHA_TOKENS: Record<string, { light: number; dark: number }> = {
  'accent-subtle-bg': { light: 10, dark: 16 },
};

/** design.md §2 Typography — [size, line-height, weight] */
export const TYPOGRAPHY: Record<string, [string, string, string]> = {
  display: ['48px', '56px', '700'],
  h1: ['32px', '40px', '700'],
  h2: ['24px', '32px', '600'],
  h3: ['20px', '28px', '600'],
  'body-lg': ['18px', '28px', '400'],
  body: ['16px', '24px', '400'],
  'body-sm': ['14px', '20px', '400'],
  caption: ['12px', '16px', '500'],
  code: ['14px', '22px', '400'],
};

/** design.md §4 Radius */
export const RADIUS: Record<string, string> = {
  sm: '6px',
  md: '10px',
  lg: '16px',
  full: '999px',
};

/** design.md §4 Shadow */
export const SHADOW_LEVELS = ['sm', 'md', 'lg'] as const;

/** design.md §3 — 콘텐츠 최대 폭 */
export const CONTAINER: Record<string, string> = {
  landing: '1120px',
  prose: '720px',
};
