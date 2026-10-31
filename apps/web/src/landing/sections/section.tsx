'use client';

import * as React from 'react';

import { cn } from '@sandbox/ui/lib/utils';

import type { SectionId } from '../content/landing';
import { useInView } from '../observe/use-in-view';

/**
 * 랜딩 섹션 래퍼 — IO 로 data-inview 만 토글, 리빌 전환은 globals.css([data-reveal]).
 * variant tinted = 시안의 --bg2 교대 배경(bg/subtle + 위아래 선). 제목이 aria-labelledby 로 landmark 이름.
 */
export function Section({
  id,
  eyebrow,
  title,
  titleAs = 'h2',
  lead,
  variant = 'default',
  align = 'left',
  header = 'default',
  className,
  innerClassName,
  children,
}: {
  id: SectionId;
  eyebrow?: string;
  title: React.ReactNode;
  titleAs?: 'h1' | 'h2';
  /** 제목 아래 보조 문장 */
  lead?: React.ReactNode;
  variant?: 'default' | 'tinted';
  align?: 'left' | 'center';
  /** 'none' 이면 호출자가 `${id}-title` id 를 가진 제목을 직접 그린다(히어로·문의 카드) */
  header?: 'default' | 'none';
  className?: string;
  innerClassName?: string;
  children?: React.ReactNode;
}) {
  const [ref, inView] = useInView<HTMLElement>({ threshold: 0.12, rootMargin: '0px 0px -10% 0px' });
  const titleId = `${id}-title`;
  const Title = titleAs;
  return (
    <section
      id={id}
      ref={ref}
      data-section
      data-inview={inView}
      aria-labelledby={titleId}
      className={cn(
        'relative z-10 scroll-mt-[calc(var(--bs-layout-topbar-h)+12px)] px-4 py-24 medium:px-8',
        variant === 'tinted' && 'border-y border-border-default bg-bg-subtle',
        className,
      )}
    >
      <div className={cn('mx-auto flex w-full max-w-[1120px] flex-col gap-10', align === 'center' && 'items-center text-center', innerClassName)}>
        {header === 'default' && (
        <header data-reveal style={{ '--i': 0 } as React.CSSProperties} className={cn('flex flex-col gap-2', align === 'center' && 'items-center')}>
            {eyebrow && <p className="text-label uppercase tracking-[0.08em] text-fg-link">{eyebrow}</p>}
            <Title
              id={titleId}
              className={cn(titleAs === 'h1' ? 'text-h1 medium:text-display' : 'text-h2 font-extrabold medium:text-h1 medium:font-extrabold', 'text-fg-default')}
            >
              {title}
            </Title>
            {lead && <p className="max-w-content text-body text-fg-muted">{lead}</p>}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}

/** 리빌 대상 — data-reveal(기본 / flip / depth) + 스태거 인덱스 */
export function Reveal({
  index = 0,
  variant,
  as: Comp = 'div',
  className,
  children,
  ...props
}: {
  index?: number;
  variant?: 'flip' | 'depth';
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
