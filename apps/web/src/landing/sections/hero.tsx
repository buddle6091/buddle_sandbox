'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import { ChevronDown } from 'lucide-react';

import { Badge } from '@sandbox/ui/components/badge';
import { Button } from '@sandbox/ui/components/button';

import { HERO_VIDEO, LANDING } from '../content/landing';
import { useInView } from '../observe/use-in-view';
import { MQ_EXPANDED, useMedia } from '../observe/use-media';
import { Reveal, Section } from './section';

/** three 는 클라이언트 전용 — SSR 번들에서 제외 */
const HeroCanvas = dynamic(() => import('../three/hero-canvas').then((m) => m.HeroCanvas), { ssr: false });

/**
 * 시안 D — 히어로 배경 영상(12초 루프). 섹션 전체를 cover 로 채우고 아래 40% 를 마스크로 녹인다.
 * 자동재생 실패는 무시, reduced-motion 은 영상을 숨기고 포스터만 보인다(CSS).
 */
function HeroVideo() {
  const ref = React.useRef<HTMLVideoElement>(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.muted = true;
    el.defaultMuted = true;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.pause();
      return;
    }
    el.play()?.catch(() => undefined);
  }, []);
  return (
    <div
      aria-hidden="true"
      data-slot="hero-video"
      className="landing-hero-mask absolute inset-0 bg-cover bg-center"
      style={{ backgroundImage: `url(${HERO_VIDEO.poster})` }}
    >
      <video
        ref={ref}
        className="landing-hero-video block size-full object-cover"
        src={HERO_VIDEO.src}
        poster={HERO_VIDEO.poster}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        style={{ opacity: HERO_VIDEO.opacity }}
      />
    </div>
  );
}

export function Hero() {
  const h = LANDING.hero;
  // 3D 는 히어로가 보일 때만 돈다(frameloop always ↔ demand)
  const [canvasRef, canvasInView] = useInView<HTMLDivElement>({ threshold: 0.05, once: false });
  // 1024 미만에서는 캔버스가 글 아래로 밀려 탭바에 잘리고 three 번들만 무겁다 → 아예 마운트하지 않는다(영상 배경만). 2026-11-01 결정
  const expanded = useMedia(MQ_EXPANDED);
  return (
    <Section id="top" title={h.name} header="none" className="overflow-hidden px-0 pt-0 pb-0" innerClassName="max-w-none gap-0">
      {/* 배경 레이어: 영상 → 좌측 흰 막 → 하단 페이지색 페이드. 다크는 어두운 막 */}
      <HeroVideo />
      <div aria-hidden="true" className="landing-hero-scrim absolute inset-0" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-60 bg-gradient-to-b from-transparent to-bg-page" />
      {/* 라이트: 상단 오브 빛 2개(40s 드리프트 1개) · 다크: 별 + 하단 오브 + 청자 라인 */}
      <div aria-hidden="true" className="landing-hero-orbs pointer-events-none absolute inset-0 dark:hidden">
        <div className="landing-drift bg-orb-primary absolute -top-[460px] -left-[380px] size-[960px] rounded-full opacity-40" />
        <div className="bg-orb-tertiary absolute -top-[120px] -right-[300px] size-[820px] rounded-full opacity-40" />
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden dark:block">
        <div className="landing-stars absolute inset-0" />
        <div className="landing-drift bg-orb-primary absolute -bottom-[420px] -left-[460px] h-[700px] w-[1100px] rounded-full opacity-60" />
        <div className="bg-orb-tertiary absolute -right-[420px] -bottom-[400px] h-[700px] w-[1100px] rounded-full opacity-50" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent-tertiary/40 to-transparent" />
      </div>

      <div className="relative mx-auto grid w-full max-w-[1120px] min-h-[min(640px,calc(100svh-var(--bs-layout-topbar-h)))] items-center gap-8 px-4 pt-[calc(var(--bs-layout-topbar-h)+var(--spacing)*12)] pb-14 medium:px-8 expanded:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] expanded:min-h-0">
        <div className="flex min-w-0 flex-col items-start gap-6">
          <Reveal index={0}>
            <Badge variant="accent" className="h-7 max-w-none px-3">
              {h.badge}
            </Badge>
          </Reveal>
          <Reveal index={1} as="h1" id="top-title" className="text-h1 text-fg-default medium:text-display">
            {h.name}
            <span className="mt-3 block text-h3 font-semibold tracking-normal text-fg-muted">{h.role}</span>
          </Reveal>
          <Reveal index={2} as="p" className="max-w-[600px] text-body-lg text-fg-body">
            {h.tagline}
          </Reveal>
          <Reveal index={3} className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <a href={h.ctas[0].href}>{h.ctas[0].label}</a>
            </Button>
            <Button asChild size="lg" variant="glass">
              <a href={h.ctas[1].href}>{h.ctas[1].label}</a>
            </Button>
          </Reveal>
        </div>
        {expanded && (
          <Reveal index={2} variant="depth" className="relative hidden min-w-0 h-[clamp(340px,36vw,540px)] expanded:block">
            <div ref={canvasRef} data-canvas-inview={canvasInView} className="absolute inset-0">
              <HeroCanvas inView={canvasInView} />
            </div>
          </Reveal>
        )}
      </div>
      <div aria-hidden="true" className="landing-cue relative flex justify-center pb-6 text-fg-muted">
        <ChevronDown className="size-5" />
      </div>
    </Section>
  );
}
