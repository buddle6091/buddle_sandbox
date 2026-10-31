import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Badge, badgeVariants } from './badge';
import { expectTokenOnly } from '../test-utils/class-rules';

describe('Badge — design.md §6.4', () => {
  it('치수 — 22h, 좌우 9, radius/sm, caption 600, 16자 말줄임', () => {
    render(<Badge>개발</Badge>);
    const inner = screen.getByText('개발');
    const el = inner.closest('[data-slot="badge"]') as HTMLElement;
    expect(el.tagName).toBe('SPAN');
    expect(el).toHaveClass('h-5.5', 'px-2.25', 'rounded-sm', 'text-caption', 'font-semibold');
    // 세로 가운데 정렬(inline-flex) + 말줄임은 내부 span
    expect(el).toHaveClass('inline-flex', 'items-center', 'max-w-[16ch]');
    expect(inner).toHaveClass('truncate');
  });

  it.each([
    ['default', ['bg-bg-muted', 'text-fg-muted']],
    ['glass', ['glass-subtle', 'text-fg-default']],
    ['accent', ['bg-accent-subtle-bg', 'text-accent-default']],
    ['outline', ['border-border-default', 'text-fg-body']],
    ['success', ['border-success-default/40', 'text-fg-default']],
    ['warning', ['border-warning-default/40', 'text-fg-default']],
    ['danger', ['border-danger-default/40', 'text-fg-default']],
  ] as const)('variant=%s', (variant, classes) => {
    render(<Badge variant={variant}>x</Badge>);
    const el = screen.getByText('x').closest('[data-slot="badge"]') as HTMLElement;
    for (const c of classes) expect(el).toHaveClass(c);
    expect(el).toHaveAttribute('data-variant', variant);
    expectTokenOnly(badgeVariants({ variant }));
  });

  it('상태 variant 의 글자는 fg/default — 상태색 텍스트는 12px 에서 4.5:1 을 못 넘긴다', () => {
    for (const variant of ['success', 'warning', 'danger'] as const) {
      const cls = badgeVariants({ variant });
      expect(cls).not.toMatch(/\btext-(success|warning|danger)-default\b/);
    }
  });

  it('asChild 로 링크 칩을 만든다', () => {
    render(
      <Badge asChild variant="accent">
        <a href="/tags/react">react</a>
      </Badge>,
    );
    expect(screen.getByRole('link', { name: 'react' })).toHaveClass('bg-accent-subtle-bg');
  });
});
