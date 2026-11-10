'use client';

import * as React from 'react';

import { Card } from '@sandbox/ui/components/card';
import { cn } from '@sandbox/ui/lib/utils';

import { LANDING } from '../content/landing';
import { stackCard, stackProgress, stackStyle } from '../fx/stack';
import { LazySection } from '../observe/lazy-section';
import { MQ_EXPANDED, MQ_REDUCED_MOTION, useMedia } from '../observe/use-media';
import { scrollStore } from '../scroll/store';
import { Reveal, Section } from './section';

type Item = { title: string; body: string };

/** 카드 본문 — 그리드·스택 공용. 호버 시 slash 식 반전(bg/inverse). */
function MentoringCardBody({ no, title, body, className }: Item & { no: string; className?: string }) {
  return (
    <Card
      variant="glass"
      className={cn(
        'group h-full gap-3 p-6 transition-colors duration-[var(--bs-motion-control)] ease-bs hover-fine:bg-bg-inverse hover-fine:text-fg-inverse',
        className,
      )}
    >
      <span className="text-label font-extrabold tabular-nums text-fg-link group-hover-fine:text-fg-inverse">{no}</span>
      <h3 className="text-h3 font-bold text-fg-default group-hover-fine:text-fg-inverse">{title}</h3>
      <p className="text-body text-fg-muted group-hover-fine:text-fg-inverse">{body}</p>
    </Card>
  );
}

/** compact · medium — 유리 카드 그리드 대신 번호 붙은 평문 목록(v3). 카드는 expanded 스택에서만 쓴다. */
function MentoringList({ items }: { items: readonly Item[] }) {
  return (
    <ol data-slot="mentoring-list" className="flex flex-col border-t border-border-default">
      {items.map((it, i) => (
        <Reveal key={it.title} index={i} as="li" className="grid list-none grid-cols-[auto_minmax(0,1fr)] gap-x-5 gap-y-2 border-b border-border-default py-6">
          <span className="font-mono text-label tabular-nums text-fg-link">{`0${i + 1}`}</span>
          <h3 className="text-h3 font-bold text-fg-default">{it.title}</h3>
          <p className="col-start-2 text-body text-fg-body">{it.body}</p>
        </Reveal>
      ))}
    </ol>
  );
}

/**
 * 스택 스테이지 — slash.page Principles 실측(2026-11-08). 섹션을 320vh 로 늘리고 스테이지를 sticky 로 고정,
 * 스크롤 진행도(scrollStore) → fx/stack 순수 함수 → 카드 transform/opacity 를 rAF 로 DOM 에 직접 쓴다(리렌더 없음).
 * slash 는 position:fixed 를 썼지만 sticky 가 탭바·진행 막대와 z-index 충돌이 없고 섹션 밖으로 새지 않는다.
 */
function MentoringStack({ items }: { items: readonly Item[] }) {
  const stageRef = React.useRef<HTMLDivElement>(null);
  const n = items.length;

  React.useEffect(() => {
    const stage = stageRef.current;
    const section = stage?.closest('section');
    if (!stage || !section) return;
    let raf = 0;
    const apply = () => {
      raf = 0;
      const r = section.getBoundingClientRect();
      const top = r.top + window.scrollY;
      const p = stackProgress(top, r.height, window.innerHeight, window.scrollY);
      const cards = stage.querySelectorAll<HTMLElement>('[data-stack-card]');
      cards.forEach((el, i) => {
        const c = stackCard(i, n, p);
        el.style.transform = stackStyle(c);
        el.style.opacity = c.opacity.toFixed(3);
      });
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };
    schedule();
    const unsub = scrollStore.subscribe(schedule);
    window.addEventListener('resize', schedule);
    return () => {
      unsub();
      window.removeEventListener('resize', schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [n]);

  return (
    <div
      ref={stageRef}
      data-stack
      className="sticky top-[var(--bs-layout-topbar-h)] h-[calc(100svh-var(--bs-layout-topbar-h))] w-full"
    >
      <div className="relative mx-auto h-full w-full max-w-[1120px]">
        {items.map((it, i) => (
          <div
            key={it.title}
            data-stack-card
            className="landing-stack-card absolute top-1/2 left-1/2 h-[340px] w-[480px] will-change-transform"
            style={{ zIndex: i, opacity: i === 0 ? 1 : 0, transform: stackStyle(stackCard(i, n, 0)) }}
          >
            <MentoringCardBody no={`0${i + 1}`} title={it.title} body={it.body} className="h-full justify-between p-8 [&_h3]:text-h1 [&_h3]:font-bold [&_p]:text-body-lg [&_span]:text-h3" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function Mentoring() {
  const m = LANDING.mentoring;
  const expanded = useMedia(MQ_EXPANDED);
  const reduced = useMedia(MQ_REDUCED_MOTION);
  const stack = expanded && !reduced;
  return (
    <Section
      id="mentoring"
      title={
        <>
          {m.title}
          <span className="ml-2 align-top font-mono text-caption font-normal text-fg-muted">({m.items.length})</span>
        </>
      }
      lead={m.lead}
      className={cn('pt-20', stack && 'pb-0')}
      // sticky 는 containing block(inner div) 안에서만 머문다 → inner 를 320vh 로 늘려야 스테이지가 붙어 있다
      innerClassName={cn(stack && 'min-h-[320vh] gap-6')}
    >
      {stack ? (
        <MentoringStack items={m.items} />
      ) : (
        <LazySection minHeight={900}>
          <MentoringList items={m.items} />
        </LazySection>
      )}
    </Section>
  );
}
