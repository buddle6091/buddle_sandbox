'use client';

import * as React from 'react';
import { Avatar as AvatarPrimitive } from 'radix-ui';

import { cn } from '@sandbox/ui/lib/utils';

/**
 * Avatar — design.md §6.9. 24 / 32 / 40 / 56.
 * fallback = 이니셜 1자 + accent/subtle-bg + accent/fg-strong.
 */
const SIZE: Record<'xs' | 'sm' | 'md' | 'lg', string> = {
  xs: 'size-6 text-caption',
  sm: 'size-8 text-caption',
  md: 'size-10 text-label',
  lg: 'size-14 text-body font-semibold',
};

function Avatar({
  className,
  size = 'sm',
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root> & { size?: keyof typeof SIZE }) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      data-size={size}
      className={cn('relative flex shrink-0 overflow-hidden rounded-full select-none', SIZE[size], className)}
      {...props}
    />
  );
}

function AvatarImage({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return <AvatarPrimitive.Image data-slot="avatar-image" className={cn('aspect-square size-full object-cover', className)} {...props} />;
}

/** 자식 문자열의 첫 글자만 보여준다(이니셜 1자). */
function AvatarFallback({ className, children, ...props }: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  const initial = typeof children === 'string' ? Array.from(children.trim())[0] : children;
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        'flex size-full items-center justify-center rounded-full bg-accent-subtle-bg font-semibold text-accent-fg-strong',
        className,
      )}
      {...props}
    >
      {initial}
    </AvatarPrimitive.Fallback>
  );
}

export { Avatar, AvatarFallback, AvatarImage };
