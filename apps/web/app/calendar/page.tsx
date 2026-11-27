import type { Metadata } from 'next';

import { CalendarView } from '../../src/calendar/calendar-view';
import { CALENDAR_COPY } from '../../src/calendar/schedule';
import { LANDING } from '../../src/landing/content/landing';

export const metadata: Metadata = {
  title: '교육 일정',
  description: '기업 · 기관 AI 교육 참여 일정 (기업 고객사는 업종 · 대상으로만 표기)',
};

/**
 * 공개 교육 일정(2026-11-27~). 원래 스펙의 초대 로그인 게이트(docs/handoff/blog-calendar SCREENS D)는
 * Supabase 연동 때 상세(장소 등) 열람용으로 붙인다 — 지금 화면에는 마스킹된 공개 정보만 있다.
 */
export default function CalendarPage() {
  const c = CALENDAR_COPY;
  return (
    <div className="mx-auto flex w-full max-w-landing flex-col gap-10 px-4 pt-14 pb-24 medium:px-8 medium:pt-20">
      <header className="flex flex-col gap-4">
        <h1 className="text-h1 text-fg-default medium:text-display">{c.title}</h1>
        <p className="max-w-content text-body-lg text-fg-body">{c.lead}</p>
        <p className="max-w-content text-body font-semibold text-fg-body">{c.roleNote}</p>
      </header>
      <CalendarView />
      <a
        href={`mailto:${LANDING.contact.email}`}
        className="focus-ring group flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 rounded-sm border-y border-border-default py-5 text-h3 font-semibold text-fg-default"
      >
        <span className="underline-offset-4 group-hover-fine:underline">{c.contact}</span>
        <span className="font-mono text-label font-normal text-fg-muted">{LANDING.contact.email}</span>
      </a>
    </div>
  );
}
