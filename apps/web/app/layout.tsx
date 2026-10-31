import type { Metadata, Viewport } from 'next';

import { AmbientBackground } from '@sandbox/ui/components/ambient-background';

import { Shell } from './shell';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'buddle — 이상원', template: '%s · buddle' },
  description: 'Frontend Developer · AX Instructor. 기업·기관 AI 교육, 프론트엔드 실무 교육, 해커톤 TA.',
  metadataBase: new URL('https://buddle.it.kr'),
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

/**
 * FOUC 방지 — 하이드레이션 전에 저장된 테마(bs-theme)를 html[data-theme] 에 적용한다.
 * 키는 @sandbox/ui 의 useThemeMode(THEME_STORAGE_KEY) 와 같다. system 이면 속성을 두지 않는다.
 */
const THEME_BOOT = `(function(){try{var t=localStorage.getItem('bs-theme');if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t)}}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT }} />
      </head>
      <body className="min-h-dvh bg-bg-page font-sans text-fg-default antialiased">
        <AmbientBackground />
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
