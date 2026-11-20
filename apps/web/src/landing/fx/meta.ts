/** 고정폭 메타 라벨(DayDream 의 `UI UX · WEB DESIGN` 자리) — 빈 값은 건너뛰고 가운뎃점으로 잇는다. */
export function metaLabel(parts: readonly (string | undefined | null)[]) {
  return parts
    .map((p) => p?.trim())
    .filter(Boolean)
    .join(' · ');
}
