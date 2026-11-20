'use client';

import { Building2, Code2, Sparkles, type LucideIcon } from 'lucide-react';

import { cn } from '@sandbox/ui/lib/utils';

import { LANDING } from '../content/landing';
import { introTokens, type IntroChip } from '../fx/intro';
import { isLit } from '../fx/words';
import { useWordProgress } from '../observe/use-word-progress';

const CHIP_ICON: Record<IntroChip, LucideIcon> = { code: Code2, building: Building2, spark: Sparkles };
/** 칩마다 기울기를 조금씩 다르게 — 손으로 붙인 스티커 느낌(DayDream). 순서대로 돌려 쓴다 */
const TILT = ['-rotate-6', 'rotate-3', '-rotate-3'];

/**
 * 히어로와 소개 사이의 인트로 문장(DayDream 식) — 섹션이 아니라 문장 블록이라 내비 · 섹션 점에 잡히지 않는다.
 * 스크롤에 따라 앞 단어부터 칠해지고(철학 섹션과 같은 useWordProgress · isLit), 사이사이 아이콘 칩이 튀어나온다.
 * 칩은 장식(aria-hidden) — 문장은 칩 없이도 그대로 읽힌다.
 */
export function Intro() {
  const { tokens, count } = introTokens(LANDING.intro);
  const [ref, progress] = useWordProgress<HTMLParagraphElement>();
  let chipNo = 0;
  return (
    <div data-slot="intro" className="px-4 pt-20 pb-8 medium:px-8 medium:pt-28">
      <p
        ref={ref}
        className="mx-auto max-w-[920px] text-center text-h2 font-bold leading-[1.6] text-fg-default medium:text-[40px] medium:leading-[1.55]"
      >
        {tokens.map((t) => {
          const lit = isLit(t.index, count, progress);
          if (t.kind === 'chip') {
            const Icon = CHIP_ICON[t.chip];
            const tilt = TILT[chipNo++ % TILT.length];
            return (
              <span
                key={`c-${t.index}`}
                aria-hidden="true"
                data-slot="intro-chip"
                data-lit={lit}
                className={cn(
                  'landing-intro-chip mx-1.5 inline-flex size-[1.15em] translate-y-[0.12em] items-center justify-center rounded-[0.32em] bg-accent-subtle-bg text-accent-fg-strong shadow-sm',
                  tilt,
                )}
              >
                <Icon className="size-[0.6em]" strokeWidth={2.25} />
              </span>
            );
          }
          return (
            <span
              key={`w-${t.index}`}
              data-word
              data-lit={lit}
              data-em={t.em}
              className={cn('landing-word', t.em && 'bg-gradient-to-r from-accent-default to-accent-tertiary bg-clip-text text-transparent')}
            >
              {t.text}{' '}
            </span>
          );
        })}
      </p>
    </div>
  );
}
