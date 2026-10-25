'use client';

import dynamic from 'next/dynamic';

import { ScrollDriver } from './scroll/scroll-driver';
import { Audience } from './sections/audience';
import { Contact } from './sections/contact';
import { Curriculum } from './sections/curriculum';
import { Experience } from './sections/experience';
import { Feedback } from './sections/feedback';
import { Hero } from './sections/hero';
import { Mentoring } from './sections/mentoring';
import { Philosophy } from './sections/philosophy';
import { Stats } from './sections/stats';

/** three 는 클라이언트 전용 — SSR 번들에서 제외 */
const HeroCanvas = dynamic(() => import('./three/hero-canvas').then((m) => m.HeroCanvas), { ssr: false });

/**
 * 랜딩 = 고정 캔버스 1장(z-1) 위에 DOM 섹션 9개(z-10).
 * 스크롤은 네이티브(ScrollDriver 가 진행도만 스토어에 씀), 리빌은 IO + CSS.
 */
export function Landing() {
  return (
    <>
      <ScrollDriver />
      <HeroCanvas />
      <Hero />
      <Stats />
      <Philosophy />
      <Curriculum />
      <Audience />
      <Mentoring />
      <Experience />
      <Feedback />
      <Contact />
    </>
  );
}
