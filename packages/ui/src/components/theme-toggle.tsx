'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';

import { cn } from '@sandbox/ui/lib/utils';
import { useThemeMode } from '../hooks/use-theme-mode';
import { Button } from './button';

/**
 * ThemeToggle — docs/handoff/landing-v2/README.md "다크 모드 / 테마 토글"
 * 44px 아이콘 버튼. 라벨은 "다음 상태"를 말한다(라이트에서 「다크 모드로 전환」).
 * 누르면 현재 resolved 의 반대를 명시 저장(system 은 떠난다). 아이콘은 장식(lucide 가 aria-hidden).
 */
function ThemeToggle({ className, ...props }: Omit<React.ComponentProps<typeof Button>, 'children' | 'onClick'>) {
  const { resolved, set } = useThemeMode();
  const next = resolved === 'dark' ? 'light' : 'dark';
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={next === 'dark' ? '다크 모드로 전환' : '라이트 모드로 전환'}
      onClick={() => set(next)}
      className={cn('text-fg-muted hover-fine:text-fg-default', className)}
      data-slot="theme-toggle"
      data-theme-resolved={resolved}
      {...props}
    >
      {resolved === 'dark' ? <Sun /> : <Moon />}
    </Button>
  );
}

export { ThemeToggle };
