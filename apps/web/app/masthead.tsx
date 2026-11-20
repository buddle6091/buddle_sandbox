'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@sandbox/ui/lib/utils';

import { isCurrentRoute, MASTHEAD } from '../src/shell/site';

const LINK = cn(
  'focus-ring -mx-1 inline-flex items-center rounded-sm px-1 text-body-sm text-fg-muted underline-offset-4',
  'transition-colors duration-[var(--bs-motion-control)] ease-bs hover-fine:text-fg-default hover-fine:underline',
  'aria-[current=page]:font-semibold aria-[current=page]:text-fg-default',
);

/**
 * 에디토리얼 헤더(masthead) — ansphare 갤러리의 meridian · plait 형 배치(2026-11-16 사용자 선택).
 * 막대가 아니라 페이지 첫 줄: 왼쪽 로고 + 소개 두 줄, 오른쪽 세로 메뉴(이전과 같은 소개 · 블로그 · 캘린더) + 액션(⌘K · 테마).
 * 스크롤로 사라지면 AppShell 이 얇은 한 줄 바(로고 · 현재 섹션 · 탭 · 액션)를 내린다.
 * compact 는 메뉴를 숨긴다(하단 TabBar 가 같은 메뉴를 갖는다).
 */
export function Masthead({ actions }: { actions?: React.ReactNode }) {
  const pathname = usePathname();
  const m = MASTHEAD;
  return (
    <div className="mx-auto flex w-full max-w-landing items-start justify-between gap-8 px-4 pt-6 pb-4 medium:px-8 medium:pt-9">
      <div className="flex min-w-0 flex-col gap-2">
        <Link href="/" className="focus-ring -mx-1 self-start rounded-sm px-1 text-h3 font-bold lowercase text-fg-default">
          {m.brand}
        </Link>
        <p className="text-body-sm text-fg-muted">
          {m.tagline.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </p>
      </div>
      <div className="flex items-start gap-10">
        <nav aria-label="사이트 메뉴" className="hidden medium:block">
          <ul className="flex flex-col gap-1">
            {m.links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} aria-current={isCurrentRoute(l.href, pathname) ? 'page' : undefined} className={LINK}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        {actions && <div className="-mt-1.5 flex items-center gap-1">{actions}</div>}
      </div>
    </div>
  );
}
