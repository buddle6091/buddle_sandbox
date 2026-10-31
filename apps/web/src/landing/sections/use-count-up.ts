'use client';

import * as React from 'react';

export const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
/** 시안 — stats 카운트업 1.6s easeOutQuart */
export const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

/**
 * 숫자 롤링 — active 가 되는 순간 0 → value. 그 전엔 최종값을 그대로 보여준다
 * (SSR/noscript 에서도 숫자가 보여야 하고, 0 표시는 금지). reduced-motion 이면 롤링하지 않는다.
 */
export function useCountUp(value: number, active: boolean, duration = 600, easing: (t: number) => number = easeOutCubic) {
  const [display, setDisplay] = React.useState(value);
  const played = React.useRef(false);

  React.useEffect(() => {
    if (!active || played.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    played.current = true;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setDisplay(Math.round(value * easing(t)));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, value, duration, easing]);

  return display;
}

export const formatNumber = (n: number) => n.toLocaleString('ko-KR');
