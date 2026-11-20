'use client';

import { ViewTransition } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CalendarDays, FileText, Home } from 'lucide-react';

import { AppShell, type NavItem } from '@sandbox/ui/components/app-shell';
import { ThemeToggle } from '@sandbox/ui/components/theme-toggle';

import { CommandPalette, CommandPaletteTrigger } from './command-palette';
import { Masthead } from './masthead';
import { SectionCrumb } from './section-crumb';

const NAV: NavItem[] = [
  { href: '/', label: '소개', icon: Home },
  { href: '/blog', label: '블로그', icon: FileText },
  { href: '/calendar', label: '캘린더', icon: CalendarDays },
];

/** AppShell 에 라우터 Link · 현재 경로 · ⌘K 팔레트 · 테마 토글을 꽂는 클라이언트 경계. 랜딩/블로그/캘린더 공통. */
export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const active = NAV.find((n) => (n.href === '/' ? pathname === '/' : pathname.startsWith(n.href)))?.href;
  return (
    <AppShell
      navItems={NAV}
      activeHref={active}
      sideNav={false}
      topBar="line"
      masthead={
        <Masthead
          actions={
            <>
              <CommandPaletteTrigger />
              <ThemeToggle />
            </>
          }
        />
      }
      context={pathname === '/' ? <SectionCrumb /> : null}
      LinkComponent={Link}
      actions={
        <>
          <CommandPalette />
          <ThemeToggle />
        </>
      }
    >
      {/* 라우트 전환 — 브라우저 View Transitions 로 본문만 교차 페이드(TopBar 는 그대로, 활성 탭 표시는 미끄러진다).
          미지원 브라우저 · reduced-motion 에서는 즉시 바뀐다(globals.css). */}
      <ViewTransition>{children}</ViewTransition>
    </AppShell>
  );
}
