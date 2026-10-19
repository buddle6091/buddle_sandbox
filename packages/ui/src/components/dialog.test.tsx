import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Button } from './button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog';
import { ResponsiveDialog, ResponsiveDialogContent, ResponsiveDialogTrigger } from './responsive-dialog';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from './sheet';
import { expectTokenOnly } from '../test-utils/class-rules';

function mockViewport(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

const Basic = () => (
  <Dialog>
    <DialogTrigger asChild>
      <Button>게시하기</Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>이 글을 게시할까요?</DialogTitle>
        <DialogDescription>게시하면 목록 맨 위에 보여요.</DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="ghost">취소</Button>
        <Button>게시하기</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

describe('Dialog — design.md §6.7', () => {
  it('트리거로 열리고 role=dialog + 제목/설명이 연결된다', async () => {
    render(<Basic />);
    await userEvent.click(screen.getByRole('button', { name: '게시하기' }));
    const dialog = await screen.findByRole('dialog');
    expect(dialog).toHaveAccessibleName('이 글을 게시할까요?');
    expect(dialog).toHaveAccessibleDescription('게시하면 목록 맨 위에 보여요.');
  });

  it('표면 — solid glass, radius/xl, 패딩 28, max-w 480; 오버레이 overlay/bg + blur 4', async () => {
    render(<Basic />);
    await userEvent.click(screen.getByRole('button', { name: '게시하기' }));
    const dialog = await screen.findByRole('dialog');
    expect(dialog).toHaveClass('glass-solid', 'rounded-xl', 'p-7', 'max-w-[480px]');
    expect(dialog).toHaveClass('data-[state=open]:animate-bs-surface-in');
    expectTokenOnly(dialog.className);
    const overlay = document.querySelector('[data-slot="dialog-overlay"]');
    expect(overlay).toHaveClass('bg-overlay-bg', 'backdrop-blur-[4px]');
  });

  it('제목은 h3 타이포, 설명은 body-sm muted', async () => {
    render(<Basic />);
    await userEvent.click(screen.getByRole('button', { name: '게시하기' }));
    expect(await screen.findByText('이 글을 게시할까요?')).toHaveClass('text-h3');
    expect(screen.getByText('게시하면 목록 맨 위에 보여요.')).toHaveClass('text-body-sm', 'text-fg-muted');
  });

  it('닫기 버튼은 "닫기" 접근 이름, Esc 로 닫힌다, 포커스가 안에 갇힌다', async () => {
    render(<Basic />);
    await userEvent.click(screen.getByRole('button', { name: '게시하기' }));
    await screen.findByRole('dialog');
    expect(screen.getByRole('button', { name: '닫기' })).toBeInTheDocument();
    // 포커스 트랩: Tab 을 여러 번 눌러도 dialog 밖으로 나가지 않는다
    for (let i = 0; i < 6; i++) await userEvent.tab();
    expect(screen.getByRole('dialog').contains(document.activeElement)).toBe(true);
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  });

  it('Footer 는 compact 세로(역순) → medium 가로 우측 정렬', async () => {
    render(<Basic />);
    await userEvent.click(screen.getByRole('button', { name: '게시하기' }));
    await screen.findByRole('dialog');
    const footer = document.querySelector('[data-slot="dialog-footer"]');
    expect(footer).toHaveClass('flex-col-reverse', 'medium:flex-row', 'medium:justify-end');
  });
});

describe('Sheet — design.md §6.7 compact 하단 시트', () => {
  it('bottom(기본): 상단만 radius, 드래그 핸들, max-h 92dvh, safe-area', async () => {
    render(
      <Sheet>
        <SheetTrigger asChild>
          <Button>필터</Button>
        </SheetTrigger>
        <SheetContent>
          <SheetTitle>필터</SheetTitle>
        </SheetContent>
      </Sheet>,
    );
    await userEvent.click(screen.getByRole('button', { name: '필터' }));
    const sheet = await screen.findByRole('dialog');
    expect(sheet).toHaveClass('glass-solid', 'rounded-t-xl', 'max-h-[92dvh]', 'bottom-0', 'inset-x-0');
    expect(sheet).toHaveClass('pb-[env(safe-area-inset-bottom)]');
    expect(sheet).toHaveClass('data-[state=open]:animate-bs-sheet-in');
    expect(sheet.querySelector('[data-slot="sheet-handle"]')).toBeInTheDocument();
    expectTokenOnly(sheet.className);
  });

  it('side=right: 우측 패널, 핸들 없음', async () => {
    render(
      <Sheet defaultOpen>
        <SheetContent side="right">
          <SheetTitle>속성</SheetTitle>
        </SheetContent>
      </Sheet>,
    );
    const sheet = await screen.findByRole('dialog');
    expect(sheet).toHaveClass('right-0', 'inset-y-0');
    expect(sheet.querySelector('[data-slot="sheet-handle"]')).toBeNull();
  });
});

describe('ResponsiveDialog — compact 는 Sheet, medium+ 는 Dialog', () => {
  const Tree = () => (
    <ResponsiveDialog>
      <ResponsiveDialogTrigger asChild>
        <Button>열기</Button>
      </ResponsiveDialogTrigger>
      <ResponsiveDialogContent title="글을 삭제할까요?" description="되돌릴 수 없어요.">
        <Button variant="danger">삭제하기</Button>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );

  it('medium 이상 → 중앙 Dialog', async () => {
    mockViewport(true);
    render(<Tree />);
    await userEvent.click(screen.getByRole('button', { name: '열기' }));
    const dialog = await screen.findByRole('dialog');
    expect(dialog).toHaveClass('rounded-xl');
    expect(dialog).toHaveAccessibleName('글을 삭제할까요?');
    expect(dialog).toHaveAccessibleDescription('되돌릴 수 없어요.');
  });

  it('compact → 하단 Sheet', async () => {
    mockViewport(false);
    render(<Tree />);
    await userEvent.click(screen.getByRole('button', { name: '열기' }));
    const dialog = await screen.findByRole('dialog');
    expect(dialog).toHaveClass('rounded-t-xl');
    expect(dialog).toHaveAccessibleName('글을 삭제할까요?');
  });
});
