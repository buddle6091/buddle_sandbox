import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { detectLensSupport } from '../hooks/use-lens-support';
import { GlassSurface } from './glass-surface';
import { expectTokenOnly } from '../test-utils/class-rules';

/** ResizeObserver 를 흉내 내 요소 크기를 넣는다 */
let resize: (w: number, h: number) => void = () => undefined;
class FakeRO {
  cb: ResizeObserverCallback;
  constructor(cb: ResizeObserverCallback) {
    this.cb = cb;
  }
  observe(target: Element) {
    resize = (w, h) =>
      this.cb([{ target, contentRect: { width: w, height: h }, borderBoxSize: [{ inlineSize: w, blockSize: h }] } as unknown as ResizeObserverEntry], this as unknown as ResizeObserver);
  }
  unobserve() {}
  disconnect() {}
}

function setChromium(on: boolean) {
  Object.defineProperty(navigator, 'userAgentData', {
    value: on ? { brands: [{ brand: 'Chromium', version: '140' }, { brand: 'Google Chrome', version: '140' }] } : undefined,
    configurable: true,
  });
}

beforeEach(() => {
  vi.stubGlobal('ResizeObserver', FakeRO);
});
afterEach(() => {
  vi.unstubAllGlobals();
  setChromium(false);
});

describe('detectLensSupport — url() backdrop-filter 를 그리는 브라우저(Chromium)만', () => {
  it('UA Client Hints 브랜드에 Chromium 이 있으면 true', () => {
    expect(detectLensSupport({ userAgentData: { brands: [{ brand: 'Chromium' }] } } as never)).toBe(true);
    expect(detectLensSupport({ userAgentData: { brands: [{ brand: 'Microsoft Edge' }, { brand: 'Chromium' }] } } as never)).toBe(true);
  });
  it('Safari · Firefox(Client Hints 없음) · SSR 은 false', () => {
    expect(detectLensSupport({} as never)).toBe(false);
    expect(detectLensSupport(undefined)).toBe(false);
    expect(detectLensSupport({ userAgentData: { brands: [{ brand: 'Not A Brand' }] } } as never)).toBe(false);
  });
});

describe('GlassSurface — 기본 표면', () => {
  it('pill 기본, 완전한 알약(rounded-full), 토큰 유틸리티만, children 그대로', () => {
    render(<GlassSurface>녹음</GlassSurface>);
    const el = screen.getByText('녹음');
    expect(el).toHaveAttribute('data-slot', 'glass-surface');
    expect(el).toHaveAttribute('data-variant', 'pill');
    expect(el).toHaveClass('liquid-glass', 'rounded-full', 'text-fg-default');
    expectTokenOnly(el.className);
  });

  it('circle 은 정사각 비율', () => {
    render(<GlassSurface variant="circle">●</GlassSurface>);
    expect(screen.getByText('●')).toHaveClass('aspect-square');
  });

  it('as 로 요소를 바꾸고 나머지 props(href · aria-*)를 넘긴다, ref 도 닿는다', () => {
    const ref = { current: null as Element | null };
    render(
      <GlassSurface as="a" href="#x" aria-label="이동" ref={ref}>
        가기
      </GlassSurface>,
    );
    const a = screen.getByRole('link', { name: '이동' });
    expect(a).toHaveAttribute('href', '#x');
    expect(ref.current).toBe(a);
  });

  it('data-slot 은 소비처가 덮어쓰지 못한다(CSS · 테스트가 이 이름으로 찾는다)', () => {
    render(<GlassSurface data-slot="other">x</GlassSurface>);
    expect(screen.getByText('x')).toHaveAttribute('data-slot', 'glass-surface');
  });

  it('interactive · appear · backdrop 은 data 속성으로 CSS 에 넘긴다', () => {
    render(
      <GlassSurface interactive appear={false} backdrop="medium">
        x
      </GlassSurface>,
    );
    const el = screen.getByText('x');
    expect(el).toHaveAttribute('data-interactive', 'true');
    expect(el).toHaveAttribute('data-appear', 'false');
    expect(el).toHaveAttribute('data-backdrop', 'medium');
    expect(el).toHaveAttribute('data-density', 'clear');
  });
});

