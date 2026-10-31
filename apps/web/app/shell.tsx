'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CalendarDays, FileText, Home } from 'lucide-react';

import { AppShell, type NavItem } from '@sandbox/ui/components/app-shell';
import { ThemeToggle } from '@sandbox/ui/components/theme-toggle';

const NAV: NavItem[] = [
  { href: '/', label: '소개', icon: Home },
  { href: '/blog', label: '블로그', icon: FileText },
  { href: '/calendar', label: '캘린더', icon: CalendarDays },
];

/** AppShell 에 라우터 Link · 현재 경로 · 테마 토글을 꽂는 클라이언트 경계. 랜딩/블로그/캘린더 공통. */
export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const active = NAV.find((n) => (n.href === '/' ? pathname === '/' : pathname.startsWith(n.href)))?.href;
  return (
    <AppShell navItems={NAV} activeHref={active} sideNav={false} LinkComponent={Link} actions={<ThemeToggle />}>
      {children}
    </AppShell>
  );
}
