'use client';

import * as React from 'react';
import { ArrowDown } from 'lucide-react';

import { cn } from '@sandbox/ui/lib/utils';

import { LANDING } from '../content/landing';
import { courseFilterStore, useCourseFilter } from '../filter/store';
import { barPercent } from '../fx/bars';
import { courseCountByIndustry } from '../fx/course-filter';
import { LazySection } from '../observe/lazy-section';
import { Reveal, Section } from './section';

const ROW = 'grid grid-cols-[minmax(96px,150px)_minmax(0,1fr)_64px] items-center gap-3 py-1.5';

function Bar({ hours, max, index, on }: { hours: number; max: number; index: number; on?: boolean }) {
  return (
    // 흐림은 트랙에 건다 — 채움(.landing-bar-fill)은 reduced-motion 블록이 opacity 1 로 고정한다(레이어 밖 CSS 가 유틸리티를 이김)
    <div data-dim={on === false} className={cn('h-2.5 overflow-hidden rounded-full bg-bg-muted', on === false && 'opacity-40')}>
      <div
        data-slot="bar"
        className="landing-bar-fill h-full rounded-full bg-gradient-to-r from-accent-default to-accent-tertiary"
        style={{ width: `${barPercent(hours, max)}%`, '--i': index } as React.CSSProperties}
      />
    </div>
  );
}

/**
 * 산업군 막대 — v3: 아래 강의 이력에 행이 있는 산업군은 막대가 `#teaching` 앵커 링크다.
 * 누르면 강의 필터(industry)를 걸고 네이티브 앵커로 내려간다(스크립트 스크롤 없음, 규칙 3).
 * 행이 없는 산업군은 정적 — 눌러서 빈 결과가 나오는 일은 없다.
 */
export function Audience() {
  const a = LANDING.audience;
  const filter = useCourseFilter();
  const counts = React.useMemo(() => courseCountByIndustry(a.bars.map((b) => b.name), LANDING.teaching.courses), [a.bars]);
  const filtering = filter.industry !== null;
  return (
    <Section id="audience" title={a.title} lead={`${a.note} ${a.hint}`} layout="split" className="py-28">
      <LazySection minHeight={450}>
        <Reveal index={1} as="ol" className="flex flex-col">
          {a.bars.map((b, i) => {
            const n = counts.get(b.name);
            const on = filter.industry === b.name;
            const label = (
              <>
                <span className={cn('text-body-sm font-semibold text-fg-default', n && 'underline-offset-4 group-hover-fine:underline')}>{b.name}</span>
                <Bar hours={b.hours} max={a.max} index={i} on={filtering ? on : undefined} />
                <span className="flex items-center justify-end gap-1 text-caption font-semibold tabular-nums text-fg-muted">
                  {b.hours}h{n && <ArrowDown aria-hidden="true" className={cn('size-3.5', on ? 'text-accent-default' : 'text-fg-muted')} />}
                </span>
              </>
            );
            return (
              <li key={b.name}>
                {n ? (
                  <a
                    href="#teaching"
                    data-bar-link
                    aria-current={on ? 'true' : undefined}
                    aria-label={`${b.name} ${b.hours}시간 — 강의 이력 ${n}건 보기`}
                    onClick={() => courseFilterStore.set({ industry: b.name, target: null })}
                    className={cn(ROW, 'focus-ring group -mx-2 rounded-sm px-2 transition-colors duration-[var(--bs-motion-control)] ease-bs hover-fine:bg-bg-subtle')}
                  >
                    {label}
                  </a>
                ) : (
                  <div className={ROW}>{label}</div>
                )}
              </li>
            );
          })}
        </Reveal>
      </LazySection>
    </Section>
  );
}
