'use client';

import { LANDING } from '../content/landing';
import { isLit } from '../fx/words';
import { useWordProgress } from '../observe/use-word-progress';
import { Reveal, Section } from './section';

export function Philosophy() {
  const p = LANDING.philosophy;
  const words = p.sentence.split(' ');
  const [ref, progress] = useWordProgress<HTMLParagraphElement>();
  return (
    <Section
      id="philosophy"
      titleReveal="fade"
      title={
        <span ref={ref} className="block max-w-[960px] text-h2 font-bold leading-[1.45] medium:text-[40px] medium:leading-[1.45]">
          {words.map((w, i) => (
            <span key={`${w}-${i}`} data-word data-lit={isLit(i, words.length, progress)} className="landing-word">
              {w}{' '}
            </span>
          ))}
        </span>
      }
      className="py-36"
    >
      <Reveal index={1} as="p" className="max-w-content text-body-lg text-fg-body">
        {p.support}
      </Reveal>
    </Section>
  );
}
