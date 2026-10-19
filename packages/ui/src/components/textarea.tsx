import * as React from 'react';

import { cn } from '@sandbox/ui/lib/utils';
import { FieldError, fieldSurfaceClass } from './input';

type TextareaProps = React.ComponentProps<'textarea'> & {
  /** 유효성 메시지. 있으면 danger 테두리 + 하단 caption + aria-invalid/aria-describedby. */
  error?: string;
};

/** Textarea — design.md §6.2. Input 과 같은 표면, min-h 80, resize-y. */
function Textarea({ className, error, id, 'aria-describedby': describedBy, ...props }: TextareaProps) {
  const autoId = React.useId();
  const areaId = id ?? autoId;
  const errorId = `${areaId}-error`;

  const area = (
    <textarea
      id={areaId}
      data-slot="textarea"
      aria-invalid={error ? true : props['aria-invalid']}
      aria-describedby={error ? [describedBy, errorId].filter(Boolean).join(' ') : describedBy}
      className={cn(fieldSurfaceClass, 'min-h-20 resize-y py-2.5 leading-[1.6]', className)}
      {...props}
    />
  );

  if (!error) return area;
  return (
    <div data-slot="textarea-field" className="flex w-full flex-col gap-1.5">
      {area}
      <FieldError id={errorId}>{error}</FieldError>
    </div>
  );
}

export { Textarea, type TextareaProps };
