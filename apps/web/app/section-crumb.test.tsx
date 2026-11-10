import { act, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { SECTION_IDS, SECTION_LABELS, NAV_SECTIONS } from '../src/landing/content/landing';
import { SectionCrumb } from './section-crumb';

/** IntersectionObserver 를 흉내 내 특정 섹션이 화면 중앙에 들어온 상황을 만든다 */
let fire: (id: string) => void = () => undefined;
beforeEach(() => {
  for (const id of SECTION_IDS) {
    const el = document.createElement('section');
    el.id = id;
    document.body.appendChild(el);
  }
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(cb: IntersectionObserverCallback) {
        fire = (id) => cb([{ isIntersecting: true, target: document.getElementById(id)! } as unknown as IntersectionObserverEntry], this as unknown as IntersectionObserver);
      }
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
});
afterEach(() => {
  vi.unstubAllGlobals();
  for (const id of SECTION_IDS) document.getElementById(id)?.remove();
});

describe('SectionCrumb — 헤더의 현재 위치(`buddle / 교육 이력`)', () => {
  it('장식 표시(aria-hidden)이고, 처음과 히어로(top)에서는 숨는다', () => {
    const { container } = render(<SectionCrumb />);
    const crumb = container.querySelector('[data-slot="section-crumb"]')!;
    expect(crumb).toHaveAttribute('aria-hidden', 'true');
    expect(crumb).toHaveAttribute('data-on', 'false');
    act(() => fire('top'));
    expect(crumb).toHaveAttribute('data-on', 'false');
    expect(crumb).toHaveTextContent(/^\/$/);
  });

  it('섹션이 바뀌면 그 섹션의 라벨을 보여준다 — top 을 뺀 9개 전부', () => {
    const { container } = render(<SectionCrumb />);
    const crumb = container.querySelector('[data-slot="section-crumb"]')!;
    for (const id of SECTION_IDS.filter((s) => s !== 'top')) {
      act(() => fire(id));
      expect(crumb).toHaveAttribute('data-on', 'true');
      expect(crumb).toHaveTextContent(`/${SECTION_LABELS[id]}`);
    }
  });

  it('라벨은 내비(우측 점 · 팔레트)와 같은 이름을 쓴다', () => {
    for (const n of NAV_SECTIONS) expect(SECTION_LABELS[n.id]).toBe(n.label);
    expect(SECTION_LABELS.top).toBeNull();
  });
});
