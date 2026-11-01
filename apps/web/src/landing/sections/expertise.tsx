'use client';

import { Badge } from '@sandbox/ui/components/badge';
import { Card } from '@sandbox/ui/components/card';

import { LANDING } from '../content/landing';
import { LazySection } from '../observe/lazy-section';
import { Reveal, Section } from './section';
import { useTilt } from './use-tilt';

function GroupCard({ title, chips, index }: { title: string; chips: readonly string[]; index: number }) {
  const tilt = useTilt<HTMLDivElement>();
  return (
    <Reveal index={index} variant="flip">
      <Card variant="glass" className="landing-tilt h-full gap-4 p-7" {...tilt}>
        <h3 className="landing-pop text-h3 font-bold text-fg-default">{title}</h3>
        <ul className="landing-pop flex flex-wrap gap-2">
          {chips.map((c) => (
            <li key={c}>
              {/* 칩은 카드 폭에 맞춰 줄바꿈(600~1023 에서 nowrap 칩이 카드 밖으로 넘쳐 가로 스크롤을 만들었다) */}
              <Badge variant="accent" className="h-auto min-h-8 max-w-full px-3 py-1.5 text-left text-label whitespace-normal">
                <span>{c}</span>
              </Badge>
            </li>
          ))}
        </ul>
      </Card>
    </Reveal>
  );
}

export function Expertise() {
  const e = LANDING.expertise;
  return (
    <Section id="expertise" eyebrow={e.eyebrow} title={e.title} variant="tinted">
      <LazySection minHeight={360}>
        <div className="grid gap-6 medium:grid-cols-2 expanded:grid-cols-3">
          {e.groups.map((g, i) => (
            <GroupCard key={g.title} title={g.title} chips={g.chips} index={i} />
          ))}
        </div>
      </LazySection>
    </Section>
  );
}
