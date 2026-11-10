import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { CommandDialog, filterCommands, groupCommands, type CommandItem } from './command';
import { expectTokenOnly } from '../test-utils/class-rules';

const ITEMS: CommandItem[] = [
  { id: 'home', label: '소개', group: '페이지', hint: '/' },
  { id: 'blog', label: '블로그', group: '페이지', keywords: 'blog post' },
  { id: 'teaching', label: '강의 이력', group: '이 페이지에서' },
  { id: 'dark', label: '다크 모드', group: '테마', keywords: 'dark theme' },
  { id: 'contact', label: '문의', group: '이 페이지에서' },
];

describe('filterCommands — 공백 · 대소문자 무시 부분 문자열, 낱말 AND', () => {
  it('빈 질의는 전체(복사본)', () => {
    const out = filterCommands(ITEMS, '   ');
    expect(out).toEqual(ITEMS);
    expect(out).not.toBe(ITEMS);
  });
  it('라벨 · 그룹 · keywords 에서 찾는다', () => {
    expect(filterCommands(ITEMS, '강의').map((i) => i.id)).toEqual(['teaching']);
    expect(filterCommands(ITEMS, 'BLOG').map((i) => i.id)).toEqual(['blog']);
    expect(filterCommands(ITEMS, '테마').map((i) => i.id)).toEqual(['dark']);
    expect(filterCommands(ITEMS, '강의이력').map((i) => i.id)).toEqual(['teaching']);
  });
  it('낱말 여러 개는 전부 포함해야 한다', () => {
    expect(filterCommands(ITEMS, '페이지 블로그').map((i) => i.id)).toEqual(['blog']);
    expect(filterCommands(ITEMS, '페이지 다크')).toEqual([]);
  });
});

describe('groupCommands — 처음 나온 순서로 묶는다', () => {
  it('떨어져 있어도 같은 그룹으로', () => {
    const g = groupCommands(ITEMS);
    expect(g.map((x) => x.group)).toEqual(['페이지', '이 페이지에서', '테마']);
    expect(g[1].items.map((i) => i.id)).toEqual(['teaching', 'contact']);
  });
});

function setup(props: Partial<React.ComponentProps<typeof CommandDialog>> = {}) {
  const onSelect = vi.fn();
  const onOpenChange = vi.fn();
  render(<CommandDialog open onOpenChange={onOpenChange} items={ITEMS} onSelect={onSelect} {...props} />);
  const input = screen.getByRole('combobox');
  const list = screen.getByRole('listbox');
  return { onSelect, onOpenChange, input, list };
}
const selectedId = (list: HTMLElement) => within(list).getAllByRole('option').find((o) => o.getAttribute('aria-selected') === 'true');

describe('CommandDialog — combobox + listbox', () => {
  it('닫혀 있으면 아무것도 그리지 않는다', () => {
    render(<CommandDialog open={false} onOpenChange={() => undefined} items={ITEMS} onSelect={() => undefined} />);
    expect(screen.queryByRole('combobox')).toBeNull();
  });

  it('접근성 뼈대 — dialog 이름, combobox 가 listbox 를 가리키고 첫 항목이 활성', () => {
    const { input, list } = setup();
    expect(screen.getByRole('dialog', { name: '명령 팔레트' })).toBeInTheDocument();
    expect(input).toHaveAttribute('aria-controls', list.id);
    expect(input).toHaveFocus();
    const options = within(list).getAllByRole('option');
    // 그룹 순으로 편 순서: 페이지(소개 · 블로그) → 이 페이지에서(강의 이력 · 문의) → 테마
    expect(options.map((o) => o.textContent)).toEqual(['소개/', '블로그', '강의 이력', '문의', '다크 모드']);
    expect(input).toHaveAttribute('aria-activedescendant', options[0].id);
    expect(options[0]).toHaveAttribute('aria-selected', 'true');
    expect(within(list).getAllByRole('group')).toHaveLength(3);
    expect(within(list).getByRole('group', { name: '이 페이지에서' })).toBeInTheDocument();
  });

  it('↓/↑ 로 이동하고 끝에서 순환, Home/End', () => {
    const { input, list } = setup();
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(selectedId(list)).toHaveTextContent('블로그');
    fireEvent.keyDown(input, { key: 'ArrowUp' });
    fireEvent.keyDown(input, { key: 'ArrowUp' });
    expect(selectedId(list)).toHaveTextContent('다크 모드');
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(selectedId(list)).toHaveTextContent('소개');
    fireEvent.keyDown(input, { key: 'End' });
    expect(selectedId(list)).toHaveTextContent('다크 모드');
    fireEvent.keyDown(input, { key: 'Home' });
    expect(selectedId(list)).toHaveTextContent('소개');
  });

  it('입력하면 걸러지고 활성은 첫 항목으로, Enter 로 실행 후 닫힌다', () => {
    const { input, list, onSelect, onOpenChange } = setup();
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.change(input, { target: { value: '강의' } });
    const options = within(list).getAllByRole('option');
    expect(options).toHaveLength(1);
    expect(options[0]).toHaveAttribute('aria-selected', 'true');
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 'teaching' }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('한글 조합 중 Enter 는 실행하지 않는다', () => {
    const { input, onSelect } = setup();
    fireEvent.keyDown(input, { key: 'Enter', isComposing: true });
    // Safari — 조합 확정 Enter 가 isComposing=false · keyCode 229 로 온다
    fireEvent.keyDown(input, { key: 'Enter', keyCode: 229 });
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('항목 클릭으로 실행, 포인터를 올리면 활성', () => {
    const { list, onSelect } = setup();
    const contact = within(list).getByRole('option', { name: '문의' });
    fireEvent.pointerMove(contact);
    expect(contact).toHaveAttribute('aria-selected', 'true');
    fireEvent.click(contact);
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 'contact' }));
  });

  it('결과가 없으면 안내 문구, Enter 는 아무것도 하지 않는다', () => {
    const { input, list, onSelect } = setup();
    fireEvent.change(input, { target: { value: 'zzz' } });
    expect(within(list).queryAllByRole('option')).toHaveLength(0);
    expect(screen.getByRole('status')).toHaveTextContent('맞는 항목이 없어요');
    expect(input).not.toHaveAttribute('aria-activedescendant');
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('열린 채 items 가 줄어도 활성 항목이 남는다(범위 안으로)', () => {
    const { rerender } = render(<CommandDialog open onOpenChange={() => undefined} items={ITEMS} onSelect={() => undefined} />);
    const input = screen.getByRole('combobox');
    fireEvent.keyDown(input, { key: 'End' });
    rerender(<CommandDialog open onOpenChange={() => undefined} items={ITEMS.slice(0, 2)} onSelect={() => undefined} />);
    const options = within(screen.getByRole('listbox')).getAllByRole('option');
    expect(options).toHaveLength(2);
    expect(options[1]).toHaveAttribute('aria-selected', 'true');
  });

  it('토큰 유틸리티만 쓴다', () => {
    const { list } = setup();
    expectTokenOnly(document.querySelector('[data-slot="command-dialog"]')!.className);
    for (const o of within(list).getAllByRole('option')) expectTokenOnly(o.className);
  });
});
