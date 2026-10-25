'use client';

import { LANDING } from '../content/landing';
import { Reveal, Section } from './section';

export function Mentoring() {
  const m = LANDING.mentoring;
  return (
    <Section id="mentoring" eyebrow={m.eyebrow} title={m.title}>
      <dl className="grid gap-x-10 gap-y-8 medium:grid-cols-2">
        {m.items.map((it, i) => (
          <Reveal key={it.title} index={i} className="flex flex-col gap-2 border-t border-border-default pt-4">
            <dt className="text-h3 text-fg-default">{it.title}</dt>
            <dd className="text-body text-fg-body">{it.body}</dd>
          </Reveal>
        ))}
      </dl>
    </Section>
  );
}
