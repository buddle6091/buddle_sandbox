'use client';

import * as React from 'react';

type Options = { threshold?: number; rootMargin?: string; once?: boolean };

/**
 * IntersectionObserver 훅 — 상태는 boolean 하나, 전환은 CSS([data-inview]) 가 한다.
 * IO 가 없는 환경(구형 브라우저·테스트)에서는 내용을 숨기지 않도록 즉시 true.
 * SSR 에서는 false 로 그려 하이드레이션 불일치를 피한다(마운트 후 IO 가 올린다).
 */
export function useInView<T extends Element>({ threshold = 0.2, rootMargin, once = true }: Options = {}) {
  const ref = React.useRef<T | null>(null);
  const [inView, setInView] = React.useState<boolean>(
    () => typeof window !== 'undefined' && typeof IntersectionObserver === 'undefined',
  );

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setInView(true);
            if (once) io.disconnect();
          } else if (!once) {
            setInView(false);
          }
        }
      },
      { threshold, rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, rootMargin, once]);

  return [ref, inView] as const;
}
