'use client';

import { LANDING } from '../content/landing';
import { barPercent } from '../fx/bars';
import { LazySection } from '../observe/lazy-section';
import { Reveal, Section } from './section';

export function Audience() {
  const a = LANDING.audience;
  return (
    <Section id="audience" eyebrow={a.eyebrow} title={a.title} lead={a.note} variant="tinted">
      <LazySection minHeight={520}>
        <Reveal index={1} as="ol" className="flex flex-col gap-2.5">
          {a.bars.map((b, i) => (
            <li key={b.name} className="grid grid-cols-[minmax(96px,150px)_minmax(0,1fr)_56px] items-center gap-3">
              <span className="text-body-sm font-semibold text-fg-default">{b.name}</span>
              <div className="h-2.5 overflow-hidden rounded-full bg-bg-muted">
                <div
                  data-slot="bar"
                  className="landing-bar-fill h-full rounded-full bg-gradient-to-r from-accent-default to-accent-tertiary"
                  style={{ width: `${barPercent(b.hours, a.max)}%`, '--i': i } as React.CSSProperties}
                />
              </div>
              <span className="text-right text-caption font-semibold tabular-nums text-fg-muted">{b.hours}h</span>
            </li>
          ))}
        </Reveal>
      </LazySection>
    </Section>
  );
}
