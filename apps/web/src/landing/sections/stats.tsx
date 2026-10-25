'use client';

import * as React from 'react';

import { Card } from '@sandbox/ui/components/card';

import { LANDING, type Stat } from '../content/landing';
import { useInView } from '../observe/use-in-view';
import { Reveal, Section } from './section';
import { formatNumber, useCountUp } from './use-count-up';

function StatCard({ stat, index, active }: { stat: Stat; index: number; active: boolean }) {
  const n = useCountUp(stat.value, active);
  return (
    <Reveal index={index} as="li" className="list-none">
      <Card variant="glass" className="h-full gap-1 p-5">
        <p className="text-h2 tabular-nums text-fg-default">
          {formatNumber(n)}
          <span className="text-h3 font-semibold text-accent-default">{stat.unit}</span>
          {stat.plus && (
            <span className="ml-1 text-label text-accent-default" aria-label="이상">
              +
            </span>
          )}
        </p>
        <p className="text-caption text-fg-muted">{stat.label}</p>
      </Card>
    </Reveal>
  );
}

export function Stats() {
  const [ref, active] = useInView<HTMLUListElement>({ threshold: 0.4 });
  return (
    <Section id="stats" eyebrow="At a glance" title="숫자로 보는 이력" className="min-h-[70dvh]">
      <ul ref={ref} className="grid grid-cols-2 gap-3 medium:grid-cols-3 expanded:grid-cols-5">
        {LANDING.stats.map((s, i) => (
          <StatCard key={s.label} stat={s} index={i} active={active} />
        ))}
      </ul>
      <Reveal index={6} as="p" className="text-caption text-fg-muted">
        이력서에 기재된 확정 과정 기준입니다.
      </Reveal>
    </Section>
  );
}
