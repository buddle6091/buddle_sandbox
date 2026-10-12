import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { Skeleton } from './skeleton';
import { expectTokenOnly } from '../test-utils/class-rules';

describe('Skeleton — STATES.md: bg/muted 단색, 1.2s 펄스, 300ms 지연', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('bg/muted + animate-bs-pulse, aria-hidden', () => {
    render(<Skeleton className="h-4 w-40" data-testid="s" />);
    const el = screen.getByTestId('s');
    expect(el).toHaveClass('bg-bg-muted', 'animate-bs-pulse', 'rounded-md');
    expect(el).toHaveAttribute('aria-hidden', 'true');
    expectTokenOnly(el.className);
  });

  it('delay — 300ms 안에 응답하면 띄우지 않는다', () => {
    render(<Skeleton delay data-testid="s" />);
    expect(screen.queryByTestId('s')).toBeNull();
    act(() => vi.advanceTimersByTime(299));
    expect(screen.queryByTestId('s')).toBeNull();
    act(() => vi.advanceTimersByTime(1));
    expect(screen.getByTestId('s')).toBeInTheDocument();
  });

  it('delay 숫자로 지연 시간을 바꿀 수 있다', () => {
    render(<Skeleton delay={100} data-testid="s" />);
    act(() => vi.advanceTimersByTime(100));
    expect(screen.getByTestId('s')).toBeInTheDocument();
  });
});

describe('Avatar — design.md §6.9', () => {
  it.each([
    ['xs', 'size-6'],
    ['sm', 'size-8'],
    ['md', 'size-10'],
    ['lg', 'size-14'],
  ] as const)('size=%s → 24/32/40/56', (size, cls) => {
    render(
      <Avatar size={size} data-testid="a">
        <AvatarFallback>버</AvatarFallback>
      </Avatar>,
    );
    expect(screen.getByTestId('a')).toHaveClass(cls, 'rounded-full');
  });

  it('fallback = 이니셜 1자 + accent/subtle-bg + accent/fg-strong', () => {
    render(
      <Avatar>
        <AvatarImage src="" alt="버들" />
        <AvatarFallback>버들</AvatarFallback>
      </Avatar>,
    );
    const fb = screen.getByText('버');
    expect(fb).toHaveClass('bg-accent-subtle-bg', 'text-accent-fg-strong');
    expectTokenOnly(fb.className);
  });
});
