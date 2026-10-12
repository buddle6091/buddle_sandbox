import * as React from 'react';

import { cn } from '@sandbox/ui/lib/utils';

/** Label — design.md §6.2: 타이포 label + fg/body. */
function Label({ className, ...props }: React.ComponentProps<'label'>) {
  return (
    <label
      data-slot="label"
      className={cn(
        'text-label text-fg-body select-none',
        'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
        className,
      )}
      {...props}
    />
  );
}

export { Label };