describe('GlassSurface — 렌즈(굴절)', () => {
  it('Chromium 이 아니면 렌즈를 켜지 않는다(blur 폴백), SVG 필터도 없다', () => {
    render(<GlassSurface>x</GlassSurface>);
    const el = screen.getByText('x');
    act(() => resize(300, 56));
    expect(el).toHaveAttribute('data-lens', 'off');
    expect(el.querySelector('filter')).toBeNull();
    expect(el.style.getPropertyValue('--glass-filter')).toBe('');
  });

  it('Chromium + 크기를 잰 뒤에만 렌즈: 요소 크기의 변위 지도 · feDisplacementMap · url(#id)', () => {
    setChromium(true);
    render(<GlassSurface intensity={1}>x</GlassSurface>);
    const el = screen.getByText('x');
    expect(el).toHaveAttribute('data-lens', 'off'); // 아직 크기 모름
    act(() => resize(300, 56));
    expect(el).toHaveAttribute('data-lens', 'on');
    const filter = el.querySelector('filter')!;
    expect(el.style.getPropertyValue('--glass-filter')).toBe(`url(#${filter.id})`);
    const disp = filter.querySelector('feDisplacementMap')!;
    expect(disp).toHaveAttribute('scale', '64');
    expect(disp).toHaveAttribute('xChannelSelector', 'R');
    const img = filter.querySelector('feImage')!;
    expect(img).toHaveAttribute('width', '300');
    expect(img.getAttribute('href')).toMatch(/^data:image\/svg\+xml/);
    expect(el.querySelector('[data-slot="glass-defs"]')).toHaveAttribute('aria-hidden', 'true');
  });

  it('circle 은 같은 세기에서 더 큰 scale', () => {
    setChromium(true);
    render(
      <GlassSurface variant="circle" intensity={1}>
        c
      </GlassSurface>,
    );
    act(() => resize(48, 48));
    expect(screen.getByText('c').querySelector('feDisplacementMap')).toHaveAttribute('scale', '100');
  });

  it('backdrop="none" 이면 Chromium 이어도 렌즈 없음(조상이 backdrop root 인 안쪽 표면)', () => {
    setChromium(true);
    render(<GlassSurface backdrop="none">x</GlassSurface>);
    act(() => resize(100, 40));
    expect(screen.getByText('x')).toHaveAttribute('data-lens', 'off');
  });
});

describe('GlassSurface — glow', () => {
  it('glow 0 이면 층이 없다', () => {
    render(<GlassSurface>x</GlassSurface>);
    expect(screen.getByText('x').querySelector('[data-slot="glass-glow"]')).toBeNull();
  });
  it('glow 는 장식 층 + --glass-glow(최대 .55), 값이 바뀌면 따라간다', () => {
    const { rerender } = render(<GlassSurface glow={1}>x</GlassSurface>);
    const el = screen.getByText('x');
    const layer = el.querySelector('[data-slot="glass-glow"]')!;
    expect(layer).toHaveAttribute('aria-hidden', 'true');
    expect(el.style.getPropertyValue('--glass-glow')).toBe('0.55');
    rerender(<GlassSurface glow={0.2}>x</GlassSurface>);
    expect(el.style.getPropertyValue('--glass-glow')).toBe('0.11');
  });
});

describe('GlassSurface — 상호작용', () => {
  it('버튼으로 쓰면 클릭 · 키보드 그대로', () => {
    const onClick = vi.fn();
    render(
      <GlassSurface as="button" type="button" interactive onClick={onClick}>
        녹음 시작
      </GlassSurface>,
    );
    fireEvent.click(screen.getByRole('button', { name: '녹음 시작' }));
    expect(onClick).toHaveBeenCalledOnce();
  });
});
