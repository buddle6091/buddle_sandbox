/**
 * 스크롤 진행도 스토어 — SSOT 는 브라우저 스크롤이고, 이건 그 값을 3D 가 리렌더 없이 읽기 위한 ref.
 * React 상태가 아니다: 프레임마다 바뀌는 값을 state 에 넣으면 전체 트리가 리렌더된다.
 */
export type ScrollListener = (progress: number) => void;

const listeners = new Set<ScrollListener>();

export const scrollStore = {
  /** 0~1 */
  progress: 0,
  set(progress: number) {
    if (progress === scrollStore.progress) return;
    scrollStore.progress = progress;
    for (const l of listeners) l(progress);
  },
  subscribe(listener: ScrollListener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  /** 테스트용 */
  reset() {
    scrollStore.progress = 0;
    listeners.clear();
  },
};
