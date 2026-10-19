'use client';

import * as React from 'react';
import { Dialog as SheetPrimitive } from 'radix-ui';

import { cn } from '@sandbox/ui/lib/utils';
import { OverlayCloseButton, overlayClass } from './dialog';

/**
 * Sheet — design.md §6.7 compact 하단 Sheet (+ 에디터 속성 패널용 right)
 * bottom: 상단만 radius/xl, 드래그 핸들, max-h 92dvh, safe-bottom. 표면 glass solid.
 */
function Sheet(props: React.ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />;
}

function SheetTrigger(props: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

function SheetClose(props: React.ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
}

function SheetPortal(props: React.ComponentProps<typeof SheetPrimitive.Portal>) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />;
}

function SheetOverlay({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Overlay>) {
  return <SheetPrimitive.Overlay data-slot="sheet-overlay" className={cn(overlayClass, className)} {...props} />;
}

type SheetSide = 'bottom' | 'right';

const SIDE_CLASS: Record<SheetSide, string> = {
  bottom: cn(
    'inset-x-0 bottom-0 max-h-[92dvh] rounded-t-xl pb-[env(safe-area-inset-bottom)]',
    'data-[state=open]:animate-bs-sheet-in data-[state=closed]:animate-bs-sheet-out',
  ),
  right: cn(
    'inset-y-0 right-0 h-full w-3/4 max-w-[360px] rounded-l-xl',
    'data-[state=open]:animate-bs-sheet-side-in data-[state=closed]:animate-bs-sheet-side-out',
  ),
};

function SheetContent({
  className,
  children,
  side = 'bottom',
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
  side?: SheetSide;
  showCloseButton?: boolean;
}) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        data-side={side}
        className={cn(
          'fixed z-50 flex flex-col gap-4 overflow-y-auto glass-solid p-6 text-fg-default outline-none',
          SIDE_CLASS[side],
          className,
        )}
        {...props}
      >
        {side === 'bottom' && (
          <div
            data-slot="sheet-handle"
            aria-hidden
            className="mx-auto -mt-3 mb-1 h-1 w-9 shrink-0 rounded-full bg-border-strong"
          />
        )}
        {children}
        {showCloseButton && <OverlayCloseButton data-slot="sheet-close" />}
      </SheetPrimitive.Content>
    </SheetPortal>
  );
}

function SheetHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="sheet-header" className={cn('flex flex-col gap-1.5 pr-8', className)} {...props} />;
}

function SheetFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="sheet-footer" className={cn('mt-auto flex flex-col gap-2', className)} {...props} />;
}

function SheetTitle({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Title>) {
  return <SheetPrimitive.Title data-slot="sheet-title" className={cn('text-h3 text-fg-default', className)} {...props} />;
}

function SheetDescription({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Description>) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn('text-body-sm text-fg-muted', className)}
      {...props}
    />
  );
}

export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetOverlay,
  SheetPortal,
  SheetTitle,
  SheetTrigger,
  type SheetSide,
};
