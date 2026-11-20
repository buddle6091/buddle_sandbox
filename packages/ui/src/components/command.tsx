'use client';

import * as React from 'react';
import type { LucideIcon } from 'lucide-react';
import { SearchIcon } from 'lucide-react';
import { Dialog as DialogPrimitive } from 'radix-ui';

import { cn } from '@sandbox/ui/lib/utils';
import { DialogContent } from './dialog';

/**
 * CommandDialog — ⌘K 명령 팔레트 (2026-11-10, 랜딩 v3)
 * 표면은 Dialog(design.md §6.7 glass solid · radius/xl) 그대로, 안쪽은 WAI-ARIA combobox + listbox:
 *   입력  role=combobox · aria-controls · aria-activedescendant (포커스는 항상 입력에 있다)
 *   목록  role=listbox, 그룹은 role=group + 라벨, 항목은 role=option · aria-selected
 * 키: ↑/↓ 이동(끝에서 순환) · Home/End · Enter 실행 · Esc 닫기(Dialog). 마우스는 올리면 활성, 누르면 실행.
 * cmdk 를 쓰지 않는다 — 항목 수십 개 규모라 부분 문자열 검색(filterCommands)이면 충분하고 의존성을 늘리지 않는다.
 */
export type CommandItem = {
  id: string;
  label: string;
  /** 그룹 제목. 같은 group 끼리 처음 나온 순서대로 묶인다. */
  group: string;
  /** 검색에만 쓰는 추가 낱말(영문 별칭 등) */
  keywords?: string;
  /** 우측 보조 표기(단축키 · 경로) */
  hint?: string;
  icon?: LucideIcon;
};

const norm = (s: string) => s.toLowerCase().replace(/\s+/g, '');

/** 공백 · 대소문자를 무시한 부분 문자열 검색. 낱말이 여러 개면 전부 들어 있어야 한다(AND). 빈 질의는 전체. */
export function filterCommands<T extends Pick<CommandItem, 'label' | 'group' | 'keywords'>>(items: readonly T[], query: string): T[] {
  const terms = query.trim().split(/\s+/).filter(Boolean).map(norm);
  if (terms.length === 0) return [...items];
  return items.filter((it) => {
    const hay = norm(`${it.label} ${it.group} ${it.keywords ?? ''}`);
    return terms.every((t) => hay.includes(t));
  });
}

/** 처음 나온 순서를 지키며 group 으로 묶는다. */
export function groupCommands<T extends Pick<CommandItem, 'group'>>(items: readonly T[]): Array<{ group: string; items: T[] }> {
  const out: Array<{ group: string; items: T[] }> = [];
  for (const it of items) {
    const g = out.find((x) => x.group === it.group);
    if (g) g.items.push(it);
    else out.push({ group: it.group, items: [it] });
  }
  return out;
}

type CommandDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: readonly CommandItem[];
  /** 항목 실행. 호출 뒤 팔레트는 닫힌다. */
  onSelect: (item: CommandItem) => void;
  /** 접근 이름(보이지 않는 제목) */
  title?: string;
  placeholder?: string;
  emptyText?: string;
  className?: string;
};

function CommandDialog({ open, onOpenChange, title = '명령 팔레트', className, ...body }: CommandDialogProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogContent
        data-slot="command-dialog"
        showCloseButton={false}
        aria-describedby={undefined}
        className={cn('top-[12vh] max-w-[560px] translate-y-0 gap-0 overflow-hidden p-0', className)}
      >
        <DialogPrimitive.Title className="sr-only">{title}</DialogPrimitive.Title>
        {/* 닫히면 DialogContent 가 언마운트된다 → 본문 상태(질의 · 활성)는 열 때마다 새로 시작한다 */}
        <CommandBody title={title} onOpenChange={onOpenChange} {...body} />
      </DialogContent>
    </DialogPrimitive.Root>
  );
}

