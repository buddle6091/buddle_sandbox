'use client';

import { cn } from '@sandbox/ui/lib/utils';

import { LANDING } from '../content/landing';
import { LazySection } from '../observe/lazy-section';
import { Reveal, Section } from './section';

/** 후기 — v3: 2열 작은 인용 대신 큰 글씨 인용 2개를 엇갈려 쌓는다(둘째는 expanded 에서 오른쪽으로). */
export function Feedback() {
  const f = LANDING.feedback;
  return (
    <Section id="feedback" title={f.title} lead={f.note} className="py-28">
      <LazySection minHeight={310}>
        <div className="flex flex-col gap-14">
          {f.quotes.map((q, i) => (
            <Reveal
              key={q.from}
              index={i * 2}
              as="figure"
              className={cn('flex max-w-[860px] flex-col gap-5 border-t border-border-default pt-6', i % 2 === 1 && 'expanded:ml-auto')}
            >
              <blockquote className="text-h3 font-semibold text-fg-default medium:text-h2 medium:font-semibold">{q.quote}</blockquote>
              <figcaption className="font-mono text-label text-fg-muted">{q.from}</figcaption>
            </Reveal>
          ))}
        </div>
      </LazySection>
    </Section>
  );
}
