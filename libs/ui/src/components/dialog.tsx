'use client';

import * as React from 'react';
import { XIcon } from 'lucide-react';
import { Dialog as DialogPrimitive } from 'radix-ui';

import { cn } from '@sandbox/ui/lib/utils';

/**
 * Dialog — design.md §6.7 (medium+ 중앙 Dialog)
 * 표면 glass solid, radius/xl, 패딩 28, max-w 480. 오버레이 overlay/bg + blur 4.
 * 열림 scale .96→1 + 투명도 300ms(surface). compact 는 Sheet(하단) — ResponsiveDialog 참고.
 */
function Dialog(props: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger(props: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal(props: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose(props: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

/** 오버레이 — Dialog·Sheet 공용 */
export const overlayClass = cn(
  'fixed inset-0 z-50 bg-overlay-bg backdrop-blur-[4px]',
  'data-[state=open]:animate-bs-fade-in data-[state=closed]:animate-bs-fade-out',
);

function DialogOverlay({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return <DialogPrimitive.Overlay data-slot="dialog-overlay" className={cn(overlayClass, className)} {...props} />;
}

/** 닫기(X) 버튼 — Dialog·Sheet 공용. 접근 이름 "닫기", 터치 44. */
export function OverlayCloseButton({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return (
    <DialogPrimitive.Close
      data-slot="dialog-close"
      aria-label="닫기"
      className={cn(
        'absolute top-3 right-3 inline-flex size-9 items-center justify-center rounded-md text-fg-muted',
        'touch-target focus-ring transition-colors duration-[var(--bs-motion-control)] ease-bs',
        'hover-fine:bg-accent-subtle-bg hover-fine:text-fg-default',
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      <XIcon />
    </DialogPrimitive.Close>
  );
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & { showCloseButton?: boolean }) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          'fixed top-1/2 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-[480px] -translate-x-1/2 -translate-y-1/2 flex-col gap-4',
          'glass-solid rounded-xl p-7 text-fg-default outline-none',
          'data-[state=open]:animate-bs-surface-in data-[state=closed]:animate-bs-surface-out',
          className,
        )}
        {...props}
      >
        {children}
        {showCloseButton && <OverlayCloseButton />}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

function DialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="dialog-header" className={cn('flex flex-col gap-1.5 pr-8', className)} {...props} />;
}

/** compact 세로(주 액션이 위) → medium 가로 우측 정렬 */
function DialogFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn('flex flex-col-reverse gap-2 medium:flex-row medium:justify-end', className)}
      {...props}
    />
  );
}

function DialogTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return <DialogPrimitive.Title data-slot="dialog-title" className={cn('text-h3 text-fg-default', className)} {...props} />;
}

function DialogDescription({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn('text-body-sm text-fg-muted', className)}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
