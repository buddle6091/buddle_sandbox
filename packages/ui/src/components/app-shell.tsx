'use client';

import * as React from 'react';
import type { LucideIcon } from 'lucide-react';

import { cn } from '@sandbox/ui/lib/utils';
import { useScrolled } from '../hooks/use-scrolled';

/**
 * AppShell — design.md §6.10 + SCREENS 공통 헤더
 *
 * 같은 `navItems` 배열에서 네 내비를 렌더한다. 분기는 전부 CSS 미디어 쿼리(JS 분기 없음):
 *   TopBar   항상. h 52/60 + safe-top, sticky. 스크롤 0 투명 → 스크롤 후 glass base.
 *            좌 brand(lowercase 700) · medium+ 알약 탭(활성 accent/subtle-bg) · 우 actions
 *   TabBar   compact 전용. h 56 + safe-bottom, glass base, 최대 5항목
 *   Rail     medium 전용. 72, 아이콘 + 12px 라벨
 *   Sidebar  expanded+ 전용. 248, bg/subtle 불투명
 * `sideNav={false}` 면 Rail/Sidebar 를 빼고 TopBar 탭 + TabBar 만 쓴다(블로그 화면).
 * compact 에서 backdrop-filter 는 TopBar·TabBar 두 개뿐 — 리스트 안 카드는 glass-flat.
 */
export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

type LinkLike = React.ComponentType<React.ComponentProps<'a'> & { href: string }>;

type AppShellProps = {
  navItems: NavItem[];
  /** 현재 경로. 일치하는 항목에 aria-current="page". */
  activeHref?: string;
  /** 좌측 브랜드 텍스트. Pretendard 700 lowercase. */
  brand?: string;
  brandHref?: string;
  /** TopBar 우측 액션 슬롯 */
  actions?: React.ReactNode;
  /** Rail(medium)·Sidebar(expanded) 사용 여부. 블로그는 false. */
  sideNav?: boolean;
  /** 라우터 Link 주입(Next.js 등). 기본 <a>. */
  LinkComponent?: LinkLike;
  className?: string;
  children: React.ReactNode;
};

const DefaultLink: LinkLike = (props) => <a {...props} />;

const navLinkBase = cn(
  'focus-ring select-none transition-colors duration-[var(--bs-motion-control)] ease-bs',
  "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
);

function NavLinks({
  items,
  activeHref,
  Link,
  variant,
}: {
  items: NavItem[];
  activeHref?: string;
  Link: LinkLike;
  variant: 'topbar' | 'tabbar' | 'rail' | 'sidebar';
}) {
  const cls: Record<typeof variant, string> = {
    topbar: cn(
      navLinkBase,
      'inline-flex h-8 items-center rounded-full px-4 text-label text-fg-muted',
      'hover-fine:text-fg-default aria-[current=page]:bg-accent-subtle-bg aria-[current=page]:text-accent-fg-strong',
    ),
    tabbar: cn(
      navLinkBase,
      'flex min-h-11 flex-1 flex-col items-center justify-center gap-0.5 rounded-md text-caption text-fg-muted',
      'active:scale-[.985] aria-[current=page]:text-accent-default',
    ),
    rail: cn(
      navLinkBase,
      'flex w-full flex-col items-center justify-center gap-1 rounded-md py-2.5 text-caption text-fg-muted',
      'hover-fine:bg-accent-subtle-bg aria-[current=page]:text-accent-default',
    ),
    sidebar: cn(
      navLinkBase,
      'flex h-10 items-center gap-3 rounded-md px-3 text-body-sm text-fg-body',
      'hover-fine:bg-accent-subtle-bg aria-[current=page]:bg-accent-subtle-bg aria-[current=page]:text-accent-fg-strong aria-[current=page]:font-semibold',
    ),
  };
  const showIcon = variant !== 'topbar';
  return (
    <>
      {items.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          aria-current={href === activeHref ? 'page' : undefined}
          className={cls[variant]}
        >
          {showIcon && <Icon aria-hidden />}
          <span>{label}</span>
        </Link>
      ))}
    </>
  );
}

function AppShell({
  navItems,
  activeHref,
  brand = 'buddle',
  brandHref = '/',
  actions,
  sideNav = true,
  LinkComponent,
  className,
  children,
}: AppShellProps) {
  const Link = LinkComponent ?? DefaultLink;
  const scrolled = useScrolled();
  const items = navItems.slice(0, 5);

  return (
    <div className={cn('relative z-10 flex min-h-dvh flex-col', className)}>
      <header
        data-slot="topbar"
        data-scrolled={scrolled}
        className={cn(
          'sticky top-0 z-40 flex h-[var(--bs-layout-topbar-h)] items-center gap-4 px-4 pt-[env(safe-area-inset-top)] medium:px-6',
          'bg-transparent transition-[background-color,border-color,box-shadow] duration-[var(--bs-motion-surface)] ease-bs',
          'data-[scrolled=true]:glass-base data-[scrolled=true]:rounded-none data-[scrolled=true]:border-x-0 data-[scrolled=true]:border-t-0',
        )}
      >
        <Link href={brandHref} className="focus-ring text-h3 font-bold lowercase text-fg-default rounded-sm">
          {brand}
        </Link>
        <nav aria-label="주 메뉴" className="hidden items-center gap-1 medium:flex">
          <NavLinks items={items} activeHref={activeHref} Link={Link} variant="topbar" />
        </nav>
        <div className="ml-auto flex items-center gap-2">{actions}</div>
      </header>

      <div className="flex flex-1">
        {sideNav && (
          <>
            <nav
              aria-label="레일"
              className={cn(
                'sticky top-[var(--bs-layout-topbar-h)] hidden h-[calc(100dvh-var(--bs-layout-topbar-h))] w-[var(--bs-layout-rail-w)] shrink-0 flex-col gap-1 px-2 py-3',
                'medium:flex expanded:hidden',
              )}
            >
              <NavLinks items={items} activeHref={activeHref} Link={Link} variant="rail" />
            </nav>
            <nav
              aria-label="사이드바"
              className={cn(
                'sticky top-[var(--bs-layout-topbar-h)] hidden h-[calc(100dvh-var(--bs-layout-topbar-h))] w-[var(--bs-layout-sidebar-w)] shrink-0 flex-col gap-1 border-r border-border-default bg-bg-subtle p-3',
                'expanded:flex',
              )}
            >
              <NavLinks items={items} activeHref={activeHref} Link={Link} variant="sidebar" />
            </nav>
          </>
        )}
        <main className="min-w-0 flex-1 pb-[calc(var(--bs-layout-tabbar-h)+env(safe-area-inset-bottom))] medium:pb-0">
          {children}
        </main>
      </div>

      <nav
        aria-label="하단 탭"
        className={cn(
          'fixed inset-x-0 bottom-0 z-40 flex h-[calc(var(--bs-layout-tabbar-h)+env(safe-area-inset-bottom))] items-stretch px-2 pb-[env(safe-area-inset-bottom)]',
          'glass-base rounded-none border-x-0 border-b-0 medium:hidden',
        )}
      >
        <NavLinks items={items} activeHref={activeHref} Link={Link} variant="tabbar" />
      </nav>
    </div>
  );
}

export { AppShell, type AppShellProps };
