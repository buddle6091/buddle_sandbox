import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Button, buttonVariants } from './button';
import { expectTokenOnly } from '../test-utils/class-rules';

describe('Button — design.md §6.1', () => {
  it('button role 로 렌더되고 클릭을 전달한다', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>저장</Button>);
    await userEvent.click(screen.getByRole('button', { name: '저장' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it.each([
    ['primary', ['bg-accent-default', 'text-accent-fg-on', 'shadow-md']],
    ['glass', ['glass-base-flat', 'medium:glass-base', 'text-fg-default']],
    ['secondary', ['bg-bg-muted', 'text-fg-default']],
    ['ghost', ['hover-fine:bg-accent-subtle-bg']],
    ['outline', ['border-border-default', 'hover-fine:border-accent-default']],
    ['danger', ['bg-danger-default']],
  ] as const)('variant=%s 가 토큰 유틸리티로 그려진다', (variant, classes) => {
    render(<Button variant={variant}>x</Button>);
    const el = screen.getByRole('button');
    for (const c of classes) expect(el).toHaveClass(c);
    expect(el).toHaveAttribute('data-variant', variant);
  });

  it.each([
    ['sm', 'h-8'],
    ['md', 'h-11'],
    ['lg', 'h-12'],
    ['icon', 'size-11'],
  ] as const)('size=%s 높이 — compact 는 44 터치, expanded 에서 md 40', (size, h) => {
    render(<Button size={size}>x</Button>);
    expect(screen.getByRole('button')).toHaveClass(h);
  });

  it('md/icon 은 expanded 이상에서 40 으로 줄어든다', () => {
    render(<Button size="md">x</Button>);
    expect(screen.getByRole('button')).toHaveClass('expanded:h-10');
  });

  it('타이포 — md 는 label, sm 12px/600, lg 15px/600 (색 토큰과 공존해야 한다)', () => {
    const { rerender } = render(<Button size="md">x</Button>);
    expect(screen.getByRole('button')).toHaveClass('text-label', 'text-accent-fg-on');
    rerender(<Button size="sm">x</Button>);
    expect(screen.getByRole('button')).toHaveClass('text-caption', 'font-semibold', 'text-accent-fg-on');
    rerender(<Button size="lg">x</Button>);
    expect(screen.getByRole('button')).toHaveClass('text-body', 'font-semibold', 'rounded-lg');
  });

  it('기본값은 primary / md', () => {
    render(<Button>x</Button>);
    const el = screen.getByRole('button');
    expect(el).toHaveAttribute('data-variant', 'primary');
    expect(el).toHaveAttribute('data-size', 'md');
  });

  it('disabled 는 50% opacity + 클릭 차단', async () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        x
      </Button>,
    );
    const el = screen.getByRole('button');
    expect(el).toBeDisabled();
    expect(el).toHaveClass('disabled:opacity-50');
    await userEvent.click(el);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('focus-visible 에 shadow/ring 을 쓴다(focus-ring 유틸리티)', () => {
    render(<Button>x</Button>);
    expect(screen.getByRole('button')).toHaveClass('focus-ring');
  });

  it('키보드로 도달하고 Enter/Space 로 실행된다', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>x</Button>);
    await userEvent.tab();
    expect(screen.getByRole('button')).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('asChild 로 링크에 버튼 스타일을 입힌다', () => {
    render(
      <Button asChild variant="outline">
        <a href="/posts">글 목록</a>
      </Button>,
    );
    const link = screen.getByRole('link', { name: '글 목록' });
    expect(link).toHaveClass('border-border-default');
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('모션 규칙 — transition-all 금지, hover: 금지(hover-fine: 만), ease-bs, reduced-motion', () => {
    for (const variant of ['primary', 'glass', 'secondary', 'ghost', 'outline', 'danger'] as const) {
      for (const size of ['sm', 'md', 'lg', 'icon'] as const) {
        expectTokenOnly(buttonVariants({ variant, size }));
      }
    }
    expect(buttonVariants({})).toMatch(/\bease-bs\b/);
    expect(buttonVariants({})).toMatch(/motion-reduce:/);
  });
});
