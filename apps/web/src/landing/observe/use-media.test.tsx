import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { MQ_EXPANDED, useMedia } from './use-media';

function mockMatchMedia(matching: Set<string>) {
  const listeners = new Map<string, Set<() => void>>();
  vi.spyOn(window, 'matchMedia').mockImplementation((query: string) => {
    const set = listeners.get(query) ?? new Set();
    listeners.set(query, set);
    return {
      get matches() {
        return matching.has(query);
      },
      media: query,
      onchange: null,
      addListener: () => undefined,
      removeListener: () => undefined,
      addEventListener: (_: string, cb: () => void) => set.add(cb),
      removeEventListener: (_: string, cb: () => void) => set.delete(cb),
      dispatchEvent: () => false,
    } as unknown as MediaQueryList;
  });
  return { fire: (q: string) => listeners.get(q)?.forEach((cb) => cb()) };
}

afterEach(() => vi.restoreAllMocks());

describe('useMedia', () => {
  it('현재 matches 를 돌려주고 change 에 반응한다', () => {
    const matching = new Set<string>();
    const { fire } = mockMatchMedia(matching);
    const { result } = renderHook(() => useMedia(MQ_EXPANDED));
    expect(result.current).toBe(false);
    act(() => {
      matching.add(MQ_EXPANDED);
      fire(MQ_EXPANDED);
    });
    expect(result.current).toBe(true);
  });
});
