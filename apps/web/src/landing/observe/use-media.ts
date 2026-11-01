'use client';

import * as React from 'react';

/**
 * matchMedia 구독 훅 — SSR 스냅샷은 false(캔버스 같은 무거운 것은 클라이언트에서만 켠다).
 * 랜딩의 반응형 분기는 Tailwind 변형(medium/expanded)과 같은 값을 쓴다 → 아래 상수.
 */
export const MQ_EXPANDED = '(min-width: 1024px)';
export const MQ_REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

export function useMedia(query: string) {
  const subscribe = React.useCallback(
    (cb: () => void) => {
      const m = window.matchMedia(query);
      m.addEventListener('change', cb);
      return () => m.removeEventListener('change', cb);
    },
    [query],
  );
  return React.useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}
