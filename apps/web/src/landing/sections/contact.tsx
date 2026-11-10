'use client';

import * as React from 'react';
import { Check, Copy } from 'lucide-react';

import { Button } from '@sandbox/ui/components/button';
import { toast } from '@sandbox/ui/components/toast';

import { copyText } from '../../shell/clipboard';
import { LANDING } from '../content/landing';
import { Reveal, Section } from './section';
import { useMagnetic } from './use-magnetic';

/**
 * 유약 고임 CTA — 불투명 표면 카드 안에 제목(=섹션 landmark 이름) · 본문 · 버튼.
 * v3: 주 버튼은 이메일 복사(토스트로 알리고 「메일 앱으로 보내기」 액션 제공). 복사가 막히면 바로 mailto 로 넘긴다.
 * mailto 링크는 따로 남겨 둔다 — 복사 버튼만으로는 메일 앱을 열 방법이 없다.
 */
export function Contact() {
  const c = LANDING.contact;
  const [copied, setCopied] = React.useState(false);
  const magnet = useMagnetic<HTMLSpanElement>();
  const mailto = `mailto:${c.email}`;

  const onCopy = async () => {
    if (await copyText(c.email)) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
      toast(c.copied, { action: { label: c.openMail, onClick: () => window.location.assign(mailto) } });
    } else {
      window.location.assign(mailto);
    }
  };

  return (
    <Section id="contact" title={c.title} header="none" className="pb-30">
      <Reveal index={0} className="w-full">
        <div className="landing-spot relative overflow-hidden rounded-xl border border-border-default border-b-glass-foot bg-bg-default shadow-glass">
          <div aria-hidden="true" className="landing-contact-pool absolute inset-0" />
          <div className="relative flex flex-col items-center gap-5 px-6 pt-18 pb-24 text-center">
            <h2 id="contact-title" className="text-h2 font-extrabold text-fg-default medium:text-[44px] medium:leading-[1.25]">
              {c.title}
            </h2>
            <p className="max-w-[560px] text-body text-fg-body">{c.body}</p>
            <div className="flex flex-wrap justify-center gap-3">
              <span className="landing-magnet inline-flex" {...magnet}>
                <Button type="button" size="lg" onClick={onCopy} aria-label={`${c.copyLabel}: ${c.email}`} data-slot="copy-email">
                  {copied ? <Check /> : <Copy />}
                  {c.email}
                </Button>
              </span>
              {c.links.map((l) => (
                <Button key={l.href} asChild size="lg" variant="glass">
                  <a href={l.href} target="_blank" rel="noopener noreferrer">
                    {l.label}
                  </a>
                </Button>
              ))}
            </div>
            <a href={mailto} className="focus-ring rounded-sm text-body-sm text-fg-link underline-offset-4 hover-fine:underline">
              {c.openMail}
            </a>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
