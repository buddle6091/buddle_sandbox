import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';

import { cn } from '@sandbox/ui/lib/utils';

/**
 * Button — design.md §6.1
 *
 * variants: primary / glass / secondary / ghost / outline / danger
 * sizes:    sm 32 / md 40(compact·medium 44) / lg 48 / icon 40²(44²)
 * states:   hover(accent/hover, 170ms) · focus-visible(shadow/ring) · disabled(50%)
 *
 * 모션: 전환 대상 나열(transition-all 금지), ease-bs, control 170ms.
 * 터치: active scale .985, reduced-motion 에서는 색만.
 */
const buttonVariants = cva(
  [
    'inline-flex shrink-0 select-none items-center justify-center gap-2 whitespace-nowrap rounded-md',
    'text-label focus-ring',
    'transition-[background-color,color,border-color,box-shadow,transform,filter]',
    'duration-[var(--bs-motion-control)] ease-bs',
    'active:scale-[.985] motion-reduce:transition-colors motion-reduce:active:scale-100',
    'disabled:pointer-events-none disabled:opacity-50',
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ],
  {
    variants: {
      variant: {
        primary: 'bg-accent-default text-accent-fg-on shadow-md hover-fine:bg-accent-hover',
        glass: 'glass-base text-fg-default hover-fine:border-b-accent-default',
        secondary:
          'bg-bg-muted text-fg-default hover-fine:bg-accent-subtle-bg hover-fine:text-accent-hover',
        ghost: 'text-fg-default hover-fine:bg-accent-subtle-bg hover-fine:text-accent-hover',
        outline:
          'border border-border-default bg-transparent text-fg-default hover-fine:border-accent-default hover-fine:text-accent-hover',
        danger: 'bg-danger-default text-accent-fg-on shadow-md hover-fine:brightness-95',
      },
      size: {
        // sm 32h — 터치 타깃 예외(보조 액션 전용). 타이포 12px/600.
        sm: 'h-8 px-3 text-caption font-semibold has-[>svg]:px-2.5',
        // md — compact/medium 44h, expanded 40h (layout/touch)
        md: 'h-11 px-4 expanded:h-10 has-[>svg]:px-3',
        // lg 48h, radius/lg, 15px
        lg: 'h-12 rounded-lg px-6 text-body font-semibold has-[>svg]:px-4',
        icon: 'size-11 expanded:size-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

type ButtonProps = React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    /** 자식 요소(예: <a>)에 버튼 스타일만 입힌다. */
    asChild?: boolean;
  };

function Button({
  className,
  variant = 'primary',
  size = 'md',
  asChild = false,
  type,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : 'button';

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      // 폼 안에서 의도치 않은 submit 을 막는다. asChild 는 자식 요소가 결정.
      type={asChild ? type : (type ?? 'button')}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Button, buttonVariants, type ButtonProps };
