'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { Button } from '@sandbox/ui/components/button';

import { LANDING } from '../content/landing';
import { ExternalLink, Reveal, Section } from './section';

export function Hero() {
  const h = LANDING.hero;
  return (
    <Section
      id="hero"
      titleAs="h1"
      title={
        <>
          {h.name}
          <span className="mt-2 block text-h3 font-semibold tracking-normal text-fg-muted">{h.latin}</span>
        </>
      }
      className="pt-[calc(var(--bs-layout-topbar-h)+var(--spacing)*12)]"
    >
      <Reveal index={0} as="p" className="text-label text-accent-default">
        {h.role}
      </Reveal>
      <Reveal index={1} as="p" className="max-w-content text-body-lg text-fg-body">
        {h.tagline}
      </Reveal>
      <Reveal index={2} className="flex flex-wrap items-center gap-3">
        <Button asChild size="lg">
          <Link href={h.ctas[0].href}>
            {h.ctas[0].label}
            <ArrowRight />
          </Link>
        </Button>
        <Button asChild size="lg" variant="glass">
          <Link href={h.ctas[1].href}>{h.ctas[1].label}</Link>
        </Button>
      </Reveal>
      <Reveal index={3} as="ul" className="flex gap-5 text-body-sm">
        {h.links.map((l) => (
          <li key={l.href}>
            <ExternalLink href={l.href}>{l.label}</ExternalLink>
          </li>
        ))}
      </Reveal>
    </Section>
  );
}
