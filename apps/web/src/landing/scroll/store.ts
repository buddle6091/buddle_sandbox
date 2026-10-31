/**
 * 스크롤 스토어 — SSOT 는 브라우저 스크롤이고, 이건 그 값을 리렌더 없이 읽기 위한 ref.
 * progress(0~1)와 raw scrollY(px) 둘 다 둔다: 진행 막대는 progress, 3D 리그는 scrollY 를 쓴다.
 */
export type ScrollListener = (progress: number, scrollY: number) => void;

const listeners = new Set<ScrollListener>();

type ScrollStore = {
  progress: number;
  scrollY: number;
  set(progress: number, scrollY?: number): void;
  subscribe(listener: ScrollListener): () => void;
  reset(): void;
};

export const scrollStore: ScrollStore = {
  progress: 0,
  scrollY: 0,
  set(progress, scrollY = scrollStore.scrollY) {
    if (progress === scrollStore.progress && scrollY === scrollStore.scrollY) return;
    scrollStore.progress = progress;
    scrollStore.scrollY = scrollY;
    for (const l of listeners) l(progress, scrollY);
  },
  subscribe(listener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  reset() {
    scrollStore.progress = 0;
    scrollStore.scrollY = 0;
    listeners.clear();
  },
};
