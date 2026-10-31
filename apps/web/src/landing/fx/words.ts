/** 철학 문장 — 블록이 뷰포트를 올라오는 정도(0~1)에 비례해 앞 단어부터 밝아진다. 순수 함수. */
const clamp01 = (n: number) => (Number.isFinite(n) ? Math.min(1, Math.max(0, n)) : 0);

export function wordProgress(rect: { top: number; height: number }, vh: number) {
  return clamp01((vh * 0.8 - rect.top) / (rect.height * 0.6 + vh * 0.2));
}

export function isLit(index: number, count: number, progress: number) {
  return index / count < progress;
}
