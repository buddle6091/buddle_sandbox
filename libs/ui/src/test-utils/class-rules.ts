import { expect } from 'vitest';

/**
 * libs/ui/CLAUDE.md 의 className 규칙을 테스트에서 강제한다.
 * - transition-all 금지 (design.md §4)
 * - `hover:` 금지 → `hover-fine:` (hover 는 hover:hover + pointer:fine 안에서만)
 * - raw hex / rgb / Tailwind 기본 팔레트(bg-neutral-500 등) 금지 — 토큰 유틸리티만
 * - shadcn 기본 변수(bg-background, text-foreground, bg-primary …) 금지
 */
const FORBIDDEN: Array<[RegExp, string]> = [
  [/\btransition-all\b/, 'transition-all 금지 — 전환 대상을 나열한다'],
  [/(^|\s)hover:/, '`hover:` 금지 — `hover-fine:` 을 쓴다'],
  [/#[0-9a-fA-F]{3,8}\b/, 'raw hex 금지'],
  [/\brgba?\(/, 'rgb() 금지'],
  [
    /(?<![\w-])(bg|text|border|ring|fill|stroke|from|to|via)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|white|black)(-\d{2,3})?(?![\w-])/,
    'Tailwind 기본 팔레트 금지 — semantic 토큰 유틸리티만',
  ],
  [
    /(?<![\w-])(bg|text|border|ring)-(background|foreground|primary|secondary|muted|accent|destructive|popover|card|input|ring)(-foreground)?(?![\w-])/,
    'shadcn 기본 변수 금지 — 토큰 유틸리티로 치환',
  ],
  [/\btext-fg-[\w-]+\/\d+\b/, '텍스트에 알파 금지'],
];

export function expectTokenOnly(className: string) {
  for (const [re, why] of FORBIDDEN) {
    expect(className, why).not.toMatch(re);
  }
}
