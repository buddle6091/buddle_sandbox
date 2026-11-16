'use client';

import * as React from 'react';

import { cn } from '@sandbox/ui/lib/utils';
import { useLensSupport } from '../hooks/use-lens-support';
import { filterId, glowOpacity, lensMapUrl, lensScale, type GlassVariant } from '../lib/liquid';

/**
 * GlassSurface — liquid glass(렌즈 굴절 유리) 표면. design.md §6.13. 레퍼런스: Zsolt Kacso "glass recorder".
 *
 *   variant    pill(완전한 알약) | circle(내부 원형 버튼 — 같은 세기에서 더 강한 렌즈 + 별도 하이라이트)
 *   intensity  0~1 렌즈 세기(변위 scale). 기본 pill .5 · circle .8
 *   glow       0~1 활성 glow(핑크 → 오렌지 → 보라가 흐른다). 0 이면 층을 그리지 않는다. 글자 대비 때문에 최대 .55 로 자른다
 *   backdrop   always | medium(compact 에서는 불투명 틴트 — 화면당 blur 2개 규칙) | none(뒤를 굴절하지 않는 표면만)
 *   density  clear(기본 — 굴절이 잘 보이는 옅은 틴트, 뒤가 사진 · 그라디언트일 때) | dense(아무 본문 위에 글자를 얹는 표면 — 틴트 62%)
 *   interactive hover/press 젤리(spring). 링크 · 버튼에 쓴다
 *   appear     처음 그려질 때 투명 + blur 10 + 10px 아래에서 등장
 *   as         그릴 요소(div · nav · a · button · span …). 자식을 그리므로 input · img 같은 빈 요소는 안 된다
 *
 * 굴절은 Chromium 만(`backdrop-filter: url(#svg)`) — 나머지는 blur + saturate 폴백(useLensSupport).
 * 렌즈 지도는 요소 실제 크기로 만든다(ResizeObserver). 크기를 재기 전 · SSR 에서는 폴백으로 그린다.
 * 주의: backdrop-filter 가 있는 조상 안에 넣으면 그 조상이 backdrop root 가 되어 굴절할 배경이 없다 → 안쪽 표면은 backdrop="none".
 * 모든 효과는 장식이다. 글자는 fg 토큰으로 쓴다. clear 는 뒤가 밝은 사진 · 그라디언트일 때만(히어로), 본문 위에 뜨는 글자 표면은 dense(4.5:1). prefers-reduced-motion 이면 모션을 끈다.
 */
type OwnProps = {
  variant?: GlassVariant;
  intensity?: number;
  glow?: number;
  backdrop?: 'always' | 'medium' | 'none';
  density?: 'clear' | 'dense';
  interactive?: boolean;
  appear?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

export type GlassSurfaceProps<T extends React.ElementType = 'div'> = OwnProps & {
  as?: T;
  ref?: React.Ref<Element>;
} & Omit<React.ComponentPropsWithoutRef<T>, keyof OwnProps | 'as'>;

/** SVG 필터 안의 값 — 블러 · 채도는 CSS(토큰 --bs-liquid-blur · --bs-liquid-saturate)가 뒤이어 건다 */
function LensFilter({ id, width, height, scale, variant }: { id: string; width: number; height: number; scale: number; variant: GlassVariant }) {
  const map = lensMapUrl(width, height, variant);
  return (
    <svg aria-hidden="true" focusable="false" data-slot="glass-defs" width="0" height="0" className="pointer-events-none absolute size-0 overflow-hidden">
      <filter id={id} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
        <feImage href={map} x="0" y="0" width={width} height={height} preserveAspectRatio="none" result="map" />
        <feDisplacementMap in="SourceGraphic" in2="map" scale={scale} xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </svg>
  );
}

function useElementSize(enabled: boolean) {
  const [size, setSize] = React.useState({ width: 0, height: 0 });
  const [node, setNode] = React.useState<Element | null>(null);
  React.useEffect(() => {
    if (!enabled || !node || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(([entry]) => {
      const box = entry.borderBoxSize?.[0];
      const width = Math.round(box ? box.inlineSize : entry.contentRect.width);
      const height = Math.round(box ? box.blockSize : entry.contentRect.height);
      setSize((s) => (s.width === width && s.height === height ? s : { width, height }));
    });
    ro.observe(node);
    return () => ro.disconnect();
  }, [enabled, node]);
  return [setNode, size] as const;
}

function assignRef<T>(ref: React.Ref<T> | undefined, value: T) {
  if (typeof ref === 'function') ref(value);
  else if (ref && typeof ref === 'object') (ref as React.MutableRefObject<T>).current = value;
}

function GlassSurface<T extends React.ElementType = 'div'>({
  as,
  variant = 'pill',
  intensity,
  glow = 0,
  backdrop = 'always',
  density = 'clear',
  interactive = false,
  appear = true,
  className,
  style,
  children,
  ref,
  ...rest
}: GlassSurfaceProps<T>) {
  const Comp = (as ?? 'div') as React.ElementType;
  const supported = useLensSupport();
  const wantsLens = supported && backdrop !== 'none';
  const [setNode, size] = useElementSize(wantsLens);
  const id = filterId(React.useId());
  const lensOn = wantsLens && size.width > 0 && size.height > 0;
  const scale = lensScale(intensity ?? (variant === 'circle' ? 0.8 : 0.5), variant);
  const glowLevel = glowOpacity(glow);

  const setRefs = React.useCallback(
    (el: Element | null) => {
      setNode(el);
      assignRef(ref, el);
    },
    [ref, setNode],
  );

  return (
    <Comp
      {...rest}
      ref={setRefs}
      data-slot="glass-surface"
      data-variant={variant}
      data-backdrop={backdrop}
      data-density={density}
      data-lens={lensOn ? 'on' : 'off'}
      data-interactive={interactive}
      data-appear={appear}
      style={
        {
          ...(lensOn ? { '--glass-filter': `url(#${id})` } : null),
          ...(glowLevel > 0 ? { '--glass-glow': glowLevel } : null),
          ...style,
        } as React.CSSProperties
      }
      className={cn('liquid-glass rounded-full text-fg-default', variant === 'circle' && 'aspect-square', className)}
    >
      {lensOn && <LensFilter id={id} width={size.width} height={size.height} scale={scale} variant={variant} />}
      {glowLevel > 0 && <span aria-hidden="true" data-slot="glass-glow" className="liquid-glass-glow" />}
      {children}
    </Comp>
  );
}

export { GlassSurface };
