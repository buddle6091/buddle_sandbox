'use client';

import { Badge } from '@sandbox/ui/components/badge';

import { LANDING } from '../content/landing';
import { Reveal, Section } from './section';

export function Curriculum() {
  const c = LANDING.curriculum;
  return (
    <Section id="curriculum" eyebrow={c.eyebrow} title={c.title}>
      <dl className="grid gap-6 medium:grid-cols-3">
        {c.groups.map((g, gi) => (
          <Reveal key={g.label} index={gi} className="flex flex-col gap-3 rounded-lg glass-base-flat medium:glass-base p-5">
            <dt className="text-label text-fg-muted">{g.label}</dt>
            <dd className="flex flex-wrap gap-1.5">
              {g.items.map((item) => (
                <Badge key={item} variant="outline" className="max-w-none">
                  {item}
                </Badge>
              ))}
            </dd>
          </Reveal>
        ))}
      </dl>
    </Section>
  );
}
