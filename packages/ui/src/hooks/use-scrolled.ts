'use client';

import * as React from 'react';

/**
 * design.md §6.10 — TopBar 는 스크롤 0 에서 투명, 스크롤 후 glass base.
 * `threshold` px 를 넘으면 true. passive 리스너, SSR 은 false.
 */
export function useScrolled(threshold = 8): boolean {
  const subscribe = React.useCallback((onChange: () => void) => {
    window.addEventListener('scroll', onChange, { passive: true });
    return () => window.removeEventListener('scroll', onChange);
  }, []);
  return React.useSyncExternalStore(
    subscribe,
    () => window.scrollY > threshold,
    () => false,
  );
}
