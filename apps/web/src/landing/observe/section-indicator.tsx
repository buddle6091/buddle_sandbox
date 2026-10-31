'use client';

import * as React from 'react';

import { cn } from '@sandbox/ui/lib/utils';

import { NAV_SECTIONS, type SectionId } from '../content/landing';

/** 현재 섹션 — 뷰포트 중앙 띠(−45%/−50%)와 교차하는 섹션 id */
export function useActiveSection(ids: readonly SectionId[]) {
  const [active, setActive] = React.useState<SectionId | null>(null);
  React.useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id as SectionId);
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, [ids]);
  return active;
}

/** expanded+ 우측 섹션 점 — AppShell 라우트 내비는 그대로, 페이지 안 위치만 표시 */
export function SectionIndicator() {
  const ids = React.useMemo(() => NAV_SECTIONS.map((n) => n.id), []);
  const active = useActiveSection(ids);
  return (
    <nav aria-label="페이지 섹션" className="fixed top-1/2 right-5 z-30 hidden -translate-y-1/2 flex-col gap-3 expanded:flex">
      {NAV_SECTIONS.map((n) => (
        <a
          key={n.id}
          href={`#${n.id}`}
          aria-label={n.label}
          aria-current={active === n.id ? 'location' : undefined}
          className={cn(
            'focus-ring group relative flex size-4 items-center justify-center rounded-full',
          )}
        >
          <span
            className={cn(
              'block size-2 rounded-full bg-border-strong transition-[background-color,transform] duration-[var(--bs-motion-control)] ease-bs',
              active === n.id && 'scale-125 bg-accent-default',
            )}
          />
          <span className="pointer-events-none absolute right-6 rounded-sm bg-bg-inverse px-2 py-1 text-caption whitespace-nowrap text-fg-inverse opacity-0 transition-opacity duration-[var(--bs-motion-control)] ease-bs group-hover-fine:opacity-100 group-focus-visible:opacity-100">
            {n.label}
          </span>
        </a>
      ))}
    </nav>
  );
}
