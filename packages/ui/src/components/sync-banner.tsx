import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@sandbox/ui/lib/utils';
import { Button } from './button';

/**
 * SyncBanner — STATES.md 캘린더 데이터 / 오프라인 띠. 그리드 위 띠 1개.
 *   warning  연결 끊김 (+ 소유자 「다시 연결」)
 *   subtle   동기화 지연
 *   danger   불러오기 실패 (+ 「다시 시도」)
 *   inverse  오프라인(상단 반전 띠, dot 로 상태색)
 */
const bannerVariants = cva(
  'flex min-h-11 w-full items-center gap-3 rounded-md border px-4 py-2 text-body-sm',
  {
    variants: {
      variant: {
        warning: 'border-warning-default/40 bg-warning-default/12 text-fg-default',
        subtle: 'border-border-default bg-bg-subtle text-fg-body',
        danger: 'border-danger-default/40 bg-danger-default/12 text-fg-default',
        inverse: 'border-transparent bg-bg-inverse text-fg-inverse',
      },
    },
    defaultVariants: { variant: 'subtle' },
  },
);

const DOT: Record<'warning' | 'danger' | 'success', string> = {
  warning: 'bg-warning-default',
  danger: 'bg-danger-default',
  success: 'bg-success-default',
};

type SyncBannerProps = React.ComponentProps<'div'> &
  VariantProps<typeof bannerVariants> & {
    /** 액션 1개 */
    action?: { label: string; onClick: () => void };
    /** 좌측 상태 점 */
    dot?: keyof typeof DOT;
  };

function SyncBanner({ variant = 'subtle', action, dot, className, children, ...props }: SyncBannerProps) {
  const v = variant ?? 'subtle';
  return (
    <div
      role="status"
      data-slot="sync-banner"
      data-variant={v}
      className={cn(bannerVariants({ variant: v }), className)}
      {...props}
    >
      {dot && <span data-slot="banner-dot" aria-hidden className={cn('size-2 shrink-0 rounded-full', DOT[dot])} />}
      <span className="min-w-0 flex-1">{children}</span>
      {action && (
        <Button
          size="sm"
          variant={v === 'inverse' ? 'ghost' : 'outline'}
          className={v === 'inverse' ? 'text-fg-inverse hover-fine:text-fg-inverse' : undefined}
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}

export { bannerVariants, SyncBanner, type SyncBannerProps };
