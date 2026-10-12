import * as React from 'react';

import { cn } from '@sandbox/ui/lib/utils';

/**
 * Input · Textarea 공통 표면 — design.md §6.2
 * 40h(compact·medium 44), 좌우 space/3, radius/md, bg/default + 음각(shadow/intaglio),
 * border/default → focus accent + shadow/ring, placeholder fg/subtle, error danger, disabled 50%.
 * compact 에서 16px 미만 금지(iOS 자동 확대) → 16px, medium 이상 body(15).
 */
export const fieldSurfaceClass = cn(
  'w-full min-w-0 rounded-md border border-border-default bg-bg-default px-3 text-fg-default shadow-intaglio',
  'text-[16px] medium:text-body placeholder:text-fg-subtle',
  'transition-[border-color,box-shadow] duration-[var(--bs-motion-control)] ease-bs',
  'outline-none focus-visible:border-accent-default focus-visible:shadow-ring',
  'aria-invalid:border-danger-default',
  'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
);

export function FieldError({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <p id={id} data-slot="input-error" role="alert" className="text-caption text-danger-default">
      {children}
    </p>
  );
}

type InputProps = React.ComponentProps<'input'> & {
  /** 유효성 메시지. 있으면 danger 테두리 + 하단 caption + aria-invalid/aria-describedby. */
  error?: string;
};

function Input({ className, type, error, id, 'aria-describedby': describedBy, ...props }: InputProps) {
  const autoId = React.useId();
  const inputId = id ?? autoId;
  const errorId = `${inputId}-error`;

  const input = (
    <input
      id={inputId}
      type={type}
      data-slot="input"
      aria-invalid={error ? true : props['aria-invalid']}
      aria-describedby={error ? [describedBy, errorId].filter(Boolean).join(' ') : describedBy}
      className={cn(
        fieldSurfaceClass,
        'h-11 expanded:h-10',
        'file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-label file:text-fg-body',
        className,
      )}
      {...props}
    />
  );

  if (!error) return input;
  return (
    <div data-slot="input-field" className="flex w-full flex-col gap-1.5">
      {input}
      <FieldError id={errorId}>{error}</FieldError>
    </div>
  );
}

export { Input, type InputProps };
