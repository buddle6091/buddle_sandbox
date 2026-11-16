'use client';

import * as React from 'react';
import type { LucideIcon } from 'lucide-react';

import { cn } from '@sandbox/ui/lib/utils';
import { useScrolled } from '../hooks/use-scrolled';
import { GlassSurface } from './glass-surface';

/**
 * AppShell — design.md §6.10 + SCREENS 공통 헤더
 *
 * 같은 `navItems` 배열에서 네 내비를 렌더한다. 분기는 전부 CSS 미디어 쿼리(JS 분기 없음):
 *   TopBar   항상. h 52/60 + safe-top, sticky. 스크롤 0 투명 → 스크롤 후 glass base.
 *            좌 brand(lowercase 700) · medium+ 알약 탭(활성 accent/subtle-bg) · 우 actions
 *            활성 알약은 하나의 표시(nav-indicator)가 탭 사이를 미끄러진다(2026-11-10). 위치를 재기 전 · 잴 수 없는
 *            환경(SSR · 테스트)에서는 링크 자체 배경이 그대로 활성 표시다.
 *   TabBar   compact 전용. 화면 아래에 떠 있는 liquid glass 알약(GlassSurface, 2026-11-16) — 좌우 · 아래 12px 띄움,
 *            h 56, 최대 5항목. 활성 탭 뒤에 안쪽 알약(backdrop 없음 + glow) 하나.
 *   Rail     medium 전용. 72, 아이콘 + 12px 라벨
 *   Sidebar  expanded+ 전용. 248, bg/subtle 불투명
 * `sideNav={false}` 면 Rail/Sidebar 를 빼고 TopBar 탭 + TabBar 만 쓴다(블로그 화면).
 *
 * TopBar 는 두 모양(`topBar`):
 *   pill(기본)  앱 화면용. brand 옆 알약 탭, 화면 폭 전체. 스크롤 후 glass base.
 *   line        사이트(랜딩 · 블로그)용, 2026-11-10. 리서치(slash.page · toss.tech · linear.app)의 공통점을 따른다:
 *               내용이 **본문 컨테이너 폭**(`max-w-landing` 토큰)에 맞고, 탭은 배경 없는 텍스트 링크 + 2px 밑줄 표시, 내비는 우측(액션 옆).
 *               스크롤 후에는 유리 상자가 아니라 **아래 실선 하나**만 생긴다(glass base 의 좌우 · 위 테두리와 그림자를 끈다).
 *               brand 옆 `context` 슬롯에 현재 위치(예: `/ 강의 이력`)를 둘 수 있다.
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
  /** TopBar 모양. pill = 앱(기본), line = 사이트(본문 폭 · 텍스트 링크 · 밑줄 표시). */
  topBar?: 'pill' | 'line';
  /** brand 바로 옆 슬롯 — 현재 위치 표시 등(line 에서만 그린다). */
  context?: React.ReactNode;
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
  variant: 'topbar' | 'topline' | 'tabbar' | 'rail' | 'sidebar';
}) {
  const cls: Record<typeof variant, string> = {
    topbar: cn(
      navLinkBase,
      'relative inline-flex h-8 items-center rounded-full px-4 text-label text-fg-muted',
      'hover-fine:text-fg-default aria-[current=page]:bg-accent-subtle-bg aria-[current=page]:text-accent-fg-strong',
      // 미끄러지는 표시가 자리를 잡으면 링크 자체 배경은 비운다(표시 하나만 보이게)
      'group-data-[indicator=ready]/topnav:aria-[current=page]:bg-transparent',
    ),
    topline: cn(
      navLinkBase,
      'relative inline-flex h-full items-center rounded-sm px-3 text-body-sm text-fg-muted',
      'hover-fine:text-fg-default aria-[current=page]:font-semibold aria-[current=page]:text-fg-default',
    ),
    tabbar: cn(
      navLinkBase,
      'relative isolate flex min-h-11 flex-1 flex-col items-center justify-center gap-0.5 rounded-full text-caption text-fg-body',
      'active:scale-[.985] aria-[current=page]:font-semibold aria-[current=page]:text-fg-default',
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
  const showIcon = variant !== 'topbar' && variant !== 'topline';
  return (
    <>
      {items.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          aria-current={href === activeHref ? 'page' : undefined}
          className={cls[variant]}
        >
          {variant === 'tabbar' && href === activeHref && (
            // 활성 탭 = 안쪽 알약. 바깥 TabBar 가 backdrop root 라 굴절 대신 틴트 · 하이라이트 · glow 로 구분한다
            <GlassSurface as="span" aria-hidden="true" data-tab-active backdrop="none" appear={false} glow={0.3} className="absolute inset-y-1 inset-x-0.5 -z-10" />
          )}
          {showIcon && <Icon aria-hidden />}
          <span>{label}</span>
        </Link>
      ))}
    </>
  );
}

/**
 * TopBar 활성 표시 — 활성 링크의 위치 · 폭을 재서 표시 하나를 옮긴다. DOM 에 직접 쓴다(리렌더 없음).
 * 첫 배치는 전환 없이(왼쪽에서 날아오지 않게), 이후 activeHref 가 바뀌면 미끄러진다. 폭 변화는 ResizeObserver 로 따라간다.
 */
