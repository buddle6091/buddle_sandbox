import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { CommandPalette } from './command-palette';

const push = vi.fn();
let pathname = '/';
vi.mock('next/navigation', () => ({
  usePathname: () => pathname,
  useRouter: () => ({ push }),
}));
const toast = vi.fn();
vi.mock('@sandbox/ui/components/toast', () => ({ toast: (...a: unknown[]) => toast(...a) }));

beforeEach(() => {
  pathname = '/';
  push.mockClear();
  toast.mockClear();
  window.localStorage.clear();
  delete document.documentElement.dataset.theme;
});
afterEach(() => vi.restoreAllMocks());

const open = () => fireEvent.click(screen.getByRole('button', { name: '명령 팔레트 열기' }));
const pick = (name: string | RegExp) => fireEvent.click(within(screen.getByRole('listbox')).getByRole('option', { name }));

describe('CommandPalette — ⌘K 조립부', () => {
  it('⌘K · Ctrl+K 로 열고 다시 누르면 닫힌다, 트리거 버튼으로도 열린다', async () => {
    render(<CommandPalette />);
    expect(screen.queryByRole('combobox')).toBeNull();
    fireEvent.keyDown(window, { key: 'k', metaKey: true });
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });
    await waitFor(() => expect(screen.queryByRole('combobox')).toBeNull());
    open();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('페이지 항목 → router.push', () => {
    render(<CommandPalette />);
    open();
    pick(/블로그/);
    expect(push).toHaveBeenCalledWith('/blog');
  });

  it('랜딩에서 섹션 항목 → 그 요소로 scrollIntoView (라우터 이동 없음)', async () => {
    const target = document.createElement('section');
    target.id = 'teaching';
    target.scrollIntoView = vi.fn();
    document.body.appendChild(target);
    render(<CommandPalette />);
    open();
    pick('교육 이력');
    await waitFor(() => expect(target.scrollIntoView).toHaveBeenCalled());
    expect(push).not.toHaveBeenCalled();
    target.remove();
  });

  it('다른 라우트에서 섹션 항목 → `/#id` 로 이동', () => {
    pathname = '/blog';
    render(<CommandPalette />);
    open();
    pick('교육 이력');
    expect(push).toHaveBeenCalledWith('/#teaching');
  });

  it('테마 항목 → html[data-theme] 과 저장값이 바뀐다, 시스템은 속성을 지운다', () => {
    render(<CommandPalette />);
    open();
    pick('다크 모드');
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(window.localStorage.getItem('bs-theme')).toBe('dark');
    open();
    pick('시스템 설정 따르기');
    expect(document.documentElement.dataset.theme).toBeUndefined();
    expect(window.localStorage.getItem('bs-theme')).toBeNull();
  });

  it('이메일 복사 → 클립보드 + 토스트, 실패하면 mailto', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    render(<CommandPalette />);
    open();
    pick(/이메일 주소 복사/);
    await waitFor(() => expect(toast).toHaveBeenCalledWith('이메일을 복사했어요'));
    expect(writeText).toHaveBeenCalledWith('sangwon.lee@buddle.it.kr');

    writeText.mockRejectedValueOnce(new Error('denied'));
    const assign = vi.fn();
    const original = window.location;
    Object.defineProperty(window, 'location', { value: { ...original, assign }, configurable: true });
    open();
    pick(/이메일 주소 복사/);
    await waitFor(() => expect(assign).toHaveBeenCalledWith('mailto:sangwon.lee@buddle.it.kr'));
    Object.defineProperty(window, 'location', { value: original, configurable: true });
  });

  it('외부 링크 → 새 탭(noopener)', () => {
    const openSpy = vi.spyOn(window, 'open').mockReturnValue(null);
    render(<CommandPalette />);
    open();
    pick('GitHub');
    expect(openSpy).toHaveBeenCalledWith('https://github.com/buddle6091', '_blank', 'noopener,noreferrer');
  });
});
