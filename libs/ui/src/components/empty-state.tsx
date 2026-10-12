import * as React from 'react';

import { cn } from '@sandbox/ui/lib/utils';

/**
 * EmptyState — STATES.md 공통
 * 제목 16/700 + 설명 body-sm muted + 행동 1개. 점선 자리표시, 아이콘 없음.
 */
type EmptyStateProps = Omit<React.ComponentProps<'section'>, 'title'> & {
  title: React.ReactNode;
  description?: React.ReactNode;
  /** 행동은 하나만 */
  action?: React.ReactNode;
  /** 점선 자리표시 숨김 */
  placeholder?: boolean;
};

function EmptyState({ title, description, action, placeholder = true, className, ...props }: EmptyStateProps) {
  return (
    <section
      data-slot="empty-state"
      className={cn('flex flex-col items-center gap-3 px-6 py-12 text-center', className)}
      {...props}
    >
      {placeholder && (
        <div
          data-slot="empty-placeholder"
          aria-hidden="true"
          className="mb-1 size-14 rounded-lg border border-dashed border-border-strong"
        />
      )}
      <h2 className="text-[16px] leading-6 font-bold text-fg-default">{title}</h2>
      {description && <p className="max-w-[360px] text-body-sm text-fg-muted">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </section>
  );
}

export { EmptyState, type EmptyStateProps };
