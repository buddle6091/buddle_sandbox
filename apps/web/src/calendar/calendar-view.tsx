'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@sandbox/ui/components/button';
import { cn } from '@sandbox/ui/lib/utils';

import { MetaLabel } from '../landing/sections/meta-label';
import { expandSchedule, initialMonth, monthMatrix, monthStats, type ScheduleEvent } from './month';
import { SCHEDULE, SCHEDULE_MONTHS } from './schedule';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];
const EVENTS = expandSchedule(SCHEDULE);
const BY_DATE = EVENTS.reduce<Record<string, ScheduleEvent[]>>((acc, e) => {
  (acc[e.date] ??= []).push(e);
  return acc;
}, {});

/** 서울 기준 오늘 'YYYY-MM-DD' — 서버(UTC)와 어긋나지 않게 마운트 후에만 계산한다 */
function todayInSeoul() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
}

const noopSubscribe = () => () => {};

const monthLabel = (ym: string) => `${ym.slice(0, 4)}년 ${Number(ym.slice(5, 7))}월`;
const dayLabel = (iso: string, weekday: number) => `${Number(iso.slice(5, 7))}월 ${Number(iso.slice(8, 10))}일 ${WEEKDAYS[weekday]}요일`;
const weekdayOf = (iso: string) => new Date(`${iso}T00:00:00Z`).getUTCDay();

/**
 * 공개 교육 일정 — 월 그리드(넓은 화면 = 과정 칩, 좁은 화면 = 점) + 아래 날짜별 목록.
 * 날짜를 누르면 목록의 그 날로 이동한다. 지난 일정은 흐리게. 데이터는 schedule.ts(마스킹 완료).
 */
