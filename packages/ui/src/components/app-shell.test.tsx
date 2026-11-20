import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { CalendarDays, FileText, User } from 'lucide-react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

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

  it('TabBar — compact 전용, 화면 아래 떠 있는 liquid glass 알약(safe-area 위 12px), h 56, 최대 5개', () => {
    render(<Tree />);
    const tab = screen.getByRole('navigation', { name: '하단 탭' });
    expect(tab).toHaveAttribute('data-slot', 'glass-surface');
    // 본문 위에 글자를 얹는 표면 → 짙은 틴트(라벨 대비)
    expect(tab).toHaveAttribute('data-density', 'dense');
    expect(tab).toHaveClass('fixed', 'inset-x-3', 'medium:hidden', 'liquid-glass', 'rounded-full', 'h-[var(--bs-layout-tabbar-h)]');
    expect(tab.className).toMatch(/bottom-\[calc\(env\(safe-area-inset-bottom\)/);
    expect(tab.className).not.toMatch(/glass-base/);
    expectTokenOnly(tab.className);
  });

  it('TabBar 활성 탭 — 안쪽 알약(backdrop 없음 · glow) 하나, 장식', () => {
    render(<Tree />);
    const tab = screen.getByRole('navigation', { name: '하단 탭' });
    const marks = tab.querySelectorAll('[data-tab-active]');
    expect(marks).toHaveLength(1);
    expect(marks[0]).toHaveAttribute('aria-hidden', 'true');
    expect(marks[0]).toHaveAttribute('data-backdrop', 'none');
    expect(marks[0].closest('a')).toHaveAttribute('aria-current', 'page');
    expect(marks[0].querySelector('[data-slot="glass-glow"]')).not.toBeNull();
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

  it('TopBar 활성 표시(nav-indicator) — 장식 요소 하나, 위치를 잴 수 없으면 숨고 링크 배경이 활성 표시로 남는다', () => {
    render(<Tree />);
    const top = screen.getByRole('navigation', { name: '주 메뉴' });
    const dot = top.querySelector('[data-slot="nav-indicator"]') as HTMLElement;
    expect(dot).not.toBeNull();
    expect(dot).toHaveAttribute('aria-hidden', 'true');
    expect(dot).toHaveClass('bg-accent-subtle-bg', 'motion-reduce:transition-none');
    expectTokenOnly(dot.className);
    // jsdom 은 레이아웃이 없다(offsetWidth 0) → ready 가 아니고 표시는 투명
    expect(top).not.toHaveAttribute('data-indicator');
    expect(dot.style.opacity).toBe('0');
    expect(within(top).getAllByRole('link')).toHaveLength(3);
  });

  it('TopBar 활성 표시 — 폭을 잴 수 있으면 활성 링크 자리로 옮기고 ready, activeHref 가 바뀌면 따라간다', () => {
    const w = vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockImplementation(function (this: HTMLElement) {
      return this.tagName === 'A' ? 64 : 0;
    });
    const l = vi.spyOn(HTMLElement.prototype, 'offsetLeft', 'get').mockImplementation(function (this: HTMLElement) {
      return this.getAttribute('href') === '/calendar' ? 68 : this.getAttribute('href') === '/account' ? 136 : 0;
    });
    const { rerender } = render(<Tree />);
    const top = screen.getByRole('navigation', { name: '주 메뉴' });
    const dot = top.querySelector('[data-slot="nav-indicator"]') as HTMLElement;
    expect(top).toHaveAttribute('data-indicator', 'ready');
    expect(dot.style.width).toBe('64px');
    expect(dot.style.transform).toBe('translateX(68px)');
    expect(dot.style.opacity).toBe('1');
    rerender(<Tree activeHref="/account" />);
    expect(dot.style.transform).toBe('translateX(136px)');
    w.mockRestore();
    l.mockRestore();
  });

  describe('topBar="line" — 사이트용(본문 폭 · 텍스트 링크 · 밑줄 표시)', () => {
    it('내용이 본문 컨테이너(container/landing 토큰) 안에 있고, 스크롤 후에는 아래 실선만(좌우 · 위 테두리 · 그림자 끔)', () => {
      render(<Tree topBar="line" />);
      const header = screen.getByRole('banner');
      expect(header).toHaveAttribute('data-variant', 'line');
      expect(header).toHaveClass('sticky', 'top-0', 'h-[var(--bs-layout-topbar-h)]', 'data-[scrolled=true]:glass-base');
      expect(header).toHaveClass('data-[scrolled=true]:border-x-0!', 'data-[scrolled=true]:border-t-0!', 'data-[scrolled=true]:shadow-none!');
      expectTokenOnly(header.className);
      const inner = header.querySelector('[data-slot="topbar-inner"]')!;
      expect(inner).toHaveClass('mx-auto', 'max-w-landing');
      expectTokenOnly(inner.className);
      expect(inner.className).not.toMatch(/max-w-\[/);
      expect(within(inner as HTMLElement).getByRole('link', { name: 'buddle' })).toBeInTheDocument();
    });

    it('탭은 배경 없는 텍스트 링크, 활성은 aria-current + 굵게, 표시는 2px 밑줄', () => {
      render(<Tree topBar="line" />);
      const top = screen.getByRole('navigation', { name: '주 메뉴' });
      const active = within(top).getByRole('link', { name: '캘린더' });
      expect(active).toHaveAttribute('aria-current', 'page');
      expect(active).toHaveClass('aria-[current=page]:font-semibold', 'aria-[current=page]:text-fg-default');
      expect(active.className).not.toMatch(/bg-accent-subtle-bg/);
      expectTokenOnly(active.className);
      const dot = top.querySelector('[data-slot="nav-indicator"]')!;
      expect(dot).toHaveClass('h-0.5', 'bottom-0', 'bg-fg-default');
      expect(dot).toHaveAttribute('aria-hidden', 'true');
    });

    it('context 슬롯은 brand 옆에, actions 는 우측에', () => {
      render(<Tree topBar="line" context={<span>/ 강의 이력</span>} actions={<button>찾기</button>} />);
      const ctx = document.querySelector('[data-slot="topbar-context"]')!;
      expect(ctx).toHaveTextContent('/ 강의 이력');
      expect(ctx.previousElementSibling).toHaveTextContent('buddle');
      expect(screen.getByRole('button', { name: '찾기' })).toBeInTheDocument();
    });

    it('pill(기본)에서는 context 를 그리지 않는다', () => {
      render(<Tree context={<span>위치</span>} />);
      expect(document.querySelector('[data-slot="topbar-context"]')).toBeNull();
    });

    it('밑줄 표시는 라벨(span) 폭 · 위치를 따른다', () => {
      const w = vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockImplementation(function (this: HTMLElement) {
        return this.tagName === 'A' ? 64 : this.tagName === 'SPAN' ? 40 : 0;
      });
      const r = vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
        const left = this.tagName === 'NAV' ? 500 : this.tagName === 'SPAN' && this.textContent === '캘린더' ? 580 : 0;
        return { left, top: 0, right: left, bottom: 0, width: 0, height: 0, x: left, y: 0, toJSON: () => ({}) } as DOMRect;
      });
      render(<Tree topBar="line" />);
      const dot = document.querySelector('[data-slot="nav-indicator"]') as HTMLElement;
      expect(dot.style.width).toBe('40px');
      expect(dot.style.transform).toBe('translateX(80px)');
      w.mockRestore();
      r.mockRestore();
    });
  });

  describe('masthead — 페이지 맨 위 에디토리얼 헤더', () => {
    let fire: (visible: boolean) => void = () => undefined;
    beforeEach(() => {
      vi.stubGlobal(
        'IntersectionObserver',
        class {
          constructor(cb: IntersectionObserverCallback) {
            fire = (v) => cb([{ isIntersecting: v } as IntersectionObserverEntry], this as unknown as IntersectionObserver);
          }
          observe() {}
          disconnect() {}
          unobserve() {}
        },
      );
    });
    afterEach(() => vi.unstubAllGlobals());

    it('masthead 가 TopBar 보다 먼저 흐름대로 놓이고, 보이는 동안 TopBar 는 숨고 inert', () => {
      render(<Tree topBar="line" masthead={<p>마스트헤드</p>} />);
      const mast = document.querySelector('[data-slot="masthead"]')!;
      const bar = screen.getByRole('banner', { hidden: true });
      expect(mast).toHaveTextContent('마스트헤드');
      expect(mast.compareDocumentPosition(bar) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
      expect(bar).toHaveClass('fixed', 'inset-x-0', 'top-0', 'data-[hidden=true]:-translate-y-full', 'motion-reduce:transition-none');
      expect(bar).toHaveAttribute('data-hidden', 'true');
      expect(bar).toHaveAttribute('inert');
      expectTokenOnly(bar.className);
    });

    it('masthead 가 화면 밖으로 나가면 TopBar 가 내려오고, 다시 보이면 숨는다', () => {
      render(<Tree topBar="line" masthead={<p>마스트헤드</p>} />);
      const bar = screen.getByRole('banner', { hidden: true });
      act(() => fire(false));
      expect(bar).toHaveAttribute('data-hidden', 'false');
      expect(bar).not.toHaveAttribute('inert');
      act(() => fire(true));
      expect(bar).toHaveAttribute('data-hidden', 'true');
    });

    it('masthead 가 없으면 기존 sticky TopBar 그대로', () => {
      render(<Tree topBar="line" />);
      const bar = screen.getByRole('banner');
      expect(bar).toHaveClass('sticky');
      expect(bar).not.toHaveClass('fixed');
      expect(bar).toHaveAttribute('data-hidden', 'false');
      expect(document.querySelector('[data-slot="masthead"]')).toBeNull();
    });
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
