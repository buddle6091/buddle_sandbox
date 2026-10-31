import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useInView } from './use-in-view';

type Entry = Pick<IntersectionObserverEntry, 'isIntersecting' | 'target'>;
let observers: Array<{ cb: (entries: Entry[]) => void; opts?: IntersectionObserverInit; el?: Element; disconnect: ReturnType<typeof vi.fn> }>;

beforeEach(() => {
  observers = [];
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      cb: (entries: Entry[]) => void;
      opts?: IntersectionObserverInit;
      el?: Element;
      constructor(cb: (entries: Entry[]) => void, opts?: IntersectionObserverInit) {
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

function Probe({ once = true, threshold = 0.2 }: { once?: boolean; threshold?: number }) {
  const [ref, inView] = useInView<HTMLElement>({ once, threshold });
  return (
    <section ref={ref} data-testid="s" data-inview={inView}>
      x
    </section>
  );
}

describe('useInView — IntersectionObserver 로 data-inview 만 토글', () => {
  it('처음엔 false, 교차하면 true', () => {
    render(<Probe />);
    expect(screen.getByTestId('s')).toHaveAttribute('data-inview', 'false');
    expect(observers).toHaveLength(1);
    expect(observers[0].opts?.threshold).toBe(0.2);
    act(() => observers[0].cb([{ isIntersecting: true, target: observers[0].el! }]));
    expect(screen.getByTestId('s')).toHaveAttribute('data-inview', 'true');
  });

  it('once(기본) — 한 번 보이면 벗어나도 유지하고 관찰을 끝낸다', () => {
    render(<Probe />);
    act(() => observers[0].cb([{ isIntersecting: true, target: observers[0].el! }]));
    act(() => observers[0].cb([{ isIntersecting: false, target: observers[0].el! }]));
    expect(screen.getByTestId('s')).toHaveAttribute('data-inview', 'true');
    expect(observers[0].disconnect).toHaveBeenCalled();
  });

  it('once=false — 벗어나면 다시 false', () => {
    render(<Probe once={false} />);
    act(() => observers[0].cb([{ isIntersecting: true, target: observers[0].el! }]));
    act(() => observers[0].cb([{ isIntersecting: false, target: observers[0].el! }]));
    expect(screen.getByTestId('s')).toHaveAttribute('data-inview', 'false');
  });

  it('언마운트 시 disconnect', () => {
    const { unmount } = render(<Probe once={false} />);
    unmount();
    expect(observers[0].disconnect).toHaveBeenCalled();
  });

  it('IntersectionObserver 가 없는 환경에서는 즉시 true (내용을 숨기지 않는다)', () => {
    vi.stubGlobal('IntersectionObserver', undefined);
    render(<Probe />);
    expect(screen.getByTestId('s')).toHaveAttribute('data-inview', 'true');
  });
});
