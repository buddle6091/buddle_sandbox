import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { expandSchedule, monthStats } from './month';
import { SCHEDULE, SCHEDULE_MONTHS } from './schedule';

/**
 * 공개 저장소 · 공개 페이지 — 기업 고객사 실명과 그 단서가 새지 않는다.
 * 실명 · 사업부명 · 사옥 · 교육장 같은 "금지 단어" 목록 자체가 고객사 정보라 저장소에 두지 않는다:
 * 로컬 전용 `leaks.local.json`(gitignore, 문자열 배열)이 있으면 그 단어까지 검사하고, 없으면(CI) 일반 규칙만 본다.
 */
const LOCAL_LEAKS = join(__dirname, 'leaks.local.json');
const PRIVATE_WORDS: string[] = existsSync(LOCAL_LEAKS) ? JSON.parse(readFileSync(LOCAL_LEAKS, 'utf8')) : [];
/** 저장소에 적어도 되는 일반 규칙 — 캘린더 원본 표기 습관([고객사] 접두) · 정산 메모 · 시범 강의 */
const GENERIC_LEAKS = ['[', ']', '시급', '정산', '출근', '시범 강의'];

/** apps/web/CLAUDE.md 규칙 5 — 메인 강사 단독으로 읽히는 표현 금지 */
const FORBIDDEN_ROLE = ['가르칩니다', '강의했습니다', '담당', '출강'];

describe('SCHEDULE (2026-11 ~ 12, 마스킹 후 공개 데이터)', () => {
  // 화면에 나가는 문자열 필드만 이어 붙인다(JSON 문법의 [ ] 가 섞이지 않게)
  const text = SCHEDULE.map((c) => [c.title, c.summary, c.industry, c.target, c.org, c.tool].filter(Boolean).join('\n')).join('\n');

  it('원본 표기 습관([고객사] 접두) · 정산 메모가 없다', () => {
    for (const w of GENERIC_LEAKS) expect(text, w).not.toContain(w);
  });

  it.skipIf(PRIVATE_WORDS.length === 0)('로컬 금지 단어(고객사 실명 · 단서)가 하나도 없다', () => {
    for (const w of PRIVATE_WORDS) expect(text, w).not.toContain(w);
  });

  it('메인 강사 단독으로 읽히는 표현이 없다', () => {
    for (const w of FORBIDDEN_ROLE) expect(text, w).not.toContain(w);
  });

  it('장소는 싣지 않는다(주소 · 사옥으로 고객사가 드러난다)', () => {
    for (const c of SCHEDULE) expect(c).not.toHaveProperty('location');
  });

  it('실명은 학교 · 공공기관만(org), 기업은 업종(industry)으로만', () => {
    const orgs = SCHEDULE.flatMap((c) => (c.org ? [c.org] : []));
    expect(orgs).toEqual(['평택대학교']);
  });

  it('원본 캘린더 34회차(11월 16 · 12월 18)가 그대로 옮겨졌다 — 강의가 아닌 일정 1건 제외', () => {
    const ev = expandSchedule(SCHEDULE);
    expect(ev).toHaveLength(34);
    expect(monthStats(ev, '2026-11').sessions).toBe(16);
    expect(monthStats(ev, '2026-12').sessions).toBe(18);
    expect(SCHEDULE_MONTHS).toEqual(['2026-11', '2026-12']);
  });

  it('보직장 과정 이름은 사용자가 정한 표기', () => {
    expect(SCHEDULE.map((c) => c.title)).toContain('보직장 멀티 에이전트 교육 (Claude Code)');
  });
});
