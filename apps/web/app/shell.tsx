'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CalendarDays, FileText, Home } from 'lucide-react';

import { AppShell, type NavItem } from '@sandbox/ui/components/app-shell';

const NAV: NavItem[] = [
  { href: '/', label: '소개', icon: Home },
  { href: '/blog', label: '블로그', icon: FileText },
  { href: '/calendar', label: '캘린더', icon: CalendarDays },
];

/** AppShell 에 라우터 Link 와 현재 경로를 꽂는 클라이언트 경계. 블로그/캘린더/랜딩 공통. */
export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const active = NAV.find((n) => (n.href === '/' ? pathname === '/' : pathname.startsWith(n.href)))?.href;
  return (
    <AppShell navItems={NAV} activeHref={active} sideNav={false} LinkComponent={Link}>
      {children}
    </AppShell>
  );
}
