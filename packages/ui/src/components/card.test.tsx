import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  cardVariants,
} from './card';
import { expectTokenOnly } from '../test-utils/class-rules';

describe('Card — design.md §6.3', () => {
  it('기본 = glass base: 유리 + 고임 + 굽선 + radius/card + 패딩 space/6', () => {
    render(<Card data-testid="c">x</Card>);
    const el = screen.getByTestId('c');
    // compact 는 blur 없는 glass-base-flat, medium 부터 glass-base (design.md §3.1 blur 2개 제한)
    expect(el).toHaveClass('glass-base-flat', 'medium:glass-base', 'rounded-[var(--bs-radius-card)]', 'p-6');
    expect(el.className).not.toMatch(/(^|\s)glass-base(\s|$)/);
    expect(el).toHaveAttribute('data-variant', 'glass');
    expectTokenOnly(el.className);
  });

  it('flat = bg/default + border/default + shadow/sm (리스트·표 안)', () => {
    render(
      <Card variant="flat" data-testid="c">
        x
      </Card>,
    );
    const el = screen.getByTestId('c');
    expect(el).toHaveClass('bg-bg-default', 'border-border-default', 'shadow-sm');
    expect(el).not.toHaveClass('glass-base');
  });

  it('glass-flat = blur 없는 유리 (compact 리스트, 화면당 blur 2개 제한)', () => {
    render(
      <Card variant="glass-flat" data-testid="c">
        x
      </Card>,
    );
    expect(screen.getByTestId('c')).toHaveClass('glass-base-flat');
  });

  it.each([
    ['pool', ['hover-fine:bg-size-[138%_138%]', 'duration-[var(--bs-motion-pool)]']],
    ['lift', ['hover-fine:-translate-y-[3px]', 'hover-fine:shadow-md', 'duration-[var(--bs-motion-surface)]']],
    ['edge', ['hover-fine:border-accent-default', 'duration-[var(--bs-motion-control)]']],
  ] as const)('hover=%s — 하나만 선택, 이징 ease-bs, reduced-motion', (hover, classes) => {
    const cls = cardVariants({ hover });
    for (const c of classes) expect(cls).toContain(c);
    expect(cls).toMatch(/\bease-bs\b/);
    expect(cls).toMatch(/motion-reduce:/);
    expectTokenOnly(cls);
  });

  it('hover 기본값은 none — 전환 클래스가 없다', () => {
    render(<Card data-testid="c">x</Card>);
    expect(screen.getByTestId('c').className).not.toMatch(/hover-fine:/);
  });

  it('구조 — Title h3 / Description body-sm muted / gap space/3', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>제목</CardTitle>
          <CardDescription>설명</CardDescription>
        </CardHeader>
        <CardContent>본문</CardContent>
        <CardFooter>푸터</CardFooter>
      </Card>,
    );
    const title = screen.getByText('제목');
    expect(title.tagName).toBe('H3');
    expect(title).toHaveClass('text-h3', 'text-fg-default');
    expect(screen.getByText('설명')).toHaveClass('text-body-sm', 'text-fg-muted');
    expect(screen.getByText('제목').closest('[data-slot="card-header"]')).toHaveClass('gap-1');
    expect(screen.getByText('본문').closest('[data-slot="card"]')).toHaveClass('gap-3');
  });

  it('asChild — 카드 전체가 링크일 때(lift 용)', () => {
    render(
      <Card asChild hover="lift">
        <a href="/posts/a">글</a>
      </Card>,
    );
    expect(screen.getByRole('link', { name: '글' })).toHaveClass('medium:glass-base', 'hover-fine:-translate-y-[3px]');
  });
});
