'use client';

import { Mail } from 'lucide-react';

import { Button } from '@sandbox/ui/components/button';

import { LANDING } from '../content/landing';
import { Reveal, Section } from './section';

/** 유약 고임 CTA — 불투명 표면 카드 안에 제목(=섹션 landmark 이름) · 본문 · 버튼 3 */
export function Contact() {
  const c = LANDING.contact;
  return (
    <Section id="contact" title={c.title} header="none" className="pb-30">
      <Reveal index={0} variant="depth" className="w-full">
        <div className="relative overflow-hidden rounded-xl border border-border-default border-b-glass-foot bg-bg-default shadow-glass">
          <div aria-hidden="true" className="landing-contact-pool absolute inset-0" />
          <div className="relative flex flex-col items-center gap-5 px-6 pt-18 pb-24 text-center">
            <h2 id="contact-title" className="text-h2 font-extrabold text-fg-default medium:text-[44px] medium:leading-[1.25]">
              {c.title}
            </h2>
            <p className="max-w-[560px] text-body text-fg-body">{c.body}</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild size="lg">
                <a href={`mailto:${c.email}`}>
                  <Mail />
                  {c.email}
                </a>
              </Button>
              {c.links.map((l) => (
                <Button key={l.href} asChild size="lg" variant="glass">
                  <a href={l.href} target="_blank" rel="noopener noreferrer">
                    {l.label}
                  </a>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
