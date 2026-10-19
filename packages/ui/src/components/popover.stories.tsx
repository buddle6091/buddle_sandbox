import type { Meta, StoryObj } from '@storybook/react-vite';
import { Copy, Ellipsis, Lock, Pencil, Trash2 } from 'lucide-react';

import { Badge } from './badge';
import { Button } from './button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from './dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';

const meta = {
  title: 'Components/Popover',
  component: Popover,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

/** SCREENS.md §D — 캘린더 일정 팝오버 260w radius/lg */
const EventPopover = () => (
  <Popover defaultOpen>
    <PopoverTrigger asChild>
      <Button variant="glass" size="sm">
        React 심화 과정
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-[260px] rounded-lg">
      <div className="flex items-start justify-between">
        <Badge variant="accent">강의</Badge>
      </div>
      <h2 className="mt-2 text-body font-semibold">React 심화 과정 3주차</h2>
      <dl className="mt-3 grid grid-cols-[52px_1fr] gap-y-1.5 text-body-sm">
        <dt className="text-fg-muted">시간</dt>
        <dd>10:00 – 13:00</dd>
        <dt className="text-fg-muted">장소</dt>
        <dd>온라인</dd>
        <dt className="text-fg-muted">기관</dt>
        <dd className="flex items-center gap-1.5">
          <span
            aria-label="비공개 기관"
            className="inline-block h-3 w-14 rounded-sm bg-[repeating-linear-gradient(135deg,var(--bs-color-border-strong)_0_2px,transparent_2px_6px)]"
          />
          <Badge variant="outline">비공개</Badge>
        </dd>
        <dt className="text-fg-muted">출처</dt>
        <dd className="text-caption text-fg-muted">구글 캘린더 · 10분 전 동기화</dd>
      </dl>
    </PopoverContent>
  </Popover>
);

export const CalendarEvent: Story = { render: EventPopover };
export const CalendarEventDark: Story = { render: EventPopover, globals: { theme: 'dark' } };

export const BlockMenu: Story = {
  name: 'DropdownMenu — 에디터 블록 핸들 메뉴',
  render: () => (
    <DropdownMenu defaultOpen>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="블록 메뉴">
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>블록</DropdownMenuLabel>
        <DropdownMenuItem>
          <Pencil />
          유형 변경
          <DropdownMenuShortcut>⌘/</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Copy />
          복제
          <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>위로 이동</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="danger">
          <Trash2 />
          삭제
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const ReadOnlyTooltip: Story = {
  name: 'Tooltip — 조회 전용 (hover 기기에서만)',
  render: () => (
    <TooltipProvider>
      <Tooltip defaultOpen>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="조회 전용">
            <Lock />
          </Button>
        </TooltipTrigger>
        <TooltipContent>이 캘린더는 조회만 가능해요</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};
