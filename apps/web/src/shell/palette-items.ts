import { LANDING, NAV_SECTIONS } from '../landing/content/landing';

/**
 * ⌘K 팔레트 항목 — 경로에 따라 달라지는 것은 섹션 이동뿐(랜딩에서는 `#id`, 다른 라우트에서는 `/#id`).
 * 순수 함수라 Vitest 로 고정한다. 아이콘 · 실행은 app/command-palette.tsx 가 kind 로 붙인다.
 */
export type PaletteAction =
  | { kind: 'route'; href: string }
  | { kind: 'section'; id: string; href: string }
  | { kind: 'theme'; value: 'light' | 'dark' | 'system' }
  | { kind: 'copy'; text: string }
  | { kind: 'external'; href: string };

export type PaletteItem = { id: string; label: string; group: string; keywords?: string; hint?: string; action: PaletteAction };

export const ROUTES = [
  { href: '/', label: '소개', keywords: 'home about landing 홈' },
  { href: '/blog', label: '블로그', keywords: 'blog post 글' },
  { href: '/calendar', label: '캘린더', keywords: 'calendar schedule 일정' },
] as const;

export function paletteItems(pathname: string): PaletteItem[] {
  const onLanding = pathname === '/';
  const sectionGroup = onLanding ? '이 페이지에서' : '소개 페이지 섹션';
  const c = LANDING.contact;
  return [
    ...ROUTES.map((r) => ({
      id: `route:${r.href}`,
      label: r.label,
      group: '페이지',
      keywords: r.keywords,
      hint: r.href,
      action: { kind: 'route', href: r.href } as const,
    })),
    ...NAV_SECTIONS.map((n) => ({
      id: `section:${n.id}`,
      label: n.label,
      group: sectionGroup,
      keywords: n.id,
      action: { kind: 'section', id: n.id, href: onLanding ? `#${n.id}` : `/#${n.id}` } as const,
    })),
    { id: 'theme:light', label: '라이트 모드', group: '테마', keywords: 'light theme 밝게', action: { kind: 'theme', value: 'light' } },
    { id: 'theme:dark', label: '다크 모드', group: '테마', keywords: 'dark theme 어둡게', action: { kind: 'theme', value: 'dark' } },
    { id: 'theme:system', label: '시스템 설정 따르기', group: '테마', keywords: 'system auto theme', action: { kind: 'theme', value: 'system' } },
    { id: 'copy:email', label: c.copyLabel, group: '연락', keywords: `email mail 메일 ${c.email}`, hint: c.email, action: { kind: 'copy', text: c.email } },
    ...c.links.map((l) => ({
      id: `link:${l.href}`,
      label: l.label,
      group: '연락',
      keywords: 'link 링크',
      action: { kind: 'external', href: l.href } as const,
    })),
  ];
}

/** ⌘K(mac) · Ctrl+K — 입력 중이어도 연다(브라우저 기본 동작 없음). 다른 보조키가 섞이면 무시. */
export function isPaletteShortcut(e: Pick<KeyboardEvent, 'key' | 'metaKey' | 'ctrlKey' | 'altKey' | 'shiftKey'>) {
  return e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey) && !e.altKey && !e.shiftKey;
}
