'use client';

import { LANDING } from './content/landing';
import { SectionIndicator } from './observe/section-indicator';
import { ScrollDriver } from './scroll/scroll-driver';
import { ScrollProgressBar } from './scroll/scroll-progress-bar';
import { About } from './sections/about';
import { Audience } from './sections/audience';
import { Career } from './sections/career';
import { Contact } from './sections/contact';
import { Expertise } from './sections/expertise';
import { Feedback } from './sections/feedback';
import { Hero } from './sections/hero';
import { Mentoring } from './sections/mentoring';
import { Philosophy } from './sections/philosophy';
import { Teaching } from './sections/teaching';

/**
 * 랜딩 v2 — 히어로(영상 배경 + 우측 3D) 아래로 섹션 9개.
 * 스크롤은 네이티브(ScrollDriver 가 스토어에만 씀), 섹션 본문은 LazySection 이 뷰포트 접근 시 마운트,
 * 리빌은 IO + CSS. 진행 막대(TopBar 아래 2px)와 우측 섹션 점은 AppShell 내비를 대체하지 않는다.
 */
export function Landing() {
  return (
    <>
      <ScrollDriver />
      <ScrollProgressBar />
      <SectionIndicator />
      <Hero />
      <About />
      <Expertise />
      <Philosophy />
      <Audience />
      <Teaching />
      <Mentoring />
      <Career />
      <Feedback />
      <Contact />
      <footer className="border-t border-border-default px-4 pt-6 pb-12 medium:px-8">
        <p className="mx-auto max-w-[1120px] text-caption text-fg-muted">{LANDING.footer}</p>
      </footer>
    </>
  );
}
