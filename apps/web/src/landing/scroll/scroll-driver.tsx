'use client';

import * as React from 'react';

import { computeProgress } from './progress';
import { scrollStore } from './store';

/**
 * 스크롤 드라이버 — 네이티브 스크롤이 SSOT.
 * scroll/resize 를 rAF 로 스로틀해 scrollStore 에 진행도(0~1)와 scrollY 를 쓴다.
 * 부드러운 이동·섹션 스냅은 CSS(globals.css: scroll-behavior smooth + scroll-snap-type y proximity)가 맡는다.
 * Lenis 는 CSS scroll-snap 과 충돌해 쓰지 않는다(2026-11-01 결정).
 */
export function ScrollDriver() {
  React.useEffect(() => {
    const doc = document.documentElement;
    let raf = 0;
    const read = () => {
      raf = 0;
      scrollStore.set(computeProgress(window.scrollY, doc.scrollHeight, window.innerHeight), window.scrollY);
    };
    const schedule = () => {
      if (!raf) raf = window.requestAnimationFrame(read);
    };
    read();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);

    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);
  return null;
}
