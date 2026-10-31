'use client';

import * as React from 'react';

import { LANDING } from '../content/landing';
import { isLit, wordProgress } from '../fx/words';
import { Reveal, Section } from './section';

/** 스크롤 진행에 따라 앞 단어부터 밝아진다. rAF 스로틀, 이 컴포넌트만 리렌더. */
function useWordProgress<T extends HTMLElement>() {
  const ref = React.useRef<T>(null);
  const [progress, setProgress] = React.useState(0);
  React.useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const read = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setProgress(wordProgress({ top: r.top, height: r.height }, window.innerHeight));
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return [ref, progress] as const;
}

export function Philosophy() {
  const p = LANDING.philosophy;
  const words = p.sentence.split(' ');
  const [ref, progress] = useWordProgress<HTMLParagraphElement>();
  return (
    <Section
      id="philosophy"
      eyebrow={p.eyebrow}
      title={
        <span ref={ref} className="block max-w-[960px] text-h2 font-bold leading-[1.45] medium:text-[40px] medium:leading-[1.45]">
          {words.map((w, i) => (
            <span key={`${w}-${i}`} data-word data-lit={isLit(i, words.length, progress)} className="landing-word">
              {w}{' '}
            </span>
          ))}
        </span>
      }
      className="py-32"
    >
      <Reveal index={1} as="p" className="max-w-content text-body-lg text-fg-body">
        {p.support}
      </Reveal>
    </Section>
  );
}
