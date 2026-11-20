import { describe, expect, it } from 'vitest';

import { LANDING, NAV_SECTIONS } from '../landing/content/landing';
import { isPaletteShortcut, paletteItems } from './palette-items';

describe('paletteItems — ⌘K 팔레트 항목', () => {
  it('라우트 3 · 섹션(NAV_SECTIONS) · 테마 3 · 이메일 복사 · 외부 링크, id 는 유일', () => {
    const items = paletteItems('/');
    const kinds = items.map((i) => i.action.kind);
    expect(kinds.filter((k) => k === 'route')).toHaveLength(3);
    expect(kinds.filter((k) => k === 'section')).toHaveLength(NAV_SECTIONS.length);
    expect(kinds.filter((k) => k === 'theme')).toHaveLength(3);
    expect(kinds.filter((k) => k === 'copy')).toHaveLength(1);
    expect(kinds.filter((k) => k === 'external')).toHaveLength(LANDING.contact.links.length);
    expect(new Set(items.map((i) => i.id)).size).toBe(items.length);
  });
  it('랜딩에서는 섹션이 `#id`(같은 페이지 앵커), 그룹 이름 "이 페이지에서"', () => {
    const s = paletteItems('/').filter((i) => i.action.kind === 'section');
    expect(s[0].group).toBe('이 페이지에서');
    expect(s.map((i) => (i.action.kind === 'section' ? i.action.href : ''))).toEqual(NAV_SECTIONS.map((n) => `#${n.id}`));
  });
  it('다른 라우트에서는 섹션이 `/#id`(랜딩으로 이동 후 앵커)', () => {
    const s = paletteItems('/blog').filter((i) => i.action.kind === 'section');
    expect(s[0].group).toBe('소개 페이지 섹션');
    expect(s.every((i) => i.action.kind === 'section' && i.action.href.startsWith('/#'))).toBe(true);
  });
  it('이메일 복사 항목은 content 의 주소를 쓴다', () => {
    const copy = paletteItems('/').find((i) => i.action.kind === 'copy')!;
    expect(copy.action).toEqual({ kind: 'copy', text: LANDING.contact.email });
  });
});

describe('isPaletteShortcut', () => {
  const k = (o: Partial<KeyboardEvent>) => ({ key: 'k', metaKey: false, ctrlKey: false, altKey: false, shiftKey: false, ...o });
  it('⌘K · Ctrl+K · 대문자 K', () => {
    expect(isPaletteShortcut(k({ metaKey: true }))).toBe(true);
    expect(isPaletteShortcut(k({ ctrlKey: true }))).toBe(true);
    expect(isPaletteShortcut(k({ key: 'K', metaKey: true }))).toBe(true);
  });
  it('보조키 없음 · 다른 키 · Shift/Alt 조합은 아니다', () => {
    expect(isPaletteShortcut(k({}))).toBe(false);
    expect(isPaletteShortcut(k({ key: 'j', metaKey: true }))).toBe(false);
    expect(isPaletteShortcut(k({ metaKey: true, shiftKey: true }))).toBe(false);
    expect(isPaletteShortcut(k({ ctrlKey: true, altKey: true }))).toBe(false);
  });
});
