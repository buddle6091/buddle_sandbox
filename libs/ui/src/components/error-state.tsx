import * as React from 'react';

import { cn } from '@sandbox/ui/lib/utils';
import { Badge } from './badge';
import { Button } from './button';

/**
 * ErrorState — STATES.md 공통
 * Badge warning + 제목 + 「다시 시도」 primary + Mono caption 디버그(GET /posts · 503).
 */
type ErrorStateProps = Omit<React.ComponentProps<'section'>, 'title'> & {
  title: React.ReactNode;
  description?: React.ReactNode;
  onRetry: () => void;
  retryLabel?: string;
  /** 디버그 문자열 — Mono caption, fg/muted */
  debug?: string;
};

function ErrorState({
  title,
  description,
  onRetry,
  retryLabel = '다시 시도',
  debug,
  className,
  ...props
}: ErrorStateProps) {
  return (
    <section
      role="alert"
      data-slot="error-state"
      className={cn('flex flex-col items-center gap-3 px-6 py-12 text-center', className)}
      {...props}
    >
      <Badge variant="warning">오류</Badge>
      <h2 className="text-[16px] leading-6 font-bold text-fg-default">{title}</h2>
      {description && <p className="max-w-[360px] text-body-sm text-fg-muted">{description}</p>}
      <Button className="mt-2" onClick={onRetry}>
        {retryLabel}
      </Button>
      {debug && <code className="font-mono text-caption text-fg-muted">{debug}</code>}
    </section>
  );
}

export { ErrorState, type ErrorStateProps };
