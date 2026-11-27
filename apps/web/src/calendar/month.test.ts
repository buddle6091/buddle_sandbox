import { describe, expect, it } from 'vitest';

import { expandSchedule, initialMonth, monthMatrix, monthStats, type Course } from './month';

describe('monthMatrix', () => {
  it('2026년 11월 — 일요일 시작 5주, 앞뒤는 이웃 달 날짜로 채운다', () => {
    const weeks = monthMatrix('2026-11');
    expect(weeks).toHaveLength(5);
    expect(weeks[0][0]).toEqual({ iso: '2026-11-01', day: 1, inMonth: true, weekday: 0 });
    expect(weeks.flat().filter((d) => d.inMonth)).toHaveLength(30);
    expect(weeks.at(-1)!.at(-1)).toMatchObject({ iso: '2026-12-05', inMonth: false });
  });

  it('2026년 12월 — 1일이 화요일이라 앞 두 칸은 11월 29·30일', () => {
    const weeks = monthMatrix('2026-12');
    expect(weeks[0].slice(0, 3).map((d) => d.iso)).toEqual(['2026-11-29', '2026-11-30', '2026-12-01']);
    expect(weeks.flat().filter((d) => d.inMonth)).toHaveLength(31);
    for (const w of weeks) expect(w).toHaveLength(7);
  });

  it('잘못된 월 문자열은 빈 배열', () => {
    expect(monthMatrix('2026-13')).toEqual([]);
    expect(monthMatrix('nope')).toEqual([]);
  });
});

const courses: Course[] = [
  { id: 'a', title: 'A 과정', summary: 's', time: { start: '09:00', end: '18:00' }, sessions: [{ date: '2026-11-03' }, { date: '2026-11-01', time: { start: '08:00', end: '12:00' } }] },
  { id: 'b', title: 'B 과정', summary: 's', time: { start: '08:30', end: '17:30' }, sessions: [{ date: '2026-11-03' }, { date: '2026-12-01' }] },
];

describe('expandSchedule', () => {
  it('회차를 날짜별 일정으로 펼치고 날짜 → 시작 시각 순으로 정렬, 회차 시간이 있으면 그걸 쓴다', () => {
    const ev = expandSchedule(courses);
    expect(ev.map((e) => `${e.date} ${e.time.start} ${e.courseId}`)).toEqual([
      '2026-11-01 08:00 a',
      '2026-11-03 08:30 b',
      '2026-11-03 09:00 a',
      '2026-12-01 08:30 b',
    ]);
  });
});

describe('monthStats', () => {
  it('그 달의 일정 수 · 교육 일수 · 과정 수', () => {
    const ev = expandSchedule(courses);
    expect(monthStats(ev, '2026-11')).toEqual({ sessions: 3, days: 2, courses: 2 });
    expect(monthStats(ev, '2026-12')).toEqual({ sessions: 1, days: 1, courses: 1 });
    expect(monthStats(ev, '2027-01')).toEqual({ sessions: 0, days: 0, courses: 0 });
  });
});

describe('initialMonth', () => {
  const months = ['2026-11', '2026-12'];
  it('오늘이 속한 달이 목록에 있으면 그 달', () => {
    expect(initialMonth('2026-12-05', months)).toBe('2026-12');
  });
  it('목록보다 이전이면 첫 달, 이후면 마지막 달', () => {
    expect(initialMonth('2026-10-20', months)).toBe('2026-11');
    expect(initialMonth('2027-02-01', months)).toBe('2026-12');
  });
});
