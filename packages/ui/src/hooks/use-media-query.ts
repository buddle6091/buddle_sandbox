'use client';

import * as React from 'react';

/** design.md §3.1 브레이크포인트 — 토큰(theme.css --breakpoint-*)과 같은 값 */
export const BREAKPOINTS = {
  medium: '(min-width: 600px)',
  expanded: '(min-width: 1024px)',
  wide: '(min-width: 1440px)',
} as const;

/**
 * 뷰포트 미디어 쿼리 구독. SSR 에서는 `fallback`(기본 false = compact) 을 쓴다.
 * 셸 레이아웃은 CSS 미디어 쿼리로 세 형태를 모두 렌더하고 숨기는 게 원칙이고,
 * 이 훅은 "Dialog ↔ Sheet 전환"처럼 DOM 구조 자체가 달라져야 할 때만 쓴다.
 */
export function useMediaQuery(query: string, fallback = false): boolean {
  const subscribe = React.useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener('change', onChange);
      return () => mql.removeEventListener('change', onChange);
    },
    [query],
  );
  return React.useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => fallback,
  );
}
