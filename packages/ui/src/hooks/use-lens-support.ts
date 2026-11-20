'use client';

import * as React from 'react';

/**
 * `backdrop-filter: url(#svg-filter)` 를 실제로 그리는 브라우저인지 — 지금은 Chromium 계열뿐이다.
 * `@supports (backdrop-filter: url(#a))` 는 Safari · Firefox 에서도 참(문법만 본다)이라 기능 판별이 안 된다.
 * 그래서 UA 문자열 대신 User-Agent Client Hints 의 브랜드(Chromium)를 본다. 없으면(Safari · Firefox) false → blur 폴백.
 * SSR 스냅샷은 false — 하이드레이션 뒤에 렌즈를 켠다.
 */
type Brand = { brand: string };
type NavigatorWithUAData = Navigator & { userAgentData?: { brands?: Brand[] } };

export function detectLensSupport(nav: NavigatorWithUAData | undefined = typeof navigator === 'undefined' ? undefined : navigator): boolean {
  const brands = nav?.userAgentData?.brands;
  return Array.isArray(brands) && brands.some((b) => /Chromium/i.test(b.brand));
}

const noop = () => () => undefined;

export function useLensSupport(): boolean {
  return React.useSyncExternalStore(noop, () => detectLensSupport(), () => false);
}
