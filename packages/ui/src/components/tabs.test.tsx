import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { expectTokenOnly } from '../test-utils/class-rules';

const Tree = ({ variant }: { variant?: 'pill' | 'underline' }) => (
  <Tabs defaultValue="all">
    <TabsList variant={variant}>
      <TabsTrigger value="all">전체</TabsTrigger>
      <TabsTrigger value="dev">개발</TabsTrigger>
      <TabsTrigger value="retro">회고</TabsTrigger>
    </TabsList>
    <TabsContent value="all">전체 글</TabsContent>
    <TabsContent value="dev">개발 글</TabsContent>
    <TabsContent value="retro">회고 글</TabsContent>
  </Tabs>
);

describe('Tabs — design.md §6.6', () => {
  it('tablist/tab/tabpanel 역할과 선택 상태', () => {
    render(<Tree />);
    expect(screen.getByRole('tablist')).toBeInTheDocument();
    const tabs = screen.getAllByRole('tab');
    expect(tabs).toHaveLength(3);
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('전체 글');
  });

  it('pill(기본): list h-40 radius/full, 활성 탭만 glass subtle 알약', () => {
    render(<Tree />);
    const list = screen.getByRole('tablist');
    expect(list).toHaveClass('h-10', 'rounded-full');
    expect(list).toHaveAttribute('data-variant', 'pill');
    const active = screen.getByRole('tab', { name: '전체' });
    expect(active).toHaveClass('data-[state=active]:glass-subtle', 'rounded-full');
    expectTokenOnly(list.className);
    expectTokenOnly(active.className);
  });

  it('underline: 본문 내부 탭 — 활성 fg/default 2px 밑줄, 비활성 fg/muted', () => {
    render(<Tree variant="underline" />);
    const list = screen.getByRole('tablist');
    expect(list).toHaveAttribute('data-variant', 'underline');
    expect(list).toHaveClass('border-b', 'border-border-default');
    const tab = screen.getByRole('tab', { name: '개발' });
    expect(tab).toHaveClass('text-fg-muted', 'data-[state=active]:text-fg-default');
    expect(tab.className).toMatch(/after:.*bg-fg-default/);
    expectTokenOnly(tab.className);
  });

  it('compact 가로 스크롤 + 스냅', () => {
    render(<Tree />);
    const list = screen.getByRole('tablist');
    expect(list).toHaveClass('overflow-x-auto', 'snap-x');
    expect(screen.getByRole('tab', { name: '전체' })).toHaveClass('snap-start');
  });

  it('화살표 키로 탭을 옮기면 패널이 바뀐다', async () => {
    render(<Tree />);
    await userEvent.click(screen.getByRole('tab', { name: '전체' }));
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: '개발' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('개발 글');
  });

  it('모션 — 색 전환 170ms, transition-all 금지', () => {
    render(<Tree />);
    const tab = screen.getByRole('tab', { name: '전체' });
    expect(tab).toHaveClass('transition-colors', 'duration-[var(--bs-motion-control)]', 'ease-bs');
  });
});
