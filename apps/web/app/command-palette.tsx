'use client';

import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { CalendarDays, Copy, ExternalLink, FileText, Hash, Home, Monitor, Moon, Search, Sun, type LucideIcon } from 'lucide-react';

import { Button } from '@sandbox/ui/components/button';
import { CommandDialog, type CommandItem } from '@sandbox/ui/components/command';
import { toast } from '@sandbox/ui/components/toast';
import { setThemePreference } from '@sandbox/ui/hooks/use-theme-mode';

import { LANDING } from '../src/landing/content/landing';
import { copyText } from '../src/shell/clipboard';
import { isPaletteShortcut, paletteItems, type PaletteItem } from '../src/shell/palette-items';

const ROUTE_ICON: Record<string, LucideIcon> = { '/': Home, '/blog': FileText, '/calendar': CalendarDays };
const THEME_ICON = { light: Sun, dark: Moon, system: Monitor } as const;

function iconFor(it: PaletteItem): LucideIcon {
  const a = it.action;
  if (a.kind === 'route') return ROUTE_ICON[a.href] ?? Home;
  if (a.kind === 'section') return Hash;
  if (a.kind === 'theme') return THEME_ICON[a.value];
  if (a.kind === 'copy') return Copy;
  return ExternalLink;
}

/**
 * ⌘K 명령 팔레트 — TopBar 우측 트리거 + 전역 단축키. 세 라우트 공통(Shell 이 꽂는다).
 * 섹션 이동은 랜딩이면 요소로 바로(scrollIntoView — 브라우저 기본 스크롤, CSS smooth 적용),
 * 다른 라우트면 `/#id` 로 이동한다. 스크롤 라이브러리는 쓰지 않는다(apps/web 규칙 3).
 */
export function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const source = React.useMemo(() => paletteItems(pathname), [pathname]);
  const items = React.useMemo<CommandItem[]>(
    () => source.map((it) => ({ id: it.id, label: it.label, group: it.group, keywords: it.keywords, hint: it.hint, icon: iconFor(it) })),
    [source],
  );

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!isPaletteShortcut(e)) return;
      e.preventDefault();
      setOpen((v) => !v);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const onSelect = async (item: CommandItem) => {
    const a = source.find((s) => s.id === item.id)?.action;
    if (!a) return;
    if (a.kind === 'route') router.push(a.href);
    else if (a.kind === 'section') {
      const el = pathname === '/' ? document.getElementById(a.id) : null;
      // 팔레트가 닫히며 포커스가 트리거로 돌아간 다음에 스크롤한다
      if (el) window.setTimeout(() => el.scrollIntoView(), 0);
      else router.push(a.href);
    } else if (a.kind === 'theme') setThemePreference(a.value);
    else if (a.kind === 'copy') {
      if (await copyText(a.text)) toast(LANDING.contact.copied);
      else window.location.assign(`mailto:${a.text}`);
    } else window.open(a.href, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        aria-label="명령 팔레트 열기"
        aria-keyshortcuts="Meta+K Control+K"
        onClick={() => setOpen(true)}
        data-slot="palette-trigger"
        className="size-11 gap-1.5 px-0 text-fg-muted hover-fine:text-fg-default expanded:h-8 expanded:w-auto expanded:px-2"
      >
        <Search />
        <kbd className="hidden font-mono text-caption font-normal expanded:inline-block">⌘K</kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen} items={items} onSelect={onSelect} placeholder="페이지 · 섹션 · 테마 · 이메일 복사" />
    </>
  );
}
