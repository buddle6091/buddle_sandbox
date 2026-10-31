'use client';

import { Card } from '@sandbox/ui/components/card';

import { LANDING } from '../content/landing';
import { LazySection } from '../observe/lazy-section';
import { Reveal, Section } from './section';

export function Career() {
  const c = LANDING.career;
  return (
    <Section id="career" eyebrow={c.eyebrow} title={c.title} variant="tinted">
      <LazySection minHeight={900} className="flex flex-col gap-10">
        <ol className="flex flex-col gap-8 border-l-2 border-border-default pl-7">
          {c.items.map((it, i) => (
            <Reveal key={it.period} index={i} variant="flip" as="li" className="relative">
              <span
                aria-hidden="true"
                className="absolute top-1.5 -left-[38px] size-4 rounded-full bg-gradient-to-br from-accent-default to-accent-tertiary ring-4 ring-bg-subtle"
              />
              <Card variant="glass" className="gap-2.5 p-6">
                <span className="text-label font-bold tabular-nums text-fg-link">{it.period}</span>
                <h3 className="text-h3 font-bold text-fg-default">{it.title}</h3>
                {it.stack && <p className="text-label font-normal text-fg-muted">{it.stack}</p>}
                {it.summary && <p className="text-body-sm font-semibold text-fg-body">{it.summary}</p>}
                <ul className="flex list-disc flex-col gap-1.5 pl-4.5 text-body text-fg-body">
                  {it.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </Card>
            </Reveal>
          ))}
        </ol>
        <div className="grid gap-5 medium:grid-cols-2">
          <Reveal index={0}>
            <Card variant="flat" className="h-full gap-2.5 p-6">
              <h3 className="text-body font-bold text-fg-default">{c.education.title}</h3>
              <p className="text-body text-fg-body">
                {c.education.school}
                <br />
                <span className="text-label font-normal text-fg-muted">{c.education.detail}</span>
              </p>
            </Card>
          </Reveal>
          <Reveal index={1}>
            <Card variant="flat" className="h-full gap-2.5 p-6">
              <h3 className="text-body font-bold text-fg-default">{c.certs.title}</h3>
              <ul className="flex flex-col gap-1 text-body text-fg-body">
                {c.certs.items.map((x) => (
                  <li key={x.name}>
                    {x.name} <span className="text-label font-normal tabular-nums text-fg-muted">{x.date}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </Reveal>
        </div>
      </LazySection>
    </Section>
  );
}