export function CalendarView() {
  const months = SCHEDULE_MONTHS as readonly string[];
  // 오늘은 서버(UTC 빌드 시각)와 다를 수 있다 → 서버 스냅샷은 null, 브라우저에서만 서울 날짜를 읽는다
  const today = React.useSyncExternalStore(noopSubscribe, todayInSeoul, () => null);
  const [picked, setPicked] = React.useState<string | null>(null);
  const month = picked ?? (today ? initialMonth(today, months) : months[0]);
  const [selected, setSelected] = React.useState<string | null>(null);

  const index = months.indexOf(month);
  const weeks = monthMatrix(month);
  const stats = monthStats(EVENTS, month);
  const monthDays = Object.keys(BY_DATE).filter((d) => d.startsWith(`${month}-`)).sort();

  const go = (delta: number) => {
    const next = months[index + delta];
    if (next) {
      setPicked(next);
      setSelected(null);
    }
  };

  const pick = (iso: string) => {
    setSelected(iso);
    document.getElementById(`day-${iso}`)?.scrollIntoView({ block: 'start' });
  };

  return (
    <div className="flex flex-col gap-10">
      {/* 월 이동 + 요약 */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" aria-label="이전 달" disabled={index <= 0} onClick={() => go(-1)}>
            <ChevronLeft aria-hidden="true" />
          </Button>
          <h2 aria-live="polite" className="min-w-[8ch] text-center text-h2 font-bold text-fg-default">
            {monthLabel(month)}
          </h2>
          <Button variant="ghost" size="icon" aria-label="다음 달" disabled={index >= months.length - 1} onClick={() => go(1)}>
            <ChevronRight aria-hidden="true" />
          </Button>
        </div>
        <p data-slot="month-stats" className="font-mono text-label tabular-nums text-fg-muted">
          {stats.days}일 · {stats.sessions}회 · {stats.courses}과정
        </p>
      </div>

      {/* 월 그리드 */}
      <div role="grid" aria-label={`${monthLabel(month)} 교육 일정`} className="overflow-hidden rounded-lg border border-border-default">
        <div role="row" className="grid grid-cols-7 border-b border-border-default bg-bg-subtle">
          {WEEKDAYS.map((w, i) => (
            <div
              key={w}
              role="columnheader"
              className={cn('py-2 text-center text-caption font-bold', i === 0 ? 'text-danger-default' : i === 6 ? 'text-accent-default' : 'text-fg-muted')}
            >
              {w}
            </div>
          ))}
        </div>
        {weeks.map((week) => (
          <div key={week[0].iso} role="row" className="grid grid-cols-7 border-b border-border-default last:border-b-0">
            {week.map((d) => {
              const events = d.inMonth ? (BY_DATE[d.iso] ?? []) : [];
              const isToday = d.iso === today;
              const past = today != null && d.iso < today;
              return (
                <div
                  key={d.iso}
                  role="gridcell"
                  aria-selected={selected === d.iso}
                  className={cn('min-w-0 border-r border-border-default last:border-r-0', d.inMonth ? 'bg-bg-default' : 'bg-bg-subtle')}
                >
                  <button
                    type="button"
                    data-day={d.iso}
                    disabled={!events.length}
                    aria-label={`${dayLabel(d.iso, d.weekday)}${events.length ? `, 교육 ${events.length}건` : ''}`}
                    onClick={() => pick(d.iso)}
                    className={cn(
                      'focus-ring flex h-14 w-full flex-col items-start gap-1 p-1.5 text-left medium:h-24 medium:p-2',
                      'transition-colors duration-[var(--bs-motion-control)] ease-bs',
                      events.length && 'cursor-pointer hover-fine:bg-bg-subtle',
                      selected === d.iso && 'bg-accent-subtle-bg',
                    )}
                  >
                    <span
                      className={cn(
                        'inline-flex size-6 items-center justify-center rounded-full text-caption tabular-nums',
                        !d.inMonth ? 'text-fg-subtle' : past ? 'text-fg-muted' : 'text-fg-body',
                        isToday && 'bg-accent-default font-bold text-accent-fg-on',
                      )}
                    >
                      {d.day}
                    </span>
                    {/* 좁은 화면: 점 */}
                    {events.length > 0 && (
                      <span aria-hidden="true" className={cn('flex gap-1 medium:hidden', past && 'opacity-50')}>
                        {events.slice(0, 3).map((e) => (
                          <span key={e.key} className="size-1.5 rounded-full bg-accent-default" />
                        ))}
                      </span>
                    )}
                    {/* 넓은 화면: 과정 칩 (2개 + N) */}
                    <span aria-hidden="true" className={cn('hidden w-full min-w-0 flex-col gap-1 medium:flex', past && 'opacity-50')}>
                      {events.slice(0, 2).map((e) => (
                        <span key={e.key} className="truncate rounded-sm bg-accent-subtle-bg px-1.5 py-0.5 text-caption font-semibold text-accent-fg-strong">
                          {e.course.title}
                        </span>
                      ))}
                      {events.length > 2 && <span className="text-caption text-fg-muted">+{events.length - 2}</span>}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* 날짜별 목록 */}
      <ol aria-label={`${monthLabel(month)} 일정 목록`} className="flex flex-col border-t border-border-default">
        {monthDays.map((iso) => {
          const past = today != null && iso < today;
          return (
            <li
              key={iso}
              id={`day-${iso}`}
              data-day-group={iso}
              className={cn(
                'grid scroll-mt-28 list-none gap-x-8 gap-y-3 border-b border-border-default py-6 medium:grid-cols-[152px_minmax(0,1fr)]',
                selected === iso && 'bg-accent-subtle-bg/40',
                past && 'opacity-70',
              )}
            >
              <p className="flex items-baseline gap-2 font-mono text-label tabular-nums text-fg-link">
                {dayLabel(iso, weekdayOf(iso))}
                {iso === today && <span className="font-sans text-caption font-bold text-accent-default">오늘</span>}
              </p>
              <ul className="flex min-w-0 flex-col gap-5">
                {BY_DATE[iso].map((e) => (
                  <li key={e.key} data-event={e.courseId} className="flex min-w-0 list-none flex-col gap-1.5">
                    <span className="font-mono text-caption tabular-nums text-fg-muted">
                      {e.time.start} – {e.time.end}
                    </span>
                    <h3 className="text-h3 font-bold text-fg-default">{e.course.title}</h3>
                    <MetaLabel parts={[e.course.org ?? e.course.industry, e.course.target, e.course.tool]} />
                    <p className="text-body text-fg-body">{e.course.summary}</p>
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

