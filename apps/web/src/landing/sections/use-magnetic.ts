'use client';

import * as React from 'react';

import { magnetOffset, magnetStyle } from '../fx/magnet';

/**
 * 자석 버튼 — 감싼 요소가 포인터 쪽으로 최대 8px 끌려간다. 마우스 + reduced-motion 아님에서만.
 * DOM 에 직접 transform 을 쓴다(리렌더 없음). 전환은 globals.css `.landing-magnet`.
 */
export function useMagnetic<T extends HTMLElement>() {
  const onPointerMove = React.useCallback((e: React.PointerEvent<T>) => {
    if (e.pointerType && e.pointerType !== 'mouse') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    el.style.transform = magnetStyle(magnetOffset(dx, dy, Math.max(r.width, r.height)));
  }, []);
  const onPointerLeave = React.useCallback((e: React.PointerEvent<T>) => {
    e.currentTarget.style.transform = '';
  }, []);
  return { onPointerMove, onPointerLeave };
}
