'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import { ArrowUpRight } from 'lucide-react';

import { Button } from '@sandbox/ui/components/button';
import { GlassSurface } from '@sandbox/ui/components/glass-surface';

import { HERO_VIDEO, LANDING } from '../content/landing';
import { heroFade } from '../fx/hero-fade';
import { latestCourse } from '../fx/latest';
import { SHARDS } from '../fx/shards';
import { useInView } from '../observe/use-in-view';
import { MQ_EXPANDED, useMedia } from '../observe/use-media';
import { scrollStore } from '../scroll/store';
import { Reveal, Section } from './section';
import { useMagnetic } from './use-magnetic';

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

/** slash.page 식 사선 광선 4개 — 1px · rotate 25° · 정적(규칙 4). 색은 CSS 가 accent 토큰에서 읽는다. */
function HeroShards() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {SHARDS.map((s, i) => (
        <span
          key={i}
          data-slot="shard"
          className="landing-shard absolute w-px origin-top rotate-[25deg]"
          style={{ top: s.top, right: `${s.right}%`, height: s.height, opacity: s.opacity }}
        />
      ))}
    </div>
  );
}

/** "Clients  A / B / C" — slash 의 Used by 줄. 데이터는 about.clientsLine 재사용(실명 규칙 그대로). */
function HeroClients() {
  const a = LANDING.about;
  const parts = a.clientsLine.split(' · ');
  return (
    <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-body-sm">
      <span className="text-fg-muted">{a.clientsLabel}</span>
      <span className="text-fg-body">
        {parts.map((part, i) => (
          <span key={part}>
            {part}
            {i < parts.length - 1 && (
              <span aria-hidden="true" className="mx-2 text-border-strong">
                /
              </span>
            )}
          </span>
        ))}
      </span>
    </p>
  );
}

/** "최근 강의 — 날짜 · 제목" 한 줄. 데이터는 teaching.courses 에서 파생(새 내용 없음). 강의 이력으로 가는 앵커. */
function HeroRecent() {
  const c = latestCourse(LANDING.teaching.courses);
  if (!c) return null;
  return (
    <a
      href="#teaching"
      data-slot="hero-recent"
      className="focus-ring group inline-flex max-w-full flex-wrap items-baseline gap-x-2.5 gap-y-1 rounded-sm text-body-sm text-fg-body"
    >
      <span className="inline-flex items-center gap-2 text-fg-muted">
        <span aria-hidden="true" className="size-1.5 translate-y-[-1px] rounded-full bg-accent-default" />
        {LANDING.hero.recentLabel}
      </span>
      <span className="font-mono text-label tabular-nums text-fg-muted">{c.date}</span>
      <span className="underline-offset-4 group-hover-fine:underline">
        {c.title}
        <ArrowUpRight aria-hidden="true" className="ml-0.5 inline size-3.5 text-fg-muted" />
      </span>
    </a>
  );
}

/** 스크롤로 히어로를 벗어나는 동안 이름이 살짝 줄고 흐려진다 — rAF 로 DOM 에 직접(리렌더 없음). */
function useHeroNameFade<T extends HTMLElement>() {
  const ref = React.useRef<T>(null);
  React.useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const apply = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const f = heroFade(window.scrollY);
      el.style.transform = f.scale === 1 ? '' : `scale(${f.scale.toFixed(3)})`;
      el.style.opacity = f.opacity === 1 ? '' : f.opacity.toFixed(3);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const unsub = scrollStore.subscribe(schedule);
    return () => {
      unsub();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return ref;
}

export function Hero() {
  const h = LANDING.hero;
  const nameRef = useHeroNameFade<HTMLSpanElement>();
  const magnetA = useMagnetic<HTMLSpanElement>();
  const magnetB = useMagnetic<HTMLSpanElement>();
  // 3D 는 히어로가 보일 때만 돈다(frameloop always ↔ demand)
  const [canvasRef, canvasInView] = useInView<HTMLDivElement>({ threshold: 0.05, once: false });
  // 1024 미만에서는 캔버스가 글 아래로 밀려 탭바에 잘리고 three 번들만 무겁다 → 아예 마운트하지 않는다(영상 배경만). 2026-11-01 결정
  const expanded = useMedia(MQ_EXPANDED);
  return (
    <Section id="top" title={h.name} header="none" className="overflow-hidden px-0 pt-0 pb-0" innerClassName="max-w-none gap-0">
      {/* 배경 레이어: 영상 → 좌측 흰 막 → 하단 페이지색 페이드. 다크는 어두운 막 */}
      <HeroVideo />
      <HeroShards />
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

      <div className="relative mx-auto grid w-full max-w-[1120px] min-h-[min(640px,calc(100svh-var(--bs-layout-topbar-h)))] items-center gap-8 px-4 pt-[calc(var(--bs-layout-topbar-h)+var(--spacing)*12)] pb-20 medium:px-8 expanded:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] expanded:min-h-0">
        <div className="flex min-w-0 flex-col items-start gap-7">
          <h1 id="top-title" className="landing-mask text-h1 text-fg-default medium:text-display expanded:text-display-xl">
            <span data-reveal="rise" className="block">
              <span ref={nameRef} data-slot="hero-name" className="block origin-left will-change-transform">
                {h.name}
              </span>
            </span>
          </h1>
          <Reveal index={2} as="p" className="-mt-3 text-h3 font-semibold tracking-normal text-fg-muted">
            {h.role}
            <span aria-hidden="true" className="landing-caret">
              |
            </span>
          </Reveal>
          <div className="flex max-w-[600px] flex-col gap-3">
            {h.lines.map((line, i) => (
              <Reveal key={line} index={3 + i} as="p" className={i === 0 ? 'text-h3 font-semibold text-fg-default' : 'text-body-lg text-fg-body'}>
                {line}
              </Reveal>
            ))}
          </div>
          <Reveal index={6} className="flex flex-wrap gap-3">
            <span className="landing-magnet inline-flex" {...magnetA}>
              <Button asChild size="lg">
                <a href={h.ctas[0].href}>{h.ctas[0].label}</a>
              </Button>
            </span>
            <span className="landing-magnet inline-flex" {...magnetB}>
              {/* 보조 CTA = liquid glass(렌즈 굴절). 뒤가 히어로 영상이라 굴절이 가장 잘 보이는 자리. 등장은 Reveal 이 맡는다 */}
              <GlassSurface
                as="a"
                href={h.ctas[1].href}
                interactive
                appear={false}
                backdrop="medium"
                className="focus-ring inline-flex h-12 items-center px-6 text-body font-semibold"
              >
                {h.ctas[1].label}
              </GlassSurface>
            </span>
          </Reveal>
          <Reveal index={7} variant="fade" className="flex flex-col gap-2.5 border-t border-border-default pt-5">
            <HeroRecent />
            <HeroClients />
          </Reveal>
        </div>
        {expanded && (
          <Reveal index={2} variant="fade" className="relative hidden min-w-0 h-[clamp(340px,36vw,540px)] expanded:block">
            <div ref={canvasRef} data-canvas-inview={canvasInView} className="absolute inset-0">
              <HeroCanvas inView={canvasInView} />
            </div>
          </Reveal>
        )}
      </div>
    </Section>
  );
}
