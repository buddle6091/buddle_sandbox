/** 강의 덱(가로 scroll-snap) — 카드 중심과 덱 중심의 거리 d 로 3D 변형. 순수 함수. */
const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

export type DeckTransform = { rotateY: number; translateZ: number; opacity: number };

/** d: (카드 중심 − 덱 중심) / 덱 폭. 0 = 정면. */
export function deckTransform(d: number): DeckTransform {
  const a = Math.min(1, Math.abs(d));
  return {
    rotateY: clamp(-d * 46, -38, 38) || 0,
    translateZ: -a * 140 || 0,
    opacity: Math.max(0.45, 1 - a * 0.7),
  };
}

export function deckDistance(
  deck: { scrollLeft: number; clientWidth: number },
  card: { offsetLeft: number; offsetWidth: number },
) {
  const center = deck.scrollLeft + deck.clientWidth / 2;
  const mid = card.offsetLeft + card.offsetWidth / 2;
  return (mid - center) / deck.clientWidth;
}

export function deckStyle(t: DeckTransform) {
  return `rotateY(${t.rotateY.toFixed(2)}deg) translateZ(${t.translateZ.toFixed(1)}px)`;
}
