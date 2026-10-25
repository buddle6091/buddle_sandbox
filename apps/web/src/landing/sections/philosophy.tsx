'use client';

import { Badge } from '@sandbox/ui/components/badge';

import { LANDING } from '../content/landing';
import { Reveal, Section } from './section';

export function Philosophy() {
  const p = LANDING.philosophy;
  return (
    <Section id="philosophy" eyebrow={p.eyebrow} title={p.title}>
      <div className="grid gap-10 expanded:grid-cols-[1fr_320px]">
        <div className="flex max-w-content flex-col gap-5">
          {p.paragraphs.map((t, i) => (
            <Reveal key={t} index={i} as="p" className="text-body-lg text-fg-body">
              {t}
            </Reveal>
          ))}
        </div>
        <Reveal index={3} className="flex flex-col gap-3 rounded-lg border border-border-default bg-bg-default p-5 shadow-sm">
          <p className="text-label text-fg-muted">{p.method.label}</p>
          <ol className="flex flex-wrap gap-1.5">
            {p.method.steps.map((s, i) => (
              <li key={s} className="flex items-center gap-1.5">
                <Badge variant={i === 0 ? 'accent' : 'default'}>{s}</Badge>
                {i < p.method.steps.length - 1 && <span className="text-fg-subtle">→</span>}
              </li>
            ))}
          </ol>
          <p className="text-body-sm text-fg-muted">{p.method.note}</p>
        </Reveal>
      </div>
    </Section>
  );
}
