import { act, render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ThemeToggle } from './theme-toggle';
import { THEME_STORAGE_KEY, useThemeMode } from '../hooks/use-theme-mode';
import { expectTokenOnly } from '../test-utils/class-rules';

let systemDark = false;
let listeners: Array<(e: { matches: boolean }) => void> = [];

beforeEach(() => {
  systemDark = false;
  listeners = [];
  localStorage.clear();
  delete document.documentElement.dataset.theme;
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: query.includes('dark') ? systemDark : false,
    media: query,
    onchange: null,
    addEventListener: (_: string, cb: (e: { matches: boolean }) => void) => listeners.push(cb),
    removeEventListener: (_: string, cb: (e: { matches: boolean }) => void) => {
      listeners = listeners.filter((l) => l !== cb);
    },
    addListener: () => undefined,
    removeListener: () => undefined,
    dispatchEvent: () => false,
  }));
});
afterEach(() => vi.unstubAllGlobals());

describe('useThemeMode — html[data-theme] + localStorage(bs-theme), 기본 system', () => {
  it('저장값 없음 → preference system, resolved 는 시스템 값, data-theme 없음', () => {
    const { result } = renderHook(() => useThemeMode());
    expect(result.current.preference).toBe('system');
    expect(result.current.resolved).toBe('light');
    expect(document.documentElement.dataset.theme).toBeUndefined();
  });

  it('set("dark") → data-theme=dark + 저장; set("system") → 속성 제거 + 저장값 제거', () => {
    const { result } = renderHook(() => useThemeMode());
    act(() => result.current.set('dark'));
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
    expect(result.current.resolved).toBe('dark');
    act(() => result.current.set('system'));
    expect(document.documentElement.dataset.theme).toBeUndefined();
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBeNull();
  });

  it('저장값 light 가 있으면 시스템이 다크여도 light', () => {
    systemDark = true;
    localStorage.setItem(THEME_STORAGE_KEY, 'light');
    const { result } = renderHook(() => useThemeMode());
    expect(result.current.preference).toBe('light');
    expect(result.current.resolved).toBe('light');
    expect(document.documentElement.dataset.theme).toBe('light');
  });

  it('system 일 때 시스템 변화를 따라간다', () => {
    const { result } = renderHook(() => useThemeMode());
    act(() => {
      systemDark = true;
      for (const l of listeners) l({ matches: true });
    });
    expect(result.current.resolved).toBe('dark');
  });

  it('잘못된 저장값은 system 으로 취급', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'neon');
    const { result } = renderHook(() => useThemeMode());
    expect(result.current.preference).toBe('system');
  });
});

describe('ThemeToggle — 44px 아이콘 버튼, 라벨이 다음 상태를 말한다', () => {
  it('라이트에서 "다크 모드로 전환", 누르면 다크 + 라벨 반전', async () => {
    render(<ThemeToggle />);
    const btn = screen.getByRole('button', { name: '다크 모드로 전환' });
    expect(btn).toHaveClass('size-11');
    expectTokenOnly(btn.className);
    await userEvent.click(btn);
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(screen.getByRole('button', { name: '라이트 모드로 전환' })).toBeInTheDocument();
  });

  it('system(다크) 에서 누르면 명시적 light 로', async () => {
    systemDark = true;
    render(<ThemeToggle />);
    await userEvent.click(screen.getByRole('button', { name: '라이트 모드로 전환' }));
    expect(document.documentElement.dataset.theme).toBe('light');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('light');
  });

  it('아이콘은 장식(aria-hidden), 버튼 이름은 라벨만', () => {
    render(<ThemeToggle />);
    const svg = screen.getByRole('button').querySelector('svg');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
  });
});
