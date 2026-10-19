import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { CalendarDays, FileText, User } from 'lucide-react';
import { describe, expect, it } from 'vitest';

import { AmbientBackground } from './ambient-background';
import { AppShell, type NavItem } from './app-shell';
import { expectTokenOnly } from '../test-utils/class-rules';

const NAV: NavItem[] = [
  { href: '/', label: '블로그', icon: FileText },
  { href: '/calendar', label: '캘린더', icon: CalendarDays },
  { href: '/account', label: '내 계정', icon: User },
];

const Tree = (props: Partial<React.ComponentProps<typeof AppShell>>) => (
  <AppShell navItems={NAV} activeHref="/calendar" {...props}>
    <p>본문</p>
  </AppShell>
);

describe('AppShell — design.md §6.10: 같은 navItems 로 TopBar 탭 · TabBar · Rail · Sidebar 를 렌더', () => {
  it('네 내비에 같은 항목이 들어가고 활성 항목은 aria-current=page', () => {
    render(<Tree />);
    const navs = screen.getAllByRole('navigation');
    const labels = ['주 메뉴', '하단 탭', '레일', '사이드바'];
    for (const label of labels) {
      const nav = screen.getByRole('navigation', { name: label });
      const links = within(nav).getAllByRole('link');
      expect(links.map((l) => l.textContent)).toEqual(['블로그', '캘린더', '내 계정']);
      expect(within(nav).getByRole('link', { name: '캘린더' })).toHaveAttribute('aria-current', 'page');
      expect(within(nav).getByRole('link', { name: '블로그' })).not.toHaveAttribute('aria-current');
    }
    expect(navs).toHaveLength(4);
  });

  it('TopBar — sticky, 높이 토큰, 스크롤 0 투명 → 스크롤 후 glass base', () => {
    render(<Tree />);
    const header = screen.getByRole('banner');
    expect(header).toHaveClass('sticky', 'top-0', 'h-[var(--bs-layout-topbar-h)]');
    expect(header).toHaveAttribute('data-scrolled', 'false');
    expect(header).toHaveClass('data-[scrolled=true]:glass-base');
    expect(header.className).not.toMatch(/(^|\s)glass-base\b/); // 스크롤 전엔 variant 접두사 없이 glass 를 쓰지 않는다
    expectTokenOnly(header.className);

    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 120, configurable: true });
      fireEvent.scroll(window);
    });
    expect(header).toHaveAttribute('data-scrolled', 'true');
    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 0, configurable: true });
      fireEvent.scroll(window);
    });
    expect(header).toHaveAttribute('data-scrolled', 'false');
  });

  it('TopBar 좌측 brand 는 lowercase 700, 우측 actions 슬롯', () => {
    render(<Tree actions={<button>로그아웃</button>} />);
    const brand = screen.getByRole('link', { name: 'buddle' });
    expect(brand).toHaveClass('lowercase', 'font-bold');
    expect(screen.getByRole('button', { name: '로그아웃' })).toBeInTheDocument();
  });

  it('TabBar — compact 전용, h 56 + safe-bottom, glass base, 최대 5개', () => {
    render(<Tree />);
    const tab = screen.getByRole('navigation', { name: '하단 탭' });
    expect(tab).toHaveClass('fixed', 'bottom-0', 'medium:hidden', 'glass-base');
    expect(tab).toHaveClass('pb-[env(safe-area-inset-bottom)]');
    expect(tab.className).toMatch(/h-\[calc\(var\(--bs-layout-tabbar-h\)/);
    expectTokenOnly(tab.className);
  });

  it('Rail — medium 전용 72, 아이콘 + 12px 라벨; Sidebar — expanded 전용 248, bg/subtle 불투명', () => {
    render(<Tree />);
    const rail = screen.getByRole('navigation', { name: '레일' });
    expect(rail).toHaveClass('hidden', 'medium:flex', 'expanded:hidden', 'w-[var(--bs-layout-rail-w)]');
    expect(within(rail).getByRole('link', { name: '캘린더' })).toHaveClass('text-caption');
    const side = screen.getByRole('navigation', { name: '사이드바' });
    expect(side).toHaveClass('hidden', 'expanded:flex', 'w-[var(--bs-layout-sidebar-w)]', 'bg-bg-subtle');
    expect(side.className).not.toMatch(/glass/);
  });

  it('TopBar 탭(알약)은 medium 이상에서만, 활성 = accent/subtle-bg', () => {
    render(<Tree />);
    const top = screen.getByRole('navigation', { name: '주 메뉴' });
    expect(top).toHaveClass('hidden', 'medium:flex');
    expect(within(top).getByRole('link', { name: '캘린더' })).toHaveClass('aria-[current=page]:bg-accent-subtle-bg');
  });

  it('본문은 main, compact 에서 TabBar 높이만큼 하단 여백', () => {
    render(<Tree />);
    const main = screen.getByRole('main');
    expect(main).toHaveTextContent('본문');
    expect(main.className).toMatch(/pb-\[calc\(var\(--bs-layout-tabbar-h\)/);
    expect(main).toHaveClass('medium:pb-0');
  });

  it('sideNav=false — Rail/Sidebar 없이 TopBar 탭 + TabBar 만 (블로그 화면)', () => {
    render(<Tree sideNav={false} />);
    expect(screen.queryByRole('navigation', { name: '레일' })).toBeNull();
    expect(screen.queryByRole('navigation', { name: '사이드바' })).toBeNull();
    expect(screen.getByRole('navigation', { name: '하단 탭' })).toBeInTheDocument();
  });

  it('LinkComponent 로 라우터 Link 를 주입할 수 있다', () => {
    const Link = ({ href, children, ...rest }: React.ComponentProps<'a'>) => (
      <a href={href} data-router="yes" {...rest}>
        {children}
      </a>
    );
    render(<Tree LinkComponent={Link} />);
    for (const l of screen.getAllByRole('link')) expect(l).toHaveAttribute('data-router', 'yes');
  });

  it('터치 타깃 — TabBar 항목 44 이상', () => {
    render(<Tree />);
    const tab = screen.getByRole('navigation', { name: '하단 탭' });
    expect(within(tab).getByRole('link', { name: '블로그' })).toHaveClass('min-h-11');
  });
});

describe('AmbientBackground — design.md §5.2: 광원 3개 + 먹선, 정적', () => {
  it('fixed inset-0 z-0 pointer-events-none, orb 3개, 먹선은 compact 숨김', () => {
    const { container } = render(<AmbientBackground />);
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveAttribute('aria-hidden', 'true');
    expect(root).toHaveClass('fixed', 'inset-0', 'z-0', 'pointer-events-none');
    const orbs = root.querySelectorAll('[data-orb]');
    expect([...orbs].map((o) => o.getAttribute('data-orb'))).toEqual(['primary', 'tertiary', 'secondary']);
    expect(orbs[0]).toHaveClass('bg-orb-primary');
    expect(orbs[0].className).toMatch(/blur-\[var\(--bs-orb-blur\)\]/);
    const ink = root.querySelector('svg');
    expect(ink).toHaveClass('hidden', 'medium:block');
    expect(ink?.querySelectorAll('path')).toHaveLength(5);
    expectTokenOnly(root.className);
    for (const o of orbs) expectTokenOnly(o.className);
  });

  it('애니메이션 클래스가 없다(배경 애니메이션 금지)', () => {
    const { container } = render(<AmbientBackground />);
    expect(container.innerHTML).not.toMatch(/animate-/);
  });
});
