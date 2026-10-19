import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

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
import { expectTokenOnly } from '../test-utils/class-rules';

describe('Popover — design.md §6.5', () => {
  const Tree = () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="glass">일정</Button>
      </PopoverTrigger>
      <PopoverContent>
        <p>React 심화 과정</p>
      </PopoverContent>
    </Popover>
  );

  it('열리면 solid glass + radius/md + offset 8, scale .96→1 170ms', async () => {
    render(<Tree />);
    await userEvent.click(screen.getByRole('button', { name: '일정' }));
    const content = await screen.findByRole('dialog');
    expect(content).toHaveClass('glass-solid', 'rounded-md', 'p-4');
    expect(content).toHaveClass('data-[state=open]:animate-bs-pop-in', 'data-[state=closed]:animate-bs-pop-out');
    expect(content).toHaveClass('origin-(--radix-popover-content-transform-origin)');
    expectTokenOnly(content.className);
  });

  it('Esc 로 닫힌다', async () => {
    render(<Tree />);
    await userEvent.click(screen.getByRole('button', { name: '일정' }));
    await screen.findByRole('dialog');
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  });
});

describe('DropdownMenu — design.md §6.5', () => {
  const Tree = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="블록 메뉴">
          ⋮
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>블록</DropdownMenuLabel>
        <DropdownMenuItem>
          유형 변경
          <DropdownMenuShortcut>⌘/</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>복제</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="danger">삭제</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  it('menu/menuitem 역할, 항목 높이 48/40/34(compact/medium/expanded), solid glass', async () => {
    render(<Tree />);
    await userEvent.click(screen.getByRole('button', { name: '블록 메뉴' }));
    const menu = await screen.findByRole('menu');
    expect(menu).toHaveClass('glass-solid', 'rounded-md', 'p-1');
    const items = screen.getAllByRole('menuitem');
    expect(items).toHaveLength(3);
    expect(items[0]).toHaveClass('h-12', 'medium:h-10', 'expanded:h-8.5', 'rounded-sm');
    expect(items[0]).toHaveClass('focus:bg-accent-subtle-bg');
    expectTokenOnly(menu.className);
    expectTokenOnly(items[0].className);
  });

  it('danger 항목은 danger 색', async () => {
    render(<Tree />);
    await userEvent.click(screen.getByRole('button', { name: '블록 메뉴' }));
    const del = await screen.findByRole('menuitem', { name: '삭제' });
    expect(del).toHaveAttribute('data-variant', 'danger');
    expect(del).toHaveClass('data-[variant=danger]:text-danger-default');
  });

  it('화살표 키로 항목을 이동하고 Esc 로 닫는다', async () => {
    render(<Tree />);
    const trigger = screen.getByRole('button', { name: '블록 메뉴' });
    trigger.focus();
    await userEvent.keyboard('{ArrowDown}');
    const items = await screen.findAllByRole('menuitem');
    await waitFor(() => expect(items[0]).toHaveFocus());
    await userEvent.keyboard('{ArrowDown}');
    expect(items[1]).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
  });

  it('단축키 표시는 Mono caption', async () => {
    render(<Tree />);
    await userEvent.click(screen.getByRole('button', { name: '블록 메뉴' }));
    expect(await screen.findByText('⌘/')).toHaveClass('font-mono', 'text-caption', 'text-fg-muted');
  });
});

describe('Tooltip — design.md §6.8', () => {
  it('유리 금지 — 불투명 반전 표면(bg/inverse + fg/inverse), radius/sm; compact(hover 없음)에서는 숨김', async () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost">조회 전용</Button>
          </TooltipTrigger>
          <TooltipContent>이 캘린더는 조회만 가능해요</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );
    await userEvent.hover(screen.getByRole('button', { name: '조회 전용' }));
    const tip = await screen.findByRole('tooltip');
    const box = tip.closest('[data-slot="tooltip-content"]') as HTMLElement;
    expect(box).toHaveClass('bg-bg-inverse', 'text-fg-inverse', 'rounded-sm', 'text-caption');
    expect(box.className).not.toMatch(/glass|backdrop-blur/);
    expect(box).toHaveClass('[@media(hover:none)]:hidden');
    expectTokenOnly(box.className);
  });
});
