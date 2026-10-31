'use client';

import * as React from 'react';

/**
 * STATES.md 공통 규칙 — 스켈레톤은 300ms 안에 응답하면 띄우지 않는다.
 * `delay` ms 가 지난 뒤에야 true 가 된다. 언마운트되면 타이머를 정리한다.
 */
export function useDelayedVisible(delay: number | false = 300): boolean {
  const [visible, setVisible] = React.useState(delay === false);
  React.useEffect(() => {
    if (delay === false) return;
    const t = window.setTimeout(() => setVisible(true), delay);
    return () => window.clearTimeout(t);
  }, [delay]);
  return visible;
}
