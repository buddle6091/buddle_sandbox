import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';

import { cn } from '@sandbox/ui/lib/utils';

/**
 * Badge / Tag — design.md §6.4
 * 22h, 좌우 9, radius/sm, caption 600, 최대 16자.
 *
 * success/warning/danger 의 글자는 fg/default 다. 상태색(amber 등)을 12px 글자색으로 쓰면
 * 라이트 배경에서 4.5:1 을 넘기지 못한다(§7-2). 상태는 배경 틴트 + 테두리로만 전달한다.
 */
const badgeVariants = cva(
  [
    // inline-flex 로 세로 가운데 정렬(h-8 등으로 키워도 글자가 중앙). 말줄임은 문자열 children 을 감싼 내부 span 이 맡는다
    'inline-flex h-5.5 w-fit max-w-[16ch] shrink-0 items-center justify-center gap-1 rounded-sm border border-transparent px-2.25 align-middle',
    'text-caption leading-none font-semibold whitespace-nowrap',
    'transition-colors duration-[var(--bs-motion-control)] ease-bs',
    'focus-ring [&>svg]:pointer-events-none [&>svg]:shrink-0 [&>svg]:size-3',
  ],
  {
    variants: {
      variant: {
        default: 'bg-bg-muted text-fg-muted',
        glass: 'glass-subtle text-fg-default',
        accent: 'bg-accent-subtle-bg text-accent-default [a&]:hover-fine:bg-accent-default/15',
        outline: 'border-border-default text-fg-body [a&]:hover-fine:border-accent-default',
        success: 'bg-success-default/12 border-success-default/40 text-fg-default',
        warning: 'bg-warning-default/12 border-warning-default/40 text-fg-default',
        danger: 'bg-danger-default/12 border-danger-default/40 text-fg-default',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

type BadgeProps = React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & {
    /** 자식 요소(예: <a>)에 칩 스타일만 입힌다. */
    asChild?: boolean;
  };

function Badge({ className, variant = 'default', asChild = false, children, ...props }: BadgeProps) {
  const Comp = asChild ? Slot.Root : 'span';
  // 문자열은 말줄임 span 으로 감싼다(flex 컨테이너는 직접 텍스트를 말줄임하지 못한다). asChild 는 자식 그대로.
  const content = !asChild && typeof children === 'string' ? <span className="truncate">{children}</span> : children;

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    >
      {content}
    </Comp>
  );
}

export { Badge, badgeVariants, type BadgeProps };
