'use client';

import * as React from 'react';

import { wordProgress } from '../fx/words';

/**
 * 블록이 뷰포트를 올라오는 정도(0~1). rAF 스로틀, 이 훅을 쓰는 컴포넌트만 리렌더.
 * reduced-motion 이면 1(전부 켜짐)로 고정 — CSS 도 .landing-word 를 opacity 1 로 덮는다.
 */
export function useWordProgress<T extends HTMLElement>() {
  const ref = React.useRef<T>(null);
  const [progress, setProgress] = React.useState(0);
  React.useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const read = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setProgress(wordProgress({ top: r.top, height: r.height }, window.innerHeight));
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return [ref, progress] as const;
}
