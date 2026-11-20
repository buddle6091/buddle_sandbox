import { afterEach, describe, expect, it, vi } from 'vitest';

import { NO_FILTER } from '../fx/course-filter';
import { courseFilterStore } from './store';

afterEach(() => courseFilterStore.reset());

describe('courseFilterStore', () => {
  it('set 은 부분 갱신, 같은 값이면 알리지 않는다', () => {
    const l = vi.fn();
    const off = courseFilterStore.subscribe(l);
    courseFilterStore.set({ target: '임원' });
    courseFilterStore.set({ target: '임원' });
    courseFilterStore.set({ industry: 'A' });
    expect(courseFilterStore.get()).toEqual({ target: '임원', industry: 'A' });
    expect(l).toHaveBeenCalledTimes(2);
    off();
  });
  it('toggle — 같은 값을 다시 누르면 해제', () => {
    courseFilterStore.toggle('industry', 'A');
    expect(courseFilterStore.get().industry).toBe('A');
    courseFilterStore.toggle('industry', 'B');
    expect(courseFilterStore.get().industry).toBe('B');
    courseFilterStore.toggle('industry', 'B');
    expect(courseFilterStore.get().industry).toBeNull();
  });
  it('reset 은 전체로', () => {
    courseFilterStore.set({ target: 'x', industry: 'y' });
    courseFilterStore.reset();
    expect(courseFilterStore.get()).toBe(NO_FILTER);
  });
});
