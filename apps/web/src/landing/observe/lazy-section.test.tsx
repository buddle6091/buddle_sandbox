import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { LazySection } from './lazy-section';

type Entry = Pick<IntersectionObserverEntry, 'isIntersecting' | 'target'>;
let observers: Array<{ cb: (e: Entry[]) => void; opts?: IntersectionObserverInit; el?: Element; disconnect: ReturnType<typeof vi.fn> }>;

beforeEach(() => {
  observers = [];
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      cb: (e: Entry[]) => void;
      opts?: IntersectionObserverInit;
      el?: Element;
      constructor(cb: (e: Entry[]) => void, opts?: IntersectionObserverInit) {
        this.cb = cb;
        this.opts = opts;
        observers.push(this);
      }
      observe(el: Element) {
        this.el = el;
      }
      unobserve = vi.fn();
      disconnect = vi.fn();
    },
  );
});
afterEach(() => vi.unstubAllGlobals());

describe('LazySection — 뷰포트에 가까워질 때 본문을 DOM 에 마운트', () => {
  it('교차 전에는 자리표시(min-height)만 있고 children 이 없다', () => {
    render(
      <LazySection minHeight={480} data-testid="lazy">
        <p>본문</p>
      </LazySection>,
    );
    const ph = screen.getByTestId('lazy');
    expect(ph).toHaveStyle({ minHeight: '480px' });
    expect(ph).toHaveAttribute('data-mounted', 'false');
    expect(screen.queryByText('본문')).toBeNull();
    // 다음 섹션을 미리 그리도록 아래쪽 rootMargin 을 넉넉히
    expect(observers[0].opts?.rootMargin).toBe('0px 0px 40% 0px');
  });

  it('교차하면 children 을 렌더하고, 이후 벗어나도 유지(once)', () => {
    render(
      <LazySection minHeight={480} data-testid="lazy">
        <p>본문</p>
      </LazySection>,
    );
    act(() => observers[0].cb([{ isIntersecting: true, target: observers[0].el! }]));
    expect(screen.getByText('본문')).toBeInTheDocument();
    expect(screen.getByTestId('lazy')).toHaveAttribute('data-mounted', 'true');
    expect(observers[0].disconnect).toHaveBeenCalled();
    act(() => observers[0].cb([{ isIntersecting: false, target: observers[0].el! }]));
    expect(screen.getByText('본문')).toBeInTheDocument();
  });

  it('마운트 후에는 min-height 를 풀어 내용 높이를 따른다', () => {
    render(
      <LazySection minHeight={480} data-testid="lazy">
        <p>본문</p>
      </LazySection>,
    );
    act(() => observers[0].cb([{ isIntersecting: true, target: observers[0].el! }]));
    expect(screen.getByTestId('lazy')).not.toHaveStyle({ minHeight: '480px' });
  });

  it('IntersectionObserver 가 없으면 즉시 렌더(내용을 숨기지 않는다)', () => {
    vi.stubGlobal('IntersectionObserver', undefined);
    render(
      <LazySection minHeight={480}>
        <p>본문</p>
      </LazySection>,
    );
    expect(screen.getByText('본문')).toBeInTheDocument();
  });
});
