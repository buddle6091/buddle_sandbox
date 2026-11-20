import { cn } from '@sandbox/ui/lib/utils';

import { metaLabel } from '../fx/meta';

/**
 * 고정폭 메타 라벨 — DayDream 작업물 카드의 `UI UX · WEB DESIGN` 자리. 라틴 문자는 대문자, 자간을 조금 넓힌다.
 * 에디토리얼 헤더의 고정폭 숫자들과 톤을 맞춘다. 값이 다 비면 그리지 않는다.
 */
export function MetaLabel({ parts, className }: { parts: readonly (string | undefined | null)[]; className?: string }) {
  const text = metaLabel(parts);
  if (!text) return null;
  return (
    <p data-slot="meta" className={cn('font-mono text-caption uppercase tracking-wider text-fg-muted', className)}>
      {text}
    </p>
  );
}
