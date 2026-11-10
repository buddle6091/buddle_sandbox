'use client';

import * as React from 'react';

import { cn } from '@sandbox/ui/lib/utils';

import { LANDING } from '../content/landing';
import { LazySection } from '../observe/lazy-section';
import { Reveal, Section } from './section';

/**
 * 전문 분야 — v3: 유리 카드 3 + 칩 묶음 대신 타이포 목록.
 * 분야 이름이 토글 버튼(aria-pressed)이고, 하나를 누르면 그 분야만 또렷하고 나머지는 흐려진다(다시 누르면 해제).
 * 항목은 칩이 아니라 `/` 로 이어 쓴 문장형 목록 — 히어로 Clients 줄과 같은 문법.
 */
export function Expertise() {
  const e = LANDING.expertise;
  const [active, setActive] = React.useState<string | null>(null);
  return (
    <Section id="expertise" title={e.title} lead={e.hint} layout="split" className="py-28">
      <LazySection minHeight={440}>
        <div data-slot="expertise-groups" data-active={active !== null} className="flex flex-col">
          {e.groups.map((g, i) => {
            const on = active === g.title;
            return (
              <Reveal key={g.title} index={i} className="border-t border-border-default py-8 first:border-t-0 first:pt-0">
                {/* 흐림은 Reveal 안쪽 요소에 건다 — [data-reveal] 의 opacity 규칙(레이어 밖 CSS)이 유틸리티를 이기기 때문 */}
                <div
                  data-expertise-group
                  data-on={on}
                  data-dim={active !== null && !on}
                  className="landing-dim flex flex-col gap-4 medium:flex-row medium:gap-8"
                >
                <h3 className="shrink-0 medium:w-44">
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => setActive(on ? null : g.title)}
                    className="focus-ring group -mx-1 inline-flex items-baseline gap-2 rounded-sm px-1 text-left text-h2 font-bold text-fg-default"
                  >
                    <span className={cn('underline-offset-8 group-hover-fine:underline', on && 'underline decoration-accent-default')}>{g.title}</span>
                    <span className="font-mono text-caption font-normal tabular-nums text-fg-muted">{String(g.chips.length).padStart(2, '0')}</span>
                  </button>
                </h3>
                <ul className="flex flex-wrap gap-x-3 gap-y-2 text-body-lg text-fg-body">
                  {g.chips.map((c, j) => (
                    <li key={c} className="flex items-baseline gap-3">
                      <span>{c}</span>
                      {j < g.chips.length - 1 && (
                        <span aria-hidden="true" className="text-border-strong">
                          /
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
                </div>
              </Reveal>
            );
          })}
        </div>
      </LazySection>
    </Section>
  );
}
