import { LANDING } from '../landing/content/landing';

/**
 * 에디토리얼 헤더(masthead) 내용 — 세 라우트 공통.
 * 메뉴는 이전 헤더와 같은 3개(소개 · 블로그 · 캘린더) — 2026-11-16 사용자 결정(배치만 에디토리얼, 메뉴 구성은 롤백).
 */
export const MASTHEAD = {
  brand: 'buddle',
  /** 역할 표기 규칙(apps/web 규칙 5): 메인 강사로 읽히지 않게 */
  tagline: [LANDING.hero.role, '기업 · 기관 AI 교육의 기술 강사이자 멘토'],
  links: [
    { label: '소개', href: '/' },
    { label: '블로그', href: '/blog' },
    { label: '캘린더', href: '/calendar' },
  ],
} as const;

/** 라우트 링크가 현재 페이지인가 — 해시 링크(`/#id`)는 페이지가 아니라 위치라 aria-current 를 주지 않는다. */
export function isCurrentRoute(href: string, pathname: string): boolean {
  if (href.includes('#')) return false;
  return href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);
}
