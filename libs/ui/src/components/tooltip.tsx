'use client';

import * as React from 'react';
import { Tooltip as TooltipPrimitive } from 'radix-ui';

import { cn } from '@sandbox/ui/lib/utils';

/**
 * Tooltip — design.md §6.8. 유리 금지: 불투명 반전 표면(bg/inverse + fg/inverse), radius/sm.
 * compact(hover 없는 기기)에서는 쓰지 않는다 → `@media (hover: none)` 에서 숨김.
 * 터치에서 같은 정보가 필요하면 토스트로 (STATES.md "조회 전용").
 */
function TooltipProvider({ delayDuration = 300, ...props }: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return <TooltipPrimitive.Provider data-slot="tooltip-provider" delayDuration={delayDuration} {...props} />;
}

function Tooltip(props: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return <TooltipPrimitive.Root data-slot="tooltip" {...props} />;
}

function TooltipTrigger(props: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

function TooltipContent({
  className,
  sideOffset = 6,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          'z-50 w-fit max-w-[260px] origin-(--radix-tooltip-content-transform-origin) rounded-sm bg-bg-inverse px-2.5 py-1.5 text-caption text-fg-inverse text-balance',
          'data-[state=delayed-open]:animate-bs-pop-in data-[state=closed]:animate-bs-pop-out',
          '[@media(hover:none)]:hidden',
          className,
        )}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow className="z-50 size-2.5 translate-y-[calc(-50%-2px)] rotate-45 rounded-[2px] bg-bg-inverse fill-bg-inverse" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
