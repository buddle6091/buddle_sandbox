import type { Metadata, Viewport } from 'next';

import { AmbientBackground } from '@sandbox/ui/components/ambient-background';

import { Shell } from './shell';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'buddle — 이상원', template: '%s · buddle' },
  description: 'Frontend Developer · AX Instructor. 기업·기관 AI 교육, 프론트엔드 실무 교육, 해커톤 TA.',
  metadataBase: new URL('https://buddle.dev'),
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="min-h-dvh bg-bg-page font-sans text-fg-default antialiased">
        <AmbientBackground />
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
