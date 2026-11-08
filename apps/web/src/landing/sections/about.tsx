'use client';

import * as React from 'react';

import { cn } from '@sandbox/ui/lib/utils';

import { LANDING, type Stat } from '../content/landing';
import { cumulativeByDate, sparklinePath } from '../fx/sparkline';
import { LazySection } from '../observe/lazy-section';
import { useInView } from '../observe/use-in-view';
import { Reveal, Section } from './section';
import { easeOutQuart, formatNumber, useCountUp } from './use-count-up';

/** 대표 숫자 index — 1,000h+ 누적 강의 시간(slash Downloads 의 160px 숫자 자리) */
const LEAD = 1;

/** slash 식 맨몸 타이포 — 카드 없이 숫자 + 라벨. lead 는 display→display-xl, 나머지는 h1→display. */
function StatFigure({ stat, index, active, lead }: { stat: Stat; index: number; active: boolean; lead: boolean }) {
  const n = useCountUp(stat.value, active, 1600, easeOutQuart);
  return (
    <Reveal index={index} as="li" className={cn('flex list-none flex-col gap-1', lead && 'col-span-2 medium:col-span-3 expanded:col-span-1')}>
      <p
        data-slot={lead ? 'stat-lead' : 'stat'}
        className={cn(
          // block p 는 nowrap 인데도 단위 span 뒤 `+` 가 다음 줄로 내려갔다(1024~1439 실측) → inline 배치를 flex 로 고정
          'flex items-baseline tabular-nums whitespace-nowrap text-fg-default',
          lead ? 'text-display expanded:text-display-xl' : 'text-h1 expanded:text-display',
        )}
      >
        {formatNumber(n)}
        <span className={cn('font-bold text-accent-default', lead ? 'text-h2 expanded:text-h1' : 'text-h3')}>{stat.unit}</span>
        {stat.plus && (
          <span className={cn('ml-0.5 font-bold text-accent-default', lead ? 'text-h2 expanded:text-h1' : 'text-h3')} aria-label="이상">
            +
          </span>
        )}
      </p>
      <p className="text-body text-fg-muted">{stat.label}</p>
    </Reveal>
  );
}

/** 주요 과정 누적 강의 시간 추세 — 축 숫자 없음(규칙 5). 리빌 시 선이 왼쪽부터 그려진다(pathLength 1). */
function Sparkline() {
  const d = React.useMemo(() => sparklinePath(cumulativeByDate(LANDING.teaching.courses).map((p) => p.total)), []);
  const n = LANDING.teaching.courses.length;
  const caption = `주요 ${n}개 과정 누적 강의 시간 추이 (전체 1,000h+ 중 일부 · 축 생략)`;
  return (
    <Reveal index={6} as="figure" className="flex flex-col gap-4">
      <svg data-slot="sparkline" viewBox="0 0 1000 200" role="img" aria-label={caption} className="h-auto w-full overflow-visible text-fg-default">
        <line x1="0" y1="192" x2="1000" y2="192" className="stroke-border-default" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        <line x1="0" y1="100" x2="1000" y2="100" className="stroke-border-default" strokeWidth="1" strokeDasharray="4 6" opacity="0.5" vectorEffect="non-scaling-stroke" />
        <path data-slot="spark-path" d={d} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" pathLength={1} vectorEffect="non-scaling-stroke" className="landing-spark" />
      </svg>
      <figcaption className="text-body text-fg-muted">{caption}</figcaption>
    </Reveal>
  );
}

function StatsBody() {
  const a = LANDING.about;
  const [ref, active] = useInView<HTMLUListElement>({ threshold: 0.3 });
  // lead 를 맨 앞에 두고 나머지는 원래 순서 — 값·개수(5) 는 그대로
  const ordered = [a.stats[LEAD], ...a.stats.filter((_, i) => i !== LEAD)];
  return (
    <>
      <ul ref={ref} data-stats className="grid grid-cols-2 items-baseline gap-x-6 gap-y-8 medium:grid-cols-3 expanded:grid-cols-[2fr_1fr_1fr_1fr_1fr]">
        {ordered.map((s, i) => (
          <StatFigure key={s.label} stat={s} index={i} active={active} lead={i === 0} />
        ))}
      </ul>
      <Sparkline />
      <Reveal index={7} as="p" className="text-body text-fg-muted">
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
      <LazySection minHeight={500} className="flex flex-col gap-10">
        <StatsBody />
      </LazySection>
    </Section>
  );
}
