import { describe, expect, it } from 'vitest';

import { introTokens } from './intro';

describe('introTokens', () => {
  const segs = [
    { text: '프론트엔드 개발 3년 차' },
    { chip: 'code', label: '코드' },
    { text: '지금은 실습을' },
    { text: '지도해요', em: true },
  ] as const;

  it('텍스트는 단어로 쪼개고 칩은 한 토큰 — 순서와 index 를 이어서 매긴다', () => {
    const { tokens, count } = introTokens(segs);
    expect(count).toBe(8);
    expect(tokens.map((t) => t.index)).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
    expect(tokens[4]).toMatchObject({ kind: 'chip', chip: 'code', label: '코드' });
    expect(tokens.filter((t) => t.kind === 'word').map((t) => t.text)).toEqual(['프론트엔드', '개발', '3년', '차', '지금은', '실습을', '지도해요']);
  });

  it('em 표시는 해당 세그먼트의 단어에만 붙는다', () => {
    const { tokens } = introTokens(segs);
    expect(tokens.filter((t) => t.kind === 'word' && t.em).map((t) => (t.kind === 'word' ? t.text : ''))).toEqual(['지도해요']);
  });

  it('빈 텍스트 · 여분 공백은 단어를 만들지 않는다', () => {
    expect(introTokens([{ text: '  ' }, { text: ' a  b ' }]).count).toBe(2);
  });
});
