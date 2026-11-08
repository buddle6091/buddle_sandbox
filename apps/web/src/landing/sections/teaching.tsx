'use client';

import { Badge } from '@sandbox/ui/components/badge';

import { LANDING } from '../content/landing';
import { LazySection } from '../observe/lazy-section';
import { Reveal, Section } from './section';

/**
 * 강의 이력 행 — slash.page Projects 리스트 실측(2026-11-08): 큰 제목 + 호버 시 깜빡이는 `|` 캐럿,
 * 1px 구분선, 호버 배경 2~3%, 우측 모노 메타. 가로 덱(v2)은 모바일 발견성이 낮아 세로 행으로 교체.
 */
function CourseList() {
  const t = LANDING.teaching;
  return (
    <ol className="border-t border-border-default">
      {t.courses.map((c, i) => (
        <Reveal
          key={`${c.date}-${c.title}`}
          index={Math.min(i, 6)}
          as="li"
          data-course-row
          className="landing-row grid list-none grid-cols-[1fr_auto] items-start gap-x-6 gap-y-3 border-b border-border-default py-7 transition-colors duration-[var(--bs-motion-control)] ease-bs hover-fine:bg-bg-subtle medium:grid-cols-[minmax(0,1fr)_auto] medium:py-8"
        >
          <div className="flex min-w-0 flex-col gap-3">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
              <span className="font-mono text-label tabular-nums text-fg-muted">{c.date}</span>
              <span className="inline-flex h-6.5 items-center rounded-full bg-gradient-to-r from-accent-default to-accent-tertiary px-2.5 text-caption font-bold text-accent-fg-on">
                {c.hours}
              </span>
            </div>
            <h3 className="text-h2 font-bold text-fg-default medium:text-h1 medium:font-bold">
              {c.title}
              <span aria-hidden="true" className="landing-caret ml-1">
                |
              </span>
            </h3>
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge variant="accent" className="h-6.5 max-w-none px-2.5">
                {c.industry}
              </Badge>
              <Badge variant="outline" className="h-6.5 max-w-none px-2.5">
                {c.target}
              </Badge>
              <span className="ml-1 font-mono text-label text-fg-muted">{c.tool}</span>
            </div>
          </div>
          <span className="font-mono text-label tabular-nums text-fg-muted medium:text-body" aria-label={`${i + 1}번째`}>
            {String(i + 1).padStart(2, '0')}
          </span>
        </Reveal>
      ))}
    </ol>
  );
}

export function Teaching() {
  const t = LANDING.teaching;
  return (
    <Section id="teaching" eyebrow={t.eyebrow} title={t.title} lead={t.policy}>
      <LazySection minHeight={1800}>
        <CourseList />
      </LazySection>
    </Section>
  );
}
