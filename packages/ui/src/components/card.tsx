import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';

import { cn } from '@sandbox/ui/lib/utils';

/**
 * Card — design.md §6.3 + §5.1
 *
 * variant: glass(기본, base 유리 + 고임 + 굽선; compact 는 blur 없는 flat 유리로 자동 강등) / glass-flat(항상 blur 없음) / flat(bg/default)
 * hover (하나만 선택):
 *   pool — 고임 차오름: background-size 100%→138%(pool 레이어만) + 굽선 accent, 420ms
 *   lift — 3px 부상 + shadow/md, 300ms. 카드 전체가 링크일 때만(asChild)
 *   edge — 테두리만 accent, 170ms. 항목이 많은 리스트
 * radius/card 는 12/14/16(compact/medium/expanded) — styles.css 의 --bs-radius-card.
 */
const cardVariants = cva(
  ['flex flex-col gap-3 rounded-[var(--bs-radius-card)] p-6 text-fg-default', 'focus-ring'],
  {
    variants: {
      variant: {
        // compact 에서는 blur 없이(화면당 backdrop-filter 2개 = TopBar·TabBar), medium 부터 유리
        glass: 'glass-base-flat medium:glass-base',
        'glass-flat': 'glass-base-flat',
        flat: 'border border-border-default bg-bg-default shadow-sm',
      },
      hover: {
        none: '',
        pool: [
          'transition-[background-size,border-color] duration-[var(--bs-motion-pool)] ease-bs',
          'hover-fine:bg-size-[138%_138%] hover-fine:border-b-accent-default/55',
          'motion-reduce:transition-colors',
        ],
        lift: [
          'transition-[transform,box-shadow] duration-[var(--bs-motion-surface)] ease-bs',
          'hover-fine:-translate-y-[3px] hover-fine:shadow-md',
          'motion-reduce:transition-[box-shadow] motion-reduce:hover-fine:translate-y-0',
        ],
        edge: [
          'transition-colors duration-[var(--bs-motion-control)] ease-bs',
          'hover-fine:border-accent-default',
          'motion-reduce:transition-colors',
        ],
      },
    },
    defaultVariants: {
      variant: 'glass',
      hover: 'none',
    },
  },
);

type CardProps = React.ComponentProps<'div'> &
  VariantProps<typeof cardVariants> & {
    /** 카드 전체가 링크/버튼일 때 자식 요소에 스타일만 입힌다. */
    asChild?: boolean;
  };

function Card({ className, variant = 'glass', hover = 'none', asChild = false, ...props }: CardProps) {
  const Comp = asChild ? Slot.Root : 'div';
  return (
    <Comp
      data-slot="card"
      data-variant={variant}
      data-hover={hover}
      className={cn(cardVariants({ variant, hover }), className)}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="card-header" className={cn('flex flex-col gap-1', className)} {...props} />;
}

function CardTitle({ className, ...props }: React.ComponentProps<'h3'>) {
  return <h3 data-slot="card-title" className={cn('text-h3 text-fg-default', className)} {...props} />;
}

function CardDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p data-slot="card-description" className={cn('text-body-sm text-fg-muted', className)} {...props} />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="card-content" className={cn('text-body text-fg-body', className)} {...props} />;
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="card-footer" className={cn('flex items-center gap-2', className)} {...props} />;
}

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, cardVariants, type CardProps };
