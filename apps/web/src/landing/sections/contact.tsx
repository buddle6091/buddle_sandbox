'use client';

import { Mail } from 'lucide-react';

import { Button } from '@sandbox/ui/components/button';

import { LANDING } from '../content/landing';
import { ExternalLink, Reveal, Section } from './section';

export function Contact() {
  const c = LANDING.contact;
  return (
    <Section id="contact" eyebrow={c.eyebrow} title={c.title} align="center" className="min-h-[80dvh]">
      <Reveal index={0} as="p" className="max-w-content text-body-lg text-fg-body">
        {c.body}
      </Reveal>
      <Reveal index={1} className="flex flex-col items-center gap-4">
        <Button asChild size="lg">
          <a href={`mailto:${c.email}`}>
            <Mail />
            {c.email}
          </a>
        </Button>
        <ul className="flex gap-5 text-body-sm">
          {c.links.map((l) => (
            <li key={l.href}>
              <ExternalLink href={l.href}>{l.label}</ExternalLink>
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}
