'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Tabs as TabsPrimitive } from 'radix-ui';

import { cn } from '@sandbox/ui/lib/utils';

/**
 * Tabs — design.md §6.6
 * pill(기본): list h 40, radius/full, 활성 탭만 glass subtle 알약. 헤더 탐색(블로그 · 캘린더).
 * underline: 본문 내부 탭(카테고리). 활성 fg/default 2px 밑줄, 비활성 fg/muted.
 * compact: 가로 스크롤 + 스냅.
 */
function Tabs({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return <TabsPrimitive.Root data-slot="tabs" className={cn('flex flex-col gap-4', className)} {...props} />;
}

const tabsListVariants = cva(
  'group/tabs-list flex h-10 w-fit max-w-full items-center overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
  {
    variants: {
      variant: {
        pill: 'gap-1 rounded-full p-1',
        underline: 'gap-6 rounded-none border-b border-border-default',
      },
    },
    defaultVariants: { variant: 'pill' },
  },
);

const TabsVariantCtx = React.createContext<'pill' | 'underline'>('pill');

function TabsList({
  className,
  variant = 'pill',
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> & VariantProps<typeof tabsListVariants>) {
  const v = variant ?? 'pill';
  return (
    <TabsVariantCtx.Provider value={v}>
      <TabsPrimitive.List
        data-slot="tabs-list"
        data-variant={v}
        className={cn(tabsListVariants({ variant: v }), className)}
        {...props}
      />
    </TabsVariantCtx.Provider>
  );
}

const triggerBase = cn(
  'relative inline-flex h-full shrink-0 snap-start items-center justify-center gap-1.5 whitespace-nowrap',
  'text-label text-fg-muted outline-none select-none focus-ring',
  'transition-colors duration-[var(--bs-motion-control)] ease-bs',
  'hover-fine:text-fg-default disabled:pointer-events-none disabled:opacity-50',
  "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
);

const TRIGGER_VARIANT = {
  pill: 'rounded-full px-4 data-[state=active]:glass-subtle data-[state=active]:text-fg-default',
  underline: cn(
    'rounded-none px-1 data-[state=active]:text-fg-default',
    'after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:rounded-full after:bg-fg-default after:opacity-0',
    'after:transition-opacity after:duration-[var(--bs-motion-control)] after:ease-bs',
    'data-[state=active]:after:opacity-100',
  ),
} as const;

function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  const variant = React.useContext(TabsVariantCtx);
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(triggerBase, TRIGGER_VARIANT[variant], className)}
      {...props}
    />
  );
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return <TabsPrimitive.Content data-slot="tabs-content" className={cn('flex-1 outline-none', className)} {...props} />;
}

export { Tabs, TabsContent, TabsList, tabsListVariants, TabsTrigger };
