import { fireEvent, render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { LANDING } from '../src/landing/content/landing';
import { isCurrentRoute } from '../src/shell/site';
import { Masthead } from './masthead';
import { CommandPalette, CommandPaletteTrigger } from './command-palette';

let pathname = '/';
vi.mock('next/navigation', () => ({ usePathname: () => pathname, useRouter: () => ({ push: vi.fn() }) }));
beforeEach(() => {
  pathname = '/';
});

describe('isCurrentRoute', () => {
  it('해시 링크는 위치라 현재 페이지가 아니다, 루트는 정확히 일치만', () => {
    expect(isCurrentRoute('/#teaching', '/')).toBe(false);
    expect(isCurrentRoute('/', '/')).toBe(true);
    expect(isCurrentRoute('/', '/blog')).toBe(false);
    expect(isCurrentRoute('/blog', '/blog/a-post')).toBe(true);
    expect(isCurrentRoute('/blog', '/blogger')).toBe(false);
  });
});

describe('Masthead — 에디토리얼 헤더', () => {
  it('로고 · 소개 두 줄 · 사이트 메뉴는 이전 헤더와 같은 3개(소개 · 블로그 · 캘린더)', () => {
    render(<Masthead />);
    expect(screen.getByRole('link', { name: 'buddle' })).toHaveAttribute('href', '/');
    expect(screen.getByText(LANDING.hero.role)).toBeInTheDocument();
    const nav = screen.getByRole('navigation', { name: '사이트 메뉴' });
    expect(within(nav).getAllByRole('link').map((a) => [a.textContent, a.getAttribute('href')])).toEqual([
      ['소개', '/'],
      ['블로그', '/blog'],
      ['캘린더', '/calendar'],
    ]);
  });

  it('현재 라우트만 aria-current', () => {
    pathname = '/blog';
    render(<Masthead />);
    const nav = screen.getByRole('navigation', { name: '사이트 메뉴' });
    expect(within(nav).getByRole('link', { name: '블로그' })).toHaveAttribute('aria-current', 'page');
    expect(within(nav).getByRole('link', { name: '소개' })).not.toHaveAttribute('aria-current');
  });

  it('헤더의 팔레트 트리거는 화면에 하나뿐인 팔레트를 연다(⌘K 는 한 번만 토글)', () => {
    render(
      <>
        <Masthead actions={<CommandPaletteTrigger />} />
        <CommandPalette />
      </>,
    );
    const triggers = screen.getAllByRole('button', { name: '명령 팔레트 열기' });
    expect(triggers).toHaveLength(2);
    fireEvent.click(triggers[0]);
    expect(screen.getAllByRole('combobox')).toHaveLength(1);
  });
});
