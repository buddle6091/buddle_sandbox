/**
 * 인트로 문장 — 텍스트 세그먼트는 단어로, 칩(작은 아이콘 알약)은 한 토큰으로 펼친다.
 * index 는 단어 하이라이트(isLit)에 그대로 쓰여 칩도 문장 순서대로 켜진다.
 */
export type IntroChip = 'code' | 'building' | 'spark';
export type IntroSegment = { readonly text: string; readonly em?: boolean } | { readonly chip: IntroChip; readonly label: string };

export type IntroToken =
  | { kind: 'word'; index: number; text: string; em: boolean }
  | { kind: 'chip'; index: number; chip: IntroChip; label: string };

export function introTokens(segments: readonly IntroSegment[]) {
  const tokens: IntroToken[] = [];
  for (const seg of segments) {
    if ('chip' in seg) {
      tokens.push({ kind: 'chip', index: tokens.length, chip: seg.chip, label: seg.label });
      continue;
    }
    for (const w of seg.text.split(/\s+/)) {
      if (w) tokens.push({ kind: 'word', index: tokens.length, text: w, em: Boolean(seg.em) });
    }
  }
  return { tokens, count: tokens.length };
}
