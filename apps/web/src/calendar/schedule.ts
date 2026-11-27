import type { Course } from './month';

/**
 * 공개 교육 일정 — 2026년 11 ~ 12월 (Google 캘린더 「lecture schedule」에서 2026-11-27 옮김).
 *
 * 마스킹 규칙 (apps/web/CLAUDE.md 규칙 5, 랜딩 강의 이력과 같은 기준)
 * - 기업 고객사: 실명 · 사업부명 · 프로그램 고유명 대신 업종(industry) · 대상(target) · 일반화한 교육명.
 * - 학교 · 지자체 · 공공기관: 실명(org).
 * - 장소(주소 · 사옥 · 교육장)와 캘린더 메모(정산 · 출근 시각 등)는 싣지 않는다.
 * - 강의 일정이 아닌 일정(시범 강의 · 면접 등)은 뺀다.
 * 원본 → 공개 표기 매핑은 이 저장소에 두지 않는다(공개 저장소). 고칠 때는 원본 캘린더에서 다시 옮긴다.
 *
 * 역할: 멘토링을 제외한 과정은 기술 강사(실습 지도)로 참여 — 화면 상단 안내문이 이 사실을 말한다.
 */
const dates = (...d: string[]) => d.map((date) => ({ date }));

export const SCHEDULE: Course[] = [
  {
    id: 'lead-multi-agent',
    title: '보직장 멀티 에이전트 교육 (Claude Code)',
    summary: 'Claude Code로 여러 에이전트에게 일을 나눠 맡기고 결과를 조율하는 멀티 에이전트 워크플로를 실습합니다.',
    industry: '전자/반도체',
    target: '보직장',
    tool: 'Claude Code',
    time: { start: '08:30', end: '17:30' },
    sessions: dates(
      '2026-11-02', '2026-11-04', '2026-11-06', '2026-11-09', '2026-11-11', '2026-11-13',
      '2026-11-16', '2026-11-18', '2026-11-20', '2026-11-23', '2026-11-25',
      '2026-12-02', '2026-12-04', '2026-12-07', '2026-12-09', '2026-12-11', '2026-12-23',
    ),
  },
  {
    id: 'exec-ai',
    title: '임원 AI 교육',
    summary: '생성형 AI를 업무에 바로 써 볼 수 있도록 사례를 살펴보고 직접 다뤄 보는 임원 대상 실습형 교육입니다.',
    industry: '식품',
    target: '임원',
    time: { start: '09:00', end: '17:00' },
    sessions: dates('2026-11-03'),
  },
  {
    id: 'agent-advanced',
    title: 'Claude Code AI Agent 심화 과정',
    summary: 'Claude Code로 AI Agent를 설계하고 구현하는 심화 과정에서 실습을 지도합니다.',
    industry: '건설·상사',
    tool: 'Claude Code',
    time: { start: '09:00', end: '12:00' },
    sessions: [{ date: '2026-11-12', time: { start: '08:00', end: '12:00' } }, { date: '2026-11-19' }],
  },
  {
    id: 'semiconductor-quality-viz',
    title: '반도체 품질 데이터 분석 · 시각화 바이브코딩 교육',
    summary: '반도체 품질 데이터를 바이브코딩으로 분석하고 시각화해 보는 실습 교육입니다.',
    org: '평택대학교',
    time: { start: '09:00', end: '18:00' },
    sessions: dates('2026-11-26'),
  },
  {
    id: 'staff-ai',
    title: '임직원 AI 활용 교육',
    summary: '업무에 생성형 AI를 활용하는 방법을 실습 중심으로 다루는 임직원 교육입니다.',
    industry: '전자/반도체',
    target: '임직원',
    time: { start: '08:30', end: '17:30' },
    sessions: dates('2026-11-27'),
  },
  {
    id: 'agent-design',
    title: 'AI Agent 설계 과정',
    summary: 'AI Agent의 구조와 설계 방법을 익히고, 직접 에이전트를 만들어 보는 과정입니다.',
    industry: '전자/반도체',
    time: { start: '09:00', end: '18:00' },
    sessions: dates(
      '2026-12-01', '2026-12-03', '2026-12-08', '2026-12-10', '2026-12-15', '2026-12-17',
      '2026-12-22', '2026-12-24', '2026-12-28', '2026-12-29', '2026-12-30', '2026-12-31',
    ),
  },
];

/** 일정이 있는 달 — 화면의 이전/다음 이동 범위 */
export const SCHEDULE_MONTHS = ['2026-11', '2026-12'] as const;

export const CALENDAR_COPY = {
  title: '교육 일정',
  lead: '기업 · 기관 AI 교육 현장에 참여하는 일정이에요. 기업 고객사는 업종과 대상으로만 적었습니다.',
  roleNote: '멘토링을 제외한 과정은 기술 강사(실습 지도)로 참여합니다.',
  empty: '이 날은 교육 일정이 없어요.',
  contact: '교육 문의',
} as const;
