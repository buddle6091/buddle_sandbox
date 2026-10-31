'use client';

import * as React from 'react';

import { Badge } from '@sandbox/ui/components/badge';

import { LANDING } from '../content/landing';
import { deckDistance, deckStyle, deckTransform } from '../fx/deck';
import { LazySection } from '../observe/lazy-section';
import { Reveal, Section } from './section';

/** 덱 스크롤 → 카드별 rotateY/translateZ/opacity (DOM 직접, 리렌더 없음). reduced-motion 은 변형 없음. */
function useDeckFx<T extends HTMLElement>() {
  const ref = React.useRef<T>(null);
  const apply = React.useCallback(() => {
    const deck = ref.current;
    if (!deck || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    for (const child of Array.from(deck.children) as HTMLElement[]) {
      const t = deckTransform(deckDistance(deck, child));
      child.style.transform = deckStyle(t);
      child.style.opacity = t.opacity.toFixed(3);
    }
  }, []);
  React.useEffect(() => {
    const deck = ref.current;
    if (!deck) return;
    let raf = 0;
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(() => {
        raf = 0;
        apply();
      });
    };
    schedule();
    deck.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      deck.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [apply]);
  return ref;
}

function Deck() {
  const t = LANDING.teaching;
  const ref = useDeckFx<HTMLDivElement>();
  return (
    <div
      ref={ref}
      role="region"
      aria-label={t.deckLabel}
      tabIndex={0}
      className="landing-deck focus-ring flex snap-x snap-mandatory gap-6 overflow-x-auto px-[max(16px,calc((100%-1120px)/2))] pt-8 pb-12 [perspective:1400px]"
    >
      {t.courses.map((c) => (
        <article
          key={`${c.date}-${c.title}`}
          className="landing-deck-card flex min-h-[280px] w-[min(340px,82vw)] shrink-0 snap-center flex-col gap-3.5 rounded-xl glass-base-flat p-7 [transform-style:preserve-3d]"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-label font-semibold tabular-nums text-fg-muted">{c.date}</span>
            <span className="inline-flex h-6.5 items-center rounded-full bg-gradient-to-r from-accent-default to-accent-tertiary px-2.5 text-caption font-bold text-accent-fg-on">
              {c.hours}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <Badge variant="accent" className="h-6.5 max-w-none px-2.5">
              {c.industry}
            </Badge>
            <Badge variant="outline" className="h-6.5 max-w-none px-2.5">
              {c.target}
            </Badge>
          </div>
          <h3 className="text-[19px] leading-[1.45] font-bold text-fg-default">{c.title}</h3>
          <span className="mt-auto text-label text-fg-muted">{c.tool}</span>
        </article>
      ))}
    </div>
  );
}

export function Teaching() {
  const t = LANDING.teaching;
  return (
    <Section id="teaching" eyebrow={t.eyebrow} title={t.title} lead={t.policy} className="px-0 medium:px-0" innerClassName="max-w-none gap-3 [&>header]:mx-auto [&>header]:w-full [&>header]:max-w-[1120px] [&>header]:px-4 medium:[&>header]:px-8">
      <LazySection minHeight={420}>
        <Reveal index={1} variant="depth">
          <Deck />
        </Reveal>
      </LazySection>
    </Section>
  );
}