function CommandBody({
  items,
  onSelect,
  onOpenChange,
  title,
  placeholder = '이동하거나 실행할 것을 찾아보세요',
  emptyText = '맞는 항목이 없어요',
}: Pick<CommandDialogProps, 'items' | 'onSelect' | 'onOpenChange' | 'placeholder' | 'emptyText'> & { title: string }) {
  const [query, setQuery] = React.useState('');
  const [activeRaw, setActive] = React.useState(0);
  const baseId = React.useId();
  const listId = `${baseId}-list`;
  const optionId = (i: number) => `${baseId}-opt-${i}`;

  const filtered = React.useMemo(() => filterCommands(items, query), [items, query]);
  const groups = React.useMemo(() => groupCommands(filtered), [filtered]);
  // 화면에 보이는 순서(그룹 순)로 편 목록 — 활성 index 는 이 배열 기준
  const flat = React.useMemo(() => groups.flatMap((g) => g.items), [groups]);
  // 열린 채 items 가 줄어도 활성 항목이 사라지지 않게 범위 안으로
  const active = Math.min(activeRaw, Math.max(0, flat.length - 1));

  const run = (item: CommandItem | undefined) => {
    if (!item) return;
    onOpenChange(false);
    onSelect(item);
  };

  const move = (next: number) => {
    setActive(next);
    // 활성 항목이 목록 스크롤 영역 밖이면 보이게 한다
    document.getElementById(optionId(next))?.scrollIntoView?.({ block: 'nearest' });
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // 한글 조합 중 Enter(조합 확정)는 실행으로 치지 않는다. Safari 는 확정 Enter 의 keydown 이 isComposing=false · keyCode 229 로 온다
    if (e.nativeEvent.isComposing || e.keyCode === 229) return;
    const last = flat.length - 1;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      move(last < 0 || active >= last ? 0 : active + 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      move(last < 0 ? 0 : active <= 0 ? last : active - 1);
    } else if (e.key === 'Home') {
      e.preventDefault();
      move(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      move(Math.max(0, last));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      run(flat[active]);
    }
  };

  return (
    <>
      <div className="flex h-14 items-center gap-3 border-b border-border-default px-5">
        <SearchIcon aria-hidden className="size-4 shrink-0 text-fg-muted" />
        <input
          role="combobox"
          aria-expanded="true"
          aria-controls={listId}
          aria-activedescendant={flat[active] ? optionId(active) : undefined}
          aria-autocomplete="list"
          aria-label={title}
          autoComplete="off"
          spellCheck={false}
          autoFocus
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
          }}
          onKeyDown={onKeyDown}
          className="h-full min-w-0 flex-1 bg-transparent text-body text-fg-default outline-none placeholder:text-fg-muted"
        />
        <kbd className="hidden shrink-0 rounded-sm border border-border-default px-1.5 font-mono text-caption text-fg-muted medium:inline-block">esc</kbd>
      </div>
      {/* 빈 결과 안내는 listbox 밖 live 영역 — listbox 안의 문단은 스크린리더에 전달되지 않는다 */}
      <p role="status" data-slot="command-empty" className={cn('px-5 py-8 text-center text-body-sm text-fg-muted', flat.length > 0 && 'sr-only')}>
        {flat.length === 0 ? emptyText : `${flat.length}개`}
      </p>
      <div
        id={listId}
        role="listbox"
        aria-label={title}
        className={cn('max-h-[min(52vh,420px)] overflow-y-auto overscroll-contain p-2', flat.length === 0 && 'hidden')}
      >
        {groups.map((g, gi) => {
          // 그룹 이름에는 공백이 있을 수 있다 → id 는 순번으로(공백이 든 id 는 aria-labelledby 가 못 찾는다)
          const groupId = `${baseId}-g-${gi}`;
          return (
            <div key={g.group} role="group" aria-labelledby={groupId} className="pb-1">
              <div id={groupId} className="px-3 pt-3 pb-1.5 text-caption font-semibold text-fg-muted">
                {g.group}
              </div>
              {g.items.map((it) => {
                const i = flat.indexOf(it);
                const on = i === active;
                const Icon = it.icon;
                return (
                  <div
                    key={it.id}
                    id={optionId(i)}
                    role="option"
                    aria-selected={on}
                    data-slot="command-item"
                    onPointerMove={() => setActive(i)}
                    onClick={() => run(it)}
                    className={cn(
                      'flex min-h-11 cursor-pointer items-center gap-3 rounded-md px-3 text-body-sm text-fg-body select-none',
                      'transition-colors duration-[var(--bs-motion-control)] ease-bs',
                      'aria-selected:bg-accent-subtle-bg aria-selected:text-accent-fg-strong',
                      '[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
                    )}
                  >
                    {Icon && <Icon aria-hidden />}
                    <span className="min-w-0 flex-1 truncate">{it.label}</span>
                    {it.hint && <span className="shrink-0 font-mono text-caption text-fg-muted">{it.hint}</span>}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </>
  );
}

export { CommandDialog, type CommandDialogProps };
