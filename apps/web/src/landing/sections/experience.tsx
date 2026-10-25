'use client';

import { Badge } from '@sandbox/ui/components/badge';

import { LANDING } from '../content/landing';
import { Reveal, Section } from './section';

export function Experience() {
  const e = LANDING.experience;
  let idx = 0;
  return (
    <Section id="experience" eyebrow={e.eyebrow} title={e.title} className="min-h-0">
      <div className="grid gap-12 expanded:grid-cols-[1fr_1fr]">
        {/* 강의 이력 */}
        <div className="flex flex-col gap-8">
          <Reveal index={idx++} as="h3" className="text-h3 text-fg-default">
            강의 이력
          </Reveal>
          {e.teaching.map((year) => (
            <div key={year.year} className="flex flex-col gap-3">
              <Reveal index={idx++} className="flex items-baseline gap-3 border-b border-border-default pb-2">
                <span className="text-h3 font-bold tabular-nums text-accent-fg-strong">{year.year}</span>
                <span className="text-body-sm text-fg-muted">{year.role}</span>
              </Reveal>
              <ul className="flex flex-col">
                {year.items.map((it) => (
                  <Reveal
                    key={`${it.org}-${it.course}`}
                    index={idx++}
                    as="li"
                    className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-0.5 py-2 text-body-sm medium:grid-cols-[132px_1fr_auto]"
                  >
                    <span className="font-semibold text-fg-default">{it.org}</span>
                    <span className="col-span-2 text-fg-body medium:col-span-1">{it.course}</span>
                    <span className="col-start-2 row-start-1 text-caption tabular-nums text-fg-muted medium:col-start-3">
                      {it.hours}h
                    </span>
                  </Reveal>
                ))}
              </ul>
              <Reveal index={idx++} as="p" className="text-caption text-fg-muted">
                그 외 {year.more}
              </Reveal>
            </div>
          ))}
        </div>

        {/* 개발 실무 — 강의 근거 */}
        <div className="flex flex-col gap-8">
          <Reveal index={idx++} as="h3" className="text-h3 text-fg-default">
            개발 실무 · 강의의 근거
          </Reveal>
          {e.career.map((c) => (
            <Reveal key={c.org} index={idx++} className="flex flex-col gap-3 rounded-lg glass-base-flat medium:glass-base p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-body font-semibold text-fg-default">
                  {c.org} <span className="text-fg-muted">— {c.role}</span>
                </p>
                <p className="text-caption tabular-nums text-fg-muted">{c.period}</p>
              </div>
              <p className="text-caption text-fg-muted">{c.summary}</p>
              {c.highlights.length > 0 && (
                <ul className="flex list-disc flex-col gap-1.5 pl-4 text-body-sm text-fg-body">
                  {c.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
              )}
              <p className="text-caption text-fg-subtle">{c.stack}</p>
            </Reveal>
          ))}
          <Reveal index={idx++} className="flex items-start gap-3 rounded-lg border border-border-default bg-bg-default p-4">
            <Badge variant="accent">수상</Badge>
            <div className="flex flex-col gap-1">
              <p className="text-body-sm font-semibold text-fg-default">{e.award.title}</p>
              <p className="text-caption text-fg-muted">{e.award.body}</p>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
