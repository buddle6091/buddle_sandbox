'use client';

import * as React from 'react';

type Props = React.ComponentProps<'div'> & {
  /** 마운트 전 자리표시 높이(px) — CLS 방지 */
  minHeight: number;
  /** 다음 섹션을 미리 그리는 여유. 기본: 뷰포트 아래 40% */
  rootMargin?: string;
};

/**
 * LazySection — 스크롤 뷰포인트 감지로 "다음 컴포넌트"를 그때 DOM 에 렌더한다.
 * 교차 전: min-height 자리표시만. 교차 후: children 마운트, 이후 유지(once).
 * IntersectionObserver 가 없는 환경(구형·테스트)에서는 즉시 렌더해 내용을 숨기지 않는다.
 * SSR 에서는 자리표시만 내려가고 클라이언트가 IO 로 채운다.
 */
export function LazySection({ minHeight, rootMargin = '0px 0px 40% 0px', children, style, ...rest }: Props) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = React.useState<boolean>(
    () => typeof window !== 'undefined' && typeof IntersectionObserver === 'undefined',
  );

  React.useEffect(() => {
    if (mounted) return;
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setMounted(true);
          io.disconnect();
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [mounted, rootMargin]);

  return (
    <div ref={ref} data-mounted={mounted} style={mounted ? style : { ...style, minHeight }} {...rest}>
      {mounted ? children : null}
    </div>
  );
}
