'use client';

import { Badge } from '@sandbox/ui/components/badge';
import { cn } from '@sandbox/ui/lib/utils';

import { LANDING } from '../content/landing';
import { Reveal, Section } from './section';

/** 누적 시간이 많을수록 진한 칩 — 이력서 "색이 진할수록" 규칙을 세 단계로 */
function tone(hours: number) {
  if (hours >= 200) return 'bg-accent-default text-accent-fg-on';
  if (hours >= 30) return 'bg-accent-subtle-bg text-accent-fg-strong';
  return 'border border-border-default bg-bg-default text-fg-body';
}

export function Audience() {
  const a = LANDING.audience;
  return (
    <Section id="audience" eyebrow={a.eyebrow} title={a.title}>
      <ul className="flex flex-wrap gap-2">
        {a.orgs.map((o, i) => (
          <Reveal
            key={o.name}
            index={i}
            as="li"
            className={cn('inline-flex h-9 items-center gap-2 rounded-full px-3.5 text-body-sm', tone(o.hours))}
          >
            {o.masked ? (
              <>
                <span aria-label="비공개 기관" className="inline-block h-3 w-14 rounded-sm bg-[repeating-linear-gradient(135deg,var(--bs-color-border-strong)_0_2px,transparent_2px_6px)]" />
                <Badge variant="outline">비공개</Badge>
              </>
            ) : (
              <span className="font-semibold">{o.name}</span>
            )}
            <span className="text-caption tabular-nums opacity-90">{o.hours}h</span>
          </Reveal>
        ))}
        <Reveal
          index={a.orgs.length}
          as="li"
          className="inline-flex h-9 items-center gap-2 rounded-full border border-dashed border-border-strong px-3.5 text-body-sm text-fg-muted"
        >
          그 외 {a.rest.count}곳 <span className="text-caption tabular-nums">{a.rest.hours}h</span>
        </Reveal>
      </ul>
      <Reveal index={a.orgs.length + 1} as="p" className="text-caption text-fg-muted">
        {a.note}
      </Reveal>
    </Section>
  );
}
