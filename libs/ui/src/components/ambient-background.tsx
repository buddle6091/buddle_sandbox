import * as React from 'react';

import { cn } from '@sandbox/ui/lib/utils';

/**
 * AmbientBackground — design.md §5.2
 * bg/page 위에 흐린 광원 3개 + 옅은 먹선 5줄. 문양·질감 이미지 없음, 정적(애니메이션 금지).
 * position fixed, inset 0, pointer-events none, z 0 — 콘텐츠는 z 1 이상(AppShell 이 z-10).
 * orb 중심을 콘텐츠 중앙에 두지 않는다. 먹선은 compact 에서 숨김, orb blur 는 compact 24px.
 */
const ORBS = [
  {
    key: 'primary',
    className: 'bg-orb-primary -top-[220px] -left-[140px] size-[var(--bs-orb-size-primary)]',
  },
  {
    key: 'tertiary',
    className: 'bg-orb-tertiary top-[340px] -right-[200px] size-[var(--bs-orb-size-tertiary)]',
  },
  {
    key: 'secondary',
    className: 'bg-orb-secondary -bottom-[260px] left-[38%] size-[var(--bs-orb-size-secondary)]',
  },
] as const;

/** 곡선 5줄 — 1440×900 기준, slice 로 전체를 덮는다 */
const INK_PATHS = [
  'M-40 180 C 300 120, 520 260, 860 200 S 1300 120, 1500 180',
  'M-40 330 C 260 290, 600 420, 900 360 S 1280 300, 1500 350',
  'M-40 500 C 220 470, 640 580, 980 520 S 1340 470, 1500 520',
  'M-40 660 C 300 630, 560 740, 900 690 S 1260 640, 1500 690',
  'M-40 820 C 240 800, 620 880, 940 840 S 1320 800, 1500 850',
];

function AmbientBackground({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      aria-hidden="true"
      data-slot="ambient-background"
      className={cn('pointer-events-none fixed inset-0 z-0 overflow-hidden', className)}
      {...props}
    >
      {ORBS.map((orb) => (
        <div
          key={orb.key}
          data-orb={orb.key}
          className={cn(
            'absolute rounded-full blur-[24px] medium:blur-[var(--bs-orb-blur)]',
            orb.className,
          )}
        />
      ))}
      <svg
        className="absolute inset-0 hidden size-full medium:block"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        {INK_PATHS.map((d) => (
          <path key={d} d={d} className="stroke-bg-inverse opacity-[0.07]" strokeWidth="1" />
        ))}
      </svg>
    </div>
  );
}

export { AmbientBackground };