function useNavIndicator(activeHref: string | undefined, line: boolean) {
  const navRef = React.useRef<HTMLElement>(null);
  const dotRef = React.useRef<HTMLSpanElement>(null);
  React.useEffect(() => {
    const nav = navRef.current;
    const dot = dotRef.current;
    if (!nav || !dot) return;
    const place = () => {
      const a = nav.querySelector<HTMLElement>('a[aria-current="page"]');
      if (!a || a.offsetWidth === 0) {
        delete nav.dataset.indicator;
        dot.style.opacity = '0';
        return;
      }
      const first = nav.dataset.indicator !== 'ready';
      if (first) dot.style.transition = 'none';
      // line 은 글자 폭만큼의 밑줄 — 링크 안 라벨(span)을 nav 기준으로 잰다
      const label = line ? a.querySelector<HTMLElement>('span') : null;
      const x = label ? label.getBoundingClientRect().left - nav.getBoundingClientRect().left : a.offsetLeft;
      dot.style.width = `${(label ?? a).offsetWidth}px`;
      dot.style.transform = `translateX(${x}px)`;
      dot.style.opacity = '1';
      if (first) {
        void dot.offsetWidth; // 전환 없이 자리를 잡은 뒤에 전환을 되살린다
        dot.style.transition = '';
        nav.dataset.indicator = 'ready';
      }
    };
    place();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(place);
    ro.observe(nav);
    return () => ro.disconnect();
  }, [activeHref, line]);
  return { navRef, dotRef };
}

function AppShell({
  navItems,
  activeHref,
  brand = 'buddle',
  brandHref = '/',
  actions,
  sideNav = true,
  topBar = 'pill',
  context,
  LinkComponent,
  className,
  children,
}: AppShellProps) {
  const Link = LinkComponent ?? DefaultLink;
  const scrolled = useScrolled();
  const items = navItems.slice(0, 5);
  const line = topBar === 'line';
  const { navRef, dotRef } = useNavIndicator(activeHref, line);

  return (
    <div className={cn('relative z-10 flex min-h-dvh flex-col', className)}>
      <header
        data-slot="topbar"
        data-variant={topBar}
        data-scrolled={scrolled}
        className={cn(
          'sticky top-0 z-40 flex h-[var(--bs-layout-topbar-h)] items-center pt-[env(safe-area-inset-top)]',
          'bg-transparent transition-[background-color,border-color,box-shadow] duration-[var(--bs-motion-surface)] ease-bs',
          'data-[scrolled=true]:glass-base data-[scrolled=true]:rounded-none',
          line
            ? // 유리 상자가 아니라 아래 실선 하나 — glass base 의 좌우 · 위 테두리와 그림자를 끈다(important: 유틸리티 순서와 무관하게)
              'border-b border-transparent data-[scrolled=true]:border-x-0! data-[scrolled=true]:border-t-0! data-[scrolled=true]:shadow-none!'
            : 'gap-4 px-4 medium:px-6 data-[scrolled=true]:border-x-0 data-[scrolled=true]:border-t-0',
        )}
      >
        {line ? (
          <div data-slot="topbar-inner" className="mx-auto flex h-full w-full max-w-landing items-center gap-3 px-4 medium:px-8">
            <Link href={brandHref} className="focus-ring rounded-sm text-h3 font-bold lowercase text-fg-default">
              {brand}
            </Link>
            {context && (
              <div data-slot="topbar-context" className="flex min-w-0 items-center text-body-sm text-fg-muted">
                {context}
              </div>
            )}
            <nav ref={navRef} aria-label="주 메뉴" className="group/topnav relative ml-auto hidden h-full items-center medium:flex">
              <NavLinks items={items} activeHref={activeHref} Link={Link} variant="topline" />
              <span
                ref={dotRef}
                data-slot="nav-indicator"
                aria-hidden="true"
                className={cn(
                  'pointer-events-none absolute bottom-0 left-0 h-0.5 rounded-full bg-fg-default opacity-0',
                  'transition-[transform,width,opacity] duration-[var(--bs-motion-surface)] ease-bs motion-reduce:transition-none',
                )}
              />
            </nav>
            {actions && (
              <>
                <span aria-hidden="true" className="hidden h-4 w-px bg-border-default medium:block" />
                <div className="ml-auto flex items-center gap-1 medium:ml-0">{actions}</div>
              </>
            )}
          </div>
        ) : (
          <>
            <Link href={brandHref} className="focus-ring text-h3 font-bold lowercase text-fg-default rounded-sm">
              {brand}
            </Link>
            <nav ref={navRef} aria-label="주 메뉴" className="group/topnav relative hidden items-center gap-1 medium:flex">
              <span
                ref={dotRef}
                data-slot="nav-indicator"
                aria-hidden="true"
                className={cn(
                  'pointer-events-none absolute top-1/2 left-0 h-8 -translate-y-1/2 rounded-full bg-accent-subtle-bg opacity-0',
                  'transition-[transform,width,opacity] duration-[var(--bs-motion-surface)] ease-bs motion-reduce:transition-none',
                )}
              />
              <NavLinks items={items} activeHref={activeHref} Link={Link} variant="topbar" />
            </nav>
            <div className="ml-auto flex items-center gap-2">{actions}</div>
          </>
        )}
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
        <main className="min-w-0 flex-1 pb-[calc(var(--bs-layout-tabbar-h)+env(safe-area-inset-bottom)+var(--spacing)*6)] medium:pb-0">
          {children}
        </main>
      </div>

      <GlassSurface
        as="nav"
        aria-label="하단 탭"
        intensity={0.55}
        density="dense"
        className={cn(
          'fixed inset-x-3 bottom-[calc(env(safe-area-inset-bottom)+var(--spacing)*3)] z-40 flex h-[var(--bs-layout-tabbar-h)] items-stretch p-1',
          'medium:hidden',
        )}
      >
        <NavLinks items={items} activeHref={activeHref} Link={Link} variant="tabbar" />
      </GlassSurface>
    </div>
  );
}

export { AppShell, type AppShellProps };
