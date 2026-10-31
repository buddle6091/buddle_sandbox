'use client';

import { Badge } from '@sandbox/ui/components/badge';
import { Card } from '@sandbox/ui/components/card';

import { LANDING } from '../content/landing';
import { LazySection } from '../observe/lazy-section';
import { Reveal, Section } from './section';
import { useTilt } from './use-tilt';

function GroupCard({ title, chips, index }: { title: string; chips: readonly string[]; index: number }) {
  const tilt = useTilt<HTMLDivElement>();
  return (
    <Reveal index={index} variant="flip">
      <Card variant="glass" className="landing-tilt h-full gap-4 p-7" {...tilt}>
        <h3 className="landing-pop text-h3 font-bold text-fg-default">{title}</h3>
        <ul className="landing-pop flex flex-wrap gap-2">
          {chips.map((c) => (
            <li key={c}>
              <Badge variant="accent" className="h-8 max-w-none px-3 text-label">
                {c}
              </Badge>
            </li>
          ))}
        </ul>
      </Card>
    </Reveal>
  );
}

export function Expertise() {
  const e = LANDING.expertise;
  return (
    <Section id="expertise" eyebrow={e.eyebrow} title={e.title} variant="tinted">
      <LazySection minHeight={360}>
        <div className="grid gap-6 medium:grid-cols-3">
          {e.groups.map((g, i) => (
            <GroupCard key={g.title} title={g.title} chips={g.chips} index={i} />
          ))}
        </div>
      </LazySection>
    </Section>
  );
}
