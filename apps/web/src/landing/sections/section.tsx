'use client';

import * as React from 'react';

import { cn } from '@sandbox/ui/lib/utils';

import type { SectionId } from '../content/landing';
import { useInView } from '../observe/use-in-view';

/**
 * 랜딩 섹션 래퍼 — IO 로 data-inview 만 토글, 리빌 전환은 globals.css([data-reveal]).
 * v3(2026-11-10): 영문 소제목(eyebrow) · tinted 교대 배경 제거. 섹션마다 배치를 달리하기 위해 layout 을 둔다.
 *   stack  제목 위 · 본문 아래(기본)
 *   split  expanded 에서 좌 4칸 sticky 제목 / 우 8칸 본문. 그 아래 폭은 stack 과 같다.
 * 제목이 aria-labelledby 로 landmark 이름. 제목은 줄 마스크 안에서 올라온다(data-reveal="rise").
 */
export function Section({
  id,
  title,
  titleAs = 'h2',
  lead,
  layout = 'stack',
  titleReveal = 'rise',
  header = 'default',
  className,
  innerClassName,
  children,
}: {
  id: SectionId;
  title: React.ReactNode;
  titleAs?: 'h1' | 'h2';
  /** 제목 아래 보조 문장 */
  lead?: React.ReactNode;
  layout?: 'stack' | 'split';
  /** 제목 등장 — rise(줄 마스크 상승, 기본) / fade(긴 문장 제목용) */
  titleReveal?: 'rise' | 'fade';
  /** 'none' 이면 호출자가 `${id}-title` id 를 가진 제목을 직접 그린다(히어로·문의 카드) */
  header?: 'default' | 'none';
  className?: string;
  innerClassName?: string;
  children?: React.ReactNode;
}) {
  // 섹션 윗변이 뷰포트 아래 15% 선을 넘으면 등장. 비율(threshold) 기준은 쓰지 않는다 —
  // 멘토링처럼 뷰포트보다 훨씬 긴 섹션(2640px)은 12% 가 317px 라 제목이 한참 늦게 떠서 빈 화면이 생겼다(v3 실측).
  const [ref, inView] = useInView<HTMLElement>({ threshold: 0, rootMargin: '0px 0px -15% 0px' });
  const titleId = `${id}-title`;
  const Title = titleAs;
  const split = layout === 'split';
  return (
    <section
      id={id}
      ref={ref}
      data-section
      data-layout={layout}
      data-inview={inView}
      aria-labelledby={titleId}
      className={cn('relative z-10 scroll-mt-[calc(var(--bs-layout-topbar-h)+12px)] px-4 py-24 medium:px-8', className)}
    >
      <div
        className={cn(
          'mx-auto flex w-full max-w-[1120px] flex-col gap-10',
          split && 'expanded:grid expanded:grid-cols-12 expanded:items-start expanded:gap-x-12',
          innerClassName,
        )}
      >
        {header === 'default' && (
          <header
            className={cn(
              'flex flex-col gap-3',
              split && 'expanded:sticky expanded:top-[calc(var(--bs-layout-topbar-h)+var(--spacing)*10)] expanded:col-span-4',
            )}
          >
            <Title
              id={titleId}
              className={cn(
                'text-fg-default',
                titleReveal === 'rise' && 'landing-mask',
                titleAs === 'h1' ? 'text-h1 medium:text-display' : 'text-h2 font-extrabold medium:text-h1 medium:font-extrabold',
              )}
            >
              <span data-reveal={titleReveal} className="block">
                {title}
              </span>
            </Title>
            {lead && (
              <p data-reveal="fade" style={{ '--i': 2 } as React.CSSProperties} className="max-w-content text-body text-fg-muted">
                {lead}
              </p>
            )}
          </header>
        )}
        {split ? <div className="flex min-w-0 flex-col gap-10 expanded:col-span-8">{children}</div> : children}
      </div>
    </section>
  );
}

/** 리빌 대상 — 기본(16px 상승 + 페이드) / fade(투명도만) / rise(줄 마스크 안에서 상승) + 스태거 인덱스 */
export function Reveal({
  index = 0,
  variant,
  as: Comp = 'div',
  className,
  children,
  ...props
}: {
  index?: number;
  variant?: 'fade' | 'rise';
  as?: React.ElementType;
  className?: string;
  children?: React.ReactNode;
} & Record<string, unknown>) {
  return (
    <Comp data-reveal={variant ?? ''} style={{ '--i': index } as React.CSSProperties} className={className} {...props}>
      {children}
    </Comp>
  );
}

export function ExternalLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn('focus-ring rounded-sm text-fg-link underline-offset-4 hover-fine:underline', className)}
    >
      {children}
    </a>
  );
}
