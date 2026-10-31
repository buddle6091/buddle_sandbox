'use client';

import { Card } from '@sandbox/ui/components/card';

import { LANDING, type Stat } from '../content/landing';
import { LazySection } from '../observe/lazy-section';
import { useInView } from '../observe/use-in-view';
import { Reveal, Section } from './section';
import { easeOutQuart, formatNumber, useCountUp } from './use-count-up';
import { useTilt } from './use-tilt';

function StatCard({ stat, index, active }: { stat: Stat; index: number; active: boolean }) {
  const n = useCountUp(stat.value, active, 1600, easeOutQuart);
  const tilt = useTilt<HTMLDivElement>();
  return (
    <Reveal index={index} as="li" className="list-none">
      <Card variant="glass" className="landing-tilt h-full gap-1 p-6" {...tilt}>
        <p className="landing-pop text-h2 font-extrabold tabular-nums text-fg-default medium:text-[40px] medium:leading-[1.15]">
          {formatNumber(n)}
          <span className="text-h3 font-bold text-accent-default">{stat.unit}</span>
          {stat.plus && (
            <span className="ml-0.5 text-h3 font-bold text-accent-default" aria-label="이상">
              +
            </span>
          )}
        </p>
        <p className="landing-pop text-label text-fg-muted">{stat.label}</p>
      </Card>
    </Reveal>
  );
}

function StatsBody() {
  const a = LANDING.about;
  const [ref, active] = useInView<HTMLUListElement>({ threshold: 0.3 });
  return (
    <>
      <ul ref={ref} data-stats className="grid grid-cols-2 gap-4 medium:grid-cols-3 expanded:grid-cols-5">
        {a.stats.map((s, i) => (
          <StatCard key={s.label} stat={s} index={i} active={active} />
        ))}
      </ul>
      <Reveal index={6} as="p" className="text-body text-fg-muted">
        <span className="font-semibold text-fg-default">{a.clientsLabel}</span>
        <span className="mx-2" aria-hidden="true" />
        {a.clientsLine}
      </Reveal>
    </>
  );
}

export function About() {
  return (
    <Section id="about" title="숫자로 보는 이력" eyebrow="AT A GLANCE" className="pt-12 pb-24">
      <LazySection minHeight={260} className="flex flex-col gap-6">
        <StatsBody />
      </LazySection>
    </Section>
  );
}
