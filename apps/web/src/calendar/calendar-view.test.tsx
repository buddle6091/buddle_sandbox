import { fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { CalendarView } from './calendar-view';

afterEach(() => vi.useRealTimers());

describe('CalendarView', () => {
  it('오늘(서울) 이 속한 달로 열리고, 오늘 칸과 목록에 "오늘" 표시', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-12-03T01:00:00Z')); // 서울 12월 3일 10시
    render(<CalendarView />);
    expect(await screen.findByRole('heading', { level: 2, name: '2026년 12월' })).toBeInTheDocument();
    expect(screen.getByText('18일 · 18회 · 2과정')).toBeInTheDocument();
    const group = document.getElementById('day-2026-12-03')!;
    expect(within(group).getByText('오늘')).toBeInTheDocument();
  });

  it('이전/다음 달 이동 — 범위 끝에서는 버튼이 꺼진다', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-11-27T01:00:00Z'));
    render(<CalendarView />);
    expect(await screen.findByRole('heading', { level: 2, name: '2026년 11월' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '이전 달' })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: '다음 달' }));
    expect(screen.getByRole('heading', { level: 2, name: '2026년 12월' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '다음 달' })).toBeDisabled();
  });

  it('날짜 칸은 일정이 있을 때만 누를 수 있고, 누르면 선택 표시 + 목록의 그 날로 이동', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-11-01T01:00:00Z'));
    const scroll = vi.fn();
    Element.prototype.scrollIntoView = scroll;
    render(<CalendarView />);
    await screen.findByRole('heading', { level: 2, name: '2026년 11월' });
    expect(screen.getByRole('button', { name: /11월 1일 일요일$/ })).toBeDisabled();
    const day = screen.getByRole('button', { name: '11월 3일 화요일, 교육 1건' });
    fireEvent.click(day);
    expect(day.closest('[role="gridcell"]')).toHaveAttribute('aria-selected', 'true');
    expect(scroll).toHaveBeenCalled();
  });

  it('목록 — 시간 · 과정명 · 메타 라벨 · 교육 내용, 기업은 업종으로만', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-11-01T01:00:00Z'));
    render(<CalendarView />);
    await screen.findByRole('heading', { level: 2, name: '2026년 11월' });
    const group = document.getElementById('day-2026-11-12')!;
    expect(within(group).getByText('08:00 – 12:00')).toBeInTheDocument();
    expect(within(group).getByRole('heading', { level: 3, name: 'Claude Code AI Agent 심화 과정' })).toBeInTheDocument();
    expect(within(group).getByText('건설·상사 · Claude Code')).toBeInTheDocument();
    expect(document.querySelectorAll('[data-day-group]')).toHaveLength(16);
  });
});
