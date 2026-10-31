'use client';

import * as React from 'react';

import { scrollStore } from './store';

/** TopBar 하단 2px 진행 막대 — 스토어 구독, DOM 직접(리렌더 없음). */
export function ScrollProgressBar() {
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const apply = (p: number) => {
      el.style.transform = `scaleX(${p.toFixed(4)})`;
    };
    apply(scrollStore.progress);
    return scrollStore.subscribe(apply);
  }, []);
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-[var(--bs-layout-topbar-h)] z-40 h-0.5 overflow-hidden">
      <div ref={ref} className="h-full origin-left scale-x-0 bg-gradient-to-r from-accent-default to-accent-tertiary" />
    </div>
  );
}
