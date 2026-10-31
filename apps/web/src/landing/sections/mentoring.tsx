'use client';

import { Card } from '@sandbox/ui/components/card';

import { LANDING } from '../content/landing';
import { LazySection } from '../observe/lazy-section';
import { Reveal, Section } from './section';
import { useTilt } from './use-tilt';

function MentoringCard({ no, title, body, index }: { no: string; title: string; body: string; index: number }) {
  const tilt = useTilt<HTMLDivElement>();
  return (
    <Reveal index={index}>
      <Card variant="glass" className="landing-tilt h-full gap-3 p-6" {...tilt}>
        <span className="landing-pop text-label font-extrabold tabular-nums text-fg-link">{no}</span>
        <h3 className="landing-pop text-h3 font-bold text-fg-default">{title}</h3>
        <p className="landing-pop text-body text-fg-muted">{body}</p>
      </Card>
    </Reveal>
  );
}

export function Mentoring() {
  const m = LANDING.mentoring;
  return (
    <Section id="mentoring" eyebrow={m.eyebrow} title={m.title} className="pt-16">
      <LazySection minHeight={600}>
        <div className="grid gap-5 medium:grid-cols-2 expanded:grid-cols-3">
          {m.items.map((it, i) => (
            <MentoringCard key={it.title} no={`0${i + 1}`} title={it.title} body={it.body} index={i} />
          ))}
        </div>
      </LazySection>
    </Section>
  );
}
