'use client';

import * as React from 'react';

import { SECTION_IDS, SECTION_LABELS } from '../src/landing/content/landing';
import { useActiveSection } from '../src/landing/observe/section-indicator';

/**
 * 헤더의 현재 위치 — `buddle / 교육 이력`. 랜딩에서만, 히어로를 지난 뒤에 나타난다.
 * slash.page 의 `/` 모티프 + "지금 어디를 보고 있는지"를 헤더가 말해 준다(우측 섹션 점과 같은 IO 를 쓴다).
 * 읽기 전용 표시라 스크린리더에는 알리지 않는다(섹션 제목이 이미 landmark 이름이다).
 */
export function SectionCrumb() {
  const active = useActiveSection(SECTION_IDS);
  const label = active ? SECTION_LABELS[active] : null;
  return (
    <span aria-hidden="true" data-slot="section-crumb" data-on={label !== null} className="section-crumb flex min-w-0 items-center gap-2">
      <span className="text-border-strong">/</span>
      <span key={label ?? 'none'} className="section-crumb-label truncate text-fg-body">
        {label ?? ''}
      </span>
    </span>
  );
}
