'use client';

import * as React from 'react';

import { NO_FILTER, type CourseFilter } from '../fx/course-filter';

/**
 * 강의 필터 상태 — 산업군 막대(audience)와 강의 이력(teaching) 두 섹션만 공유한다.
 * scroll/store.ts 와 같은 모양의 모듈 스토어 + useSyncExternalStore. URL 에 두지 않는다(앵커 스크롤과 충돌).
 */
let state: CourseFilter = NO_FILTER;
const listeners = new Set<() => void>();
const emit = () => {
  for (const l of listeners) l();
};

export const courseFilterStore = {
  get: () => state,
  set(next: Partial<CourseFilter>) {
    const merged = { ...state, ...next };
    if (merged.target === state.target && merged.industry === state.industry) return;
    state = merged;
    emit();
  },
  /** 같은 값을 다시 누르면 해제 */
  toggle(key: keyof CourseFilter, value: string) {
    courseFilterStore.set({ [key]: state[key] === value ? null : value });
  },
  reset() {
    if (state === NO_FILTER) return;
    state = NO_FILTER;
    emit();
  },
  subscribe(l: () => void) {
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  },
};

export function useCourseFilter(): CourseFilter {
  return React.useSyncExternalStore(courseFilterStore.subscribe, courseFilterStore.get, courseFilterStore.get);
}
