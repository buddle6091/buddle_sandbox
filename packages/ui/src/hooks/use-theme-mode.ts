'use client';

import * as React from 'react';

/**
 * 테마 모드 — 토큰 레이어의 세 갈래(시스템 / html[data-theme="dark"] / html[data-theme="light"])를 그대로 쓴다.
 * 저장은 localStorage['bs-theme'] (light|dark, system 이면 없음). next-themes 는 쓰지 않는다(Phase 1 결정).
 * FOUC 방지는 앱 layout 의 <head> 인라인 스크립트가 같은 키를 먼저 읽어 data-theme 을 적용한다.
 */
export const THEME_STORAGE_KEY = 'bs-theme';
export type ThemePreference = 'system' | 'light' | 'dark';
export type ResolvedTheme = 'light' | 'dark';

const DARK_QUERY = '(prefers-color-scheme: dark)';
const listeners = new Set<() => void>();
const emit = () => {
  for (const l of listeners) l();
};

function readPreference(): ThemePreference {
  try {
    const v = window.localStorage.getItem(THEME_STORAGE_KEY);
    return v === 'light' || v === 'dark' ? v : 'system';
  } catch {
    return 'system';
  }
}

function readSystemDark(): boolean {
  return typeof window !== 'undefined' && !!window.matchMedia?.(DARK_QUERY).matches;
}

/** html[data-theme] 를 즉시 반영한다 — 토큰 CSS 가 이 속성으로 모드를 가른다. */
export function applyThemeAttribute(pref: ThemePreference) {
  const root = document.documentElement;
  if (pref === 'system') delete root.dataset.theme;
  else root.dataset.theme = pref;
}

export function setThemePreference(pref: ThemePreference) {
  try {
    if (pref === 'system') window.localStorage.removeItem(THEME_STORAGE_KEY);
    else window.localStorage.setItem(THEME_STORAGE_KEY, pref);
  } catch {
    /* 저장 불가(프라이빗 모드 등) — 속성만 적용 */
  }
  applyThemeAttribute(pref);
  emit();
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  const mql = window.matchMedia(DARK_QUERY);
  const onSystem = () => onChange();
  const onStorage = (e: StorageEvent) => {
    if (e.key === THEME_STORAGE_KEY || e.key === null) {
      applyThemeAttribute(readPreference());
      onChange();
    }
  };
  mql.addEventListener('change', onSystem);
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(onChange);
    mql.removeEventListener('change', onSystem);
    window.removeEventListener('storage', onStorage);
  };
}

export function useThemeMode() {
  const preference = React.useSyncExternalStore<ThemePreference>(subscribe, readPreference, () => 'system');
  const systemDark = React.useSyncExternalStore<boolean>(subscribe, readSystemDark, () => false);

  // 마운트 시 저장값을 속성에 반영(head 스크립트가 없는 환경 대비). setState 없음.
  React.useEffect(() => {
    applyThemeAttribute(readPreference());
  }, []);

  const resolved: ResolvedTheme = preference === 'system' ? (systemDark ? 'dark' : 'light') : preference;
  return { preference, resolved, set: setThemePreference };
}
