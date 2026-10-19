'use client';

import * as React from 'react';

import { cn } from '@sandbox/ui/lib/utils';
import { useDelayedVisible } from '../hooks/use-delayed-visible';

type SkeletonProps = React.ComponentProps<'div'> & {
  /**
   * STATES.md — 300ms 안에 응답하면 띄우지 않는다.
   * true = 300ms, 숫자 = 그 ms 만큼 지연. 기본 false(즉시, 상위에서 지연을 제어할 때).
   */
  delay?: boolean | number;
};

/** Skeleton — bg/muted 단색, 투명도 .6↔1 1.2s 펄스. 장식이 아니라 자리표시이므로 aria-hidden. */
function Skeleton({ className, delay = false, ...props }: SkeletonProps) {
  const visible = useDelayedVisible(delay === false ? false : delay === true ? 300 : delay);
  if (!visible) return null;
  return (
    <div
      data-slot="skeleton"
      aria-hidden="true"
      className={cn('rounded-md bg-bg-muted animate-bs-pulse', className)}
      {...props}
    />
  );
}

export { Skeleton, type SkeletonProps };
