'use client';

import * as React from 'react';

import { tiltFromPointer, tiltStyle } from '../fx/tilt';

/** 카드 기울임 — fine pointer + reduced-motion 아님에서만. DOM 에 직접 transform 을 쓴다(리렌더 없음). */
export function useTilt<T extends HTMLElement>() {
  const onPointerMove = React.useCallback((e: React.PointerEvent<T>) => {
    if (e.pointerType && e.pointerType !== 'mouse') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = e.currentTarget;
    el.style.transform = tiltStyle(tiltFromPointer(e.clientX, e.clientY, el.getBoundingClientRect()));
  }, []);
  const onPointerLeave = React.useCallback((e: React.PointerEvent<T>) => {
    e.currentTarget.style.transform = '';
  }, []);
  return { onPointerMove, onPointerLeave };
}
