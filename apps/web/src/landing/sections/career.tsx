'use client';

import * as React from 'react';

import { LANDING } from '../content/landing';
import { LazySection } from '../observe/lazy-section';
import { MetaLabel } from './meta-label';
import { Reveal, Section } from './section';

/**
 * 경력 항목 — v3: 유리 카드 타임라인 대신 선으로 나눈 2단(좌 기간 · 우 내용).
 * 불릿이 collapsedBullets 보다 많으면 접어 두고 「나머지 N개 더 보기」(aria-expanded)로 편다.
 */
function CareerRow({ item, index }: { item: (typeof LANDING.career.items)[number]; index: number }) {
  const c = LANDING.career;
  const [open, setOpen] = React.useState(false);
  const id = React.useId();
  const extra = item.bullets.length - c.collapsedBullets;
  const collapsible = extra > 0;
  const bullets = collapsible && !open ? item.bullets.slice(0, c.collapsedBullets) : item.bullets;
  return (
    <Reveal index={Math.min(index, 3)} as="li" className="landing-spot grid list-none gap-x-8 gap-y-3 border-b border-border-default py-8 medium:grid-cols-[152px_minmax(0,1fr)]">
      <span className="font-mono text-label tabular-nums text-fg-link">{item.period}</span>
      <div className="flex min-w-0 flex-col gap-3">
        <h3 className="text-h3 font-bold text-fg-default">{item.title}</h3>
        {'summary' in item && item.summary && <p className="text-body font-semibold text-fg-body">{item.summary}</p>}
        <ul id={id} className="flex list-disc flex-col gap-1.5 pl-4.5 text-body text-fg-body">
          {bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
        {collapsible && (
          <button
            type="button"
            aria-expanded={open}
            aria-controls={id}
            onClick={() => setOpen((v) => !v)}
            className="focus-ring self-start rounded-sm text-label text-fg-link underline-offset-4 hover-fine:underline"
          >
            {open ? c.lessLabel : c.moreLabel(extra)}
          </button>
        )}
        {'stack' in item && item.stack && <MetaLabel parts={item.stack.split(' · ')} className="leading-relaxed" />}
      </div>
    </Reveal>
  );
}

export function Career() {
  const c = LANDING.career;
  return (
    <Section id="career" title={c.title} className="py-28">
      <LazySection minHeight={1020} className="flex flex-col gap-12">
        <ol className="flex flex-col border-t border-border-default">
          {c.items.map((it, i) => (
            <CareerRow key={it.period} item={it} index={i} />
          ))}
        </ol>
        <Reveal index={1} as="dl" className="grid gap-x-8 gap-y-6 medium:grid-cols-[152px_minmax(0,1fr)]">
          <dt className="text-label font-bold text-fg-default">{c.education.title}</dt>
          <dd className="text-body text-fg-body">
            {c.education.school}
            <span className="mt-1 block font-mono text-caption text-fg-muted">{c.education.detail}</span>
          </dd>
          <dt className="text-label font-bold text-fg-default">{c.certs.title}</dt>
          <dd>
            <ul className="flex flex-col gap-1 text-body text-fg-body">
              {c.certs.items.map((x) => (
                <li key={x.name} className="flex flex-wrap items-baseline gap-x-2.5">
                  {x.name}
                  <span className="font-mono text-caption tabular-nums text-fg-muted">{x.date}</span>
                </li>
              ))}
            </ul>
          </dd>
        </Reveal>
      </LazySection>
    </Section>
  );
}
