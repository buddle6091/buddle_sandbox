import type { Meta, StoryObj } from '@storybook/react-vite';
import { CalendarDays, FileText, PenLine, User } from 'lucide-react';

import { AmbientBackground } from './ambient-background';
import { AppShell, type NavItem } from './app-shell';
import { Badge } from './badge';
import { Button } from './button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';

const NAV: NavItem[] = [
  { href: '#blog', label: '블로그', icon: FileText },
  { href: '#calendar', label: '캘린더', icon: CalendarDays },
  { href: '#account', label: '내 계정', icon: User },
];

const meta = {
  title: 'Shell/AppShell',
  component: AppShell,
  parameters: { layout: 'fullscreen' },
  args: { navItems: NAV, activeHref: '#blog', children: null },
} satisfies Meta<typeof AppShell>;

export default meta;
type Story = StoryObj<typeof meta>;

const Filler = () => (
  <div className="mx-auto flex max-w-[800px] flex-col gap-6 px-4 pt-9">
    <h1 className="text-h1">글 목록</h1>
    {Array.from({ length: 8 }).map((_, i) => (
      <Card key={i} variant={i % 2 ? 'glass' : 'flat'} hover="edge">
        <CardHeader>
          <div className="flex gap-1.5">
            <Badge variant="accent">개발</Badge>
            <Badge>react</Badge>
          </div>
          <CardTitle>스크롤해서 TopBar 가 유리로 바뀌는지 확인 {i + 1}</CardTitle>
          <CardDescription>2026년 10월 2일 · 조회 128 · 댓글 4</CardDescription>
        </CardHeader>
        <CardContent>
          스크롤 0 에서는 TopBar 가 투명이고, 8px 를 넘으면 glass base 로 바뀐다. 광원은 정적이다.
        </CardContent>
      </Card>
    ))}
  </div>
);

export const Blog: Story = {
  name: '블로그 — sideNav 없음 (TopBar 탭 + compact TabBar)',
  args: { sideNav: false },
  render: (args) => (
    <>
      <AmbientBackground />
      <AppShell
        {...args}
        actions={
          <Button size="sm" variant="outline">
            <PenLine />
            새 글
          </Button>
        }
      >
        <Filler />
      </AppShell>
    </>
  ),
};

export const BlogDark: Story = { ...Blog, name: '블로그 — dark', globals: { theme: 'dark' } };

export const Calendar: Story = {
  name: '캘린더 — Rail(768) / Sidebar(1280)',
  args: { activeHref: '#calendar' },
  render: (args) => (
    <>
      <AmbientBackground />
      <AppShell
        {...args}
        actions={
          <>
            <Badge variant="warning">초대 전용 · 조회만</Badge>
            <span className="hidden text-caption text-fg-muted medium:inline">guest@example.com</span>
            <Button size="sm" variant="ghost">
              로그아웃
            </Button>
          </>
        }
      >
        <div className="px-4 pt-6">
          <h1 className="text-h1">2026년 10월</h1>
          <div className="mt-6 grid grid-cols-7 gap-px overflow-hidden rounded-lg border border-border-default bg-border-default">
            {Array.from({ length: 35 }).map((_, i) => (
              <div key={i} className="min-h-[76px] bg-bg-default p-2 text-caption text-fg-muted">
                {(i % 31) + 1}
              </div>
            ))}
          </div>
        </div>
      </AppShell>
    </>
  ),
};

export const CalendarDark: Story = { ...Calendar, name: '캘린더 — dark', globals: { theme: 'dark' } };

export const Ambient: Story = {
  name: 'AmbientBackground 단독',
  render: () => (
    <div className="relative min-h-dvh">
      <AmbientBackground />
      <div className="relative z-10 p-8 text-body text-fg-body">
        광원 3개(primary 좌상 · tertiary 우중 · secondary 하단) + 먹선 5줄. 애니메이션 없음.
      </div>
    </div>
  ),
};
