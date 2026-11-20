'use client';

import * as React from 'react';

/**
 * 커서 스포트라이트 — 문서에 pointermove 리스너 하나. 포인터 아래의 `.landing-spot` 요소에
 * `--mx` / `--my`(요소 기준 px)만 쓴다. 빛 그림은 globals.css 가 그린다(리렌더 없음, rAF 스로틀).
 * 마우스(fine pointer)이고 reduced-motion 이 아닐 때만 켠다 — 터치에서는 아무것도 하지 않는다.
 */
export function PointerSpot() {
  React.useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    let last: PointerEvent | null = null;
    const apply = () => {
      raf = 0;
      const e = last;
      if (!e || !(e.target instanceof Element)) return;
      const el = e.target.closest<HTMLElement>('.landing-spot');
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${Math.round(e.clientX - r.left)}px`);
      el.style.setProperty('--my', `${Math.round(e.clientY - r.top)}px`);
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      last = e;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    document.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      document.removeEventListener('pointermove', onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return null;
}
