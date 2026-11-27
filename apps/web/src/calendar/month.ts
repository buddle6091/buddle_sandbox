/**
 * 캘린더 계산 — 순수 함수(날짜는 'YYYY-MM-DD' 문자열, 시간대 계산 없음).
 * 일정 데이터는 schedule.ts, 화면은 calendar-view.tsx.
 */
export type TimeRange = { start: string; end: string };
export type Session = { date: string; time?: TimeRange };
export type Course = {
  id: string;
  /** 공개 표기 — 기업명 대신 일반화한 교육명 */
  title: string;
  /** 교육 내용 한두 문장 */
  summary: string;
  /** 기업 고객사는 업종으로만 */
  industry?: string;
  target?: string;
  /** 실명은 학교 · 지자체 · 공공기관만 */
  org?: string;
  tool?: string;
  time: TimeRange;
  sessions: Session[];
};
export type ScheduleEvent = {
  key: string;
  date: string;
  time: TimeRange;
  courseId: string;
  course: Course;
};
export type CalendarDay = { iso: string; day: number; inMonth: boolean; weekday: number };

const pad = (n: number) => String(n).padStart(2, '0');
const toIso = (d: Date) => `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;

/** 'YYYY-MM' → 일요일 시작 주 단위 배열(앞뒤는 이웃 달로 채움). 잘못된 입력은 [] */
export function monthMatrix(ym: string): CalendarDay[][] {
  const m = /^(\d{4})-(\d{2})$/.exec(ym);
  if (!m) return [];
  const year = Number(m[1]);
  const month = Number(m[2]) - 1;
  if (month < 0 || month > 11) return [];
  const first = new Date(Date.UTC(year, month, 1));
  const start = new Date(first);
  start.setUTCDate(1 - first.getUTCDay());
  const weeks: CalendarDay[][] = [];
  const cursor = new Date(start);
  do {
    const week: CalendarDay[] = [];
    for (let i = 0; i < 7; i++) {
      week.push({ iso: toIso(cursor), day: cursor.getUTCDate(), inMonth: cursor.getUTCMonth() === month, weekday: i });
      cursor.setUTCDate(cursor.getUTCDate() + 1);
    }
    weeks.push(week);
  } while (cursor.getUTCMonth() === month);
  return weeks;
}

/** 과정의 회차를 날짜별 일정으로 펼친다 — 날짜, 시작 시각 순 */
export function expandSchedule(courses: readonly Course[]): ScheduleEvent[] {
  return courses
    .flatMap((course) =>
      course.sessions.map((s) => ({ key: `${course.id}-${s.date}`, date: s.date, time: s.time ?? course.time, courseId: course.id, course })),
    )
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.start.localeCompare(b.time.start));
}

/** 그 달의 일정 수 · 교육한 날 수 · 과정 수 */
export function monthStats(events: readonly ScheduleEvent[], ym: string) {
  const inMonth = events.filter((e) => e.date.startsWith(`${ym}-`));
  return {
    sessions: inMonth.length,
    days: new Set(inMonth.map((e) => e.date)).size,
    courses: new Set(inMonth.map((e) => e.courseId)).size,
  };
}

/** 처음 보여 줄 달 — 오늘이 속한 달, 범위 밖이면 가까운 끝 */
export function initialMonth(todayIso: string, months: readonly string[]) {
  const ym = todayIso.slice(0, 7);
  if (months.includes(ym)) return ym;
  return ym < months[0] ? months[0] : months[months.length - 1];
}
