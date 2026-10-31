import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { toast, Toaster, toastUndo } from './toast';

describe('Toast — STATES.md 공통: 하단 중앙, 반전 표면, 4s, 액션 1개', () => {
  it('Toaster 는 bottom-center (영역은 첫 토스트 때 마운트된다)', async () => {
    render(<Toaster />);
    act(() => {
      toast('위치 확인');
    });
    await screen.findByText('위치 확인');
    const region = document.querySelector('[data-sonner-toaster]');
    expect(region).toHaveAttribute('data-x-position', 'center');
    expect(region).toHaveAttribute('data-y-position', 'bottom');
  });

  it('toast() 가 메시지를 반전 표면(bg/inverse) 48h radius/lg 로 띄운다', async () => {
    render(<Toaster />);
    act(() => {
      toast('글을 게시했어요', { action: { label: '보기', onClick: () => undefined } });
    });
    const el = await screen.findByText('글을 게시했어요');
    const li = el.closest('[data-sonner-toast]') as HTMLElement;
    expect(li).toHaveClass('bg-bg-inverse', 'text-fg-inverse', 'rounded-lg', 'min-h-12');
    expect(screen.getByRole('button', { name: '보기' })).toBeInTheDocument();
  });

  it('toastUndo — 「실행 취소」 5초, 누르면 onUndo', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const onUndo = vi.fn();
    render(<Toaster />);
    act(() => {
      toastUndo('댓글을 삭제했어요', onUndo);
    });
    const undo = await screen.findByRole('button', { name: '실행 취소' });
    await userEvent.click(undo);
    expect(onUndo).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  it('토스트는 아래서 8px 올라온다(animate-bs-rise-in)', async () => {
    render(<Toaster />);
    act(() => {
      toast('저장됨');
    });
    const li = (await screen.findByText('저장됨')).closest('[data-sonner-toast]') as HTMLElement;
    await waitFor(() => expect(li.className).toMatch(/animate-bs-rise-in/));
  });
});
