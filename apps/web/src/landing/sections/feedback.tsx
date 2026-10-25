'use client';

import { LANDING } from '../content/landing';
import { Reveal, Section } from './section';

export function Feedback() {
  const f = LANDING.feedback;
  return (
    <Section id="feedback" eyebrow={f.eyebrow} title={f.title} className="min-h-[70dvh]">
      <div className="grid gap-6 medium:grid-cols-2">
        {f.quotes.map((q, i) => (
          <Reveal key={q.from} index={i} as="figure" className="flex flex-col gap-4 border-l-2 border-accent-default pl-5">
            <blockquote className="text-body-lg text-fg-body">{q.quote}</blockquote>
            <figcaption className="text-caption text-fg-muted">{q.from}</figcaption>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
