import { describe, expect, it } from 'vitest';

import { metaLabel } from './meta';

describe('metaLabel', () => {
  it('값들을 가운뎃점으로 잇는다', () => {
    expect(metaLabel(['전자/반도체', '개발자', 'Claude Code'])).toBe('전자/반도체 · 개발자 · Claude Code');
  });
  it('빈 값 · 공백은 건너뛰고 앞뒤를 다듬는다', () => {
    expect(metaLabel([' 철강 ', '', undefined, '  ', '개발자'])).toBe('철강 · 개발자');
    expect(metaLabel([])).toBe('');
  });
});
