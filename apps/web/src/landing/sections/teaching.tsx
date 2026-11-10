'use client';

import * as React from 'react';
import { X } from 'lucide-react';

import { Badge } from '@sandbox/ui/components/badge';
import { cn } from '@sandbox/ui/lib/utils';

import { LANDING } from '../content/landing';
import { courseFilterStore, useCourseFilter } from '../filter/store';
import { countLabel, filterCourses, isFiltered, targetsOf } from '../fx/course-filter';
import { LazySection } from '../observe/lazy-section';
import { Reveal, Section } from './section';

const CHIP = cn(
  'focus-ring inline-flex h-8 items-center gap-1.5 rounded-full border border-border-default px-3 text-label text-fg-body',
  'transition-colors duration-[var(--bs-motion-control)] ease-bs hover-fine:border-border-strong hover-fine:text-fg-default',
  'aria-pressed:border-transparent aria-pressed:bg-bg-inverse aria-pressed:text-fg-inverse',
);

/** 대상 칩(aria-pressed) + 산업군 해제 칩 + 결과 수(aria-live). 상태는 filter/store — 산업군 막대와 공유. */
function CourseFilterBar({ shown, total }: { shown: number; total: number }) {
  const t = LANDING.teaching;
  const f = useCourseFilter();
  const targets = targetsOf(t.courses);
  const allRef = React.useRef<HTMLButtonElement>(null);
  return (
    <div className="flex flex-col gap-3">
      <div role="group" aria-label={t.filterLabel} className="flex flex-wrap gap-2">
        <button ref={allRef} type="button" aria-pressed={!isFiltered(f)} onClick={() => courseFilterStore.reset()} className={CHIP}>
          {t.filterAll}
        </button>
        {targets.map((name) => (
          <button key={name} type="button" aria-pressed={f.target === name} onClick={() => courseFilterStore.toggle('target', name)} className={CHIP}>
            {name}
          </button>
        ))}
        {f.industry && (
          <button
            type="button"
            data-slot="industry-chip"
            aria-label={`산업군 ${f.industry} 필터 해제`}
            onClick={() => {
              courseFilterStore.set({ industry: null });
              // 이 칩은 해제와 함께 사라진다 — 포커스가 body 로 떨어지지 않게 「전체」 칩으로 옮긴다
              allRef.current?.focus();
            }}
            className={cn(CHIP, 'border-transparent bg-accent-subtle-bg text-accent-fg-strong')}
          >
            {f.industry}
            <X aria-hidden="true" className="size-3.5" />
          </button>
        )}
      </div>
      <p aria-live="polite" data-slot="course-count" className="font-mono text-label tabular-nums text-fg-muted">
        {countLabel(shown, total)}
      </p>
    </div>
  );
}

/**
 * 강의 이력 행 — slash.page Projects 리스트 실측(2026-11-08): 큰 제목 + 호버 시 깜빡이는 `|` 캐럿, 1px 구분선.
 * v3: 대상 · 산업군 필터로 행을 고른다. 번호는 원래 순서(01~10)를 유지해 "몇 번째 과정인지"가 바뀌지 않는다.
 * 호버 배경은 커서를 따라오는 스포트라이트(.landing-spot).
 */
function CourseList() {
  const t = LANDING.teaching;
  const f = useCourseFilter();
  const rows = filterCourses(t.courses, f);
  return (
    <>
      <CourseFilterBar shown={rows.length} total={t.courses.length} />
      <ol className="border-t border-border-default">
        {rows.map((c) => {
          const no = t.courses.indexOf(c) + 1;
          return (
            <li
              key={`${c.date}-${c.title}`}
              data-course-row
              className="landing-row landing-row-in landing-spot grid list-none grid-cols-[minmax(0,1fr)_auto] items-start gap-x-6 gap-y-3 border-b border-border-default py-7 medium:py-8"
            >
              <div className="flex min-w-0 flex-col gap-3">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                  <span className="font-mono text-label tabular-nums text-fg-muted">{c.date}</span>
                  <span className="font-mono text-label font-bold tabular-nums text-fg-link">{c.hours}</span>
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
              <span className="font-mono text-label tabular-nums text-fg-muted medium:text-body" aria-label={`${no}번째`}>
                {String(no).padStart(2, '0')}
              </span>
            </li>
          );
        })}
      </ol>
    </>
  );
}

export function Teaching() {
  const t = LANDING.teaching;
  return (
    <Section id="teaching" title={t.title} lead={t.policy} className="py-28">
      <LazySection minHeight={1825} className="flex flex-col gap-8">
        <Reveal index={1} className="flex flex-col gap-8">
          <CourseList />
        </Reveal>
      </LazySection>
    </Section>
  );
}
