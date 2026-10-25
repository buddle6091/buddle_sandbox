'use client';

import * as React from 'react';
import Lenis from 'lenis';

import { computeProgress } from './progress';
import { scrollStore } from './store';

/**
 * 스크롤 드라이버 — 네이티브 스크롤이 SSOT.
 * - 모든 환경: scroll/resize 를 rAF 로 스로틀해 scrollStore 에 0~1 진행도를 쓴다.
 * - fine-pointer 데스크톱 + reduced-motion 아님: Lenis 로 스크롤을 부드럽게(값은 여전히 window 에서 읽음).
 * DOM 을 렌더하지 않는다.
 */
export function ScrollDriver() {
  React.useEffect(() => {
    const doc = document.documentElement;
    let raf = 0;
    const read = () => {
      raf = 0;
      scrollStore.set(computeProgress(window.scrollY, doc.scrollHeight, window.innerHeight));
    };
    const schedule = () => {
      if (!raf) raf = window.requestAnimationFrame(read);
    };
    read();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);

    const smooth =
      window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lenis = smooth ? new Lenis({ autoRaf: true, lerp: 0.12 }) : null;

    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (raf) window.cancelAnimationFrame(raf);
      lenis?.destroy();
    };
  }, []);
  return null;
}
