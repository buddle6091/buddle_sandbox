'use client';

import * as React from 'react';

import { cn } from '@sandbox/ui/lib/utils';

import type { SectionId } from '../content/landing';
import { useInView } from '../observe/use-in-view';

/**
 * 랜딩 섹션 래퍼 — IO 로 data-inview 만 토글, 리빌 전환은 globals.css 의 [data-reveal].
 * 콘텐츠는 z-10(캔버스 z-1 위). 제목은 aria-labelledby 로 landmark(region) 이름이 된다.
 */
export function Section({
  id,
  eyebrow,
  title,
  titleAs = 'h2',
  align = 'left',
  className,
  children,
}: {
  id: SectionId;
  eyebrow?: string;
  title: React.ReactNode;
  titleAs?: 'h1' | 'h2';
  align?: 'left' | 'center';
  className?: string;
  children?: React.ReactNode;
}) {
  const [ref, inView] = useInView<HTMLElement>({ threshold: 0.2 });
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
        'relative z-10 mx-auto flex min-h-dvh w-full max-w-[1120px] flex-col justify-center gap-8 px-4 py-20 medium:px-8',
        align === 'center' && 'items-center text-center',
        className,
      )}
    >
      <header className={cn('flex flex-col gap-3', align === 'center' && 'items-center')}>
        {eyebrow && (
          <p data-reveal className="text-label text-accent-default">
            {eyebrow}
          </p>
        )}
        <Title
          id={titleId}
          data-reveal
          style={{ '--reveal-index': 1 } as React.CSSProperties}
          className={cn(titleAs === 'h1' ? 'text-display' : 'text-h1', 'text-fg-default')}
        >
          {title}
        </Title>
      </header>
      {children}
    </section>
  );
}

/** 자식에 리빌 스태거 인덱스를 붙인다 */
export function Reveal({
  index = 0,
  as: Comp = 'div',
  className,
  children,
  ...props
}: {
  index?: number;
  as?: React.ElementType;
  className?: string;
  children?: React.ReactNode;
} & Record<string, unknown>) {
  return (
    <Comp data-reveal style={{ '--reveal-index': index + 2 } as React.CSSProperties} className={className} {...props}>
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
