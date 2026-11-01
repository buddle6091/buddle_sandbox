import { render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { LANDING, SECTION_IDS } from './content/landing';
import { Landing } from './landing';

// WebGL 은 jsdom 에 없다 — 캔버스는 자리만 확인한다.
vi.mock('./three/hero-canvas', () => ({
  HeroCanvas: () => <div data-slot="hero-canvas" data-testid="hero-canvas" />,
}));
vi.mock('./scroll/scroll-driver', () => ({
  ScrollDriver: () => null,
}));
// jsdom 에는 IntersectionObserver 가 없으므로 LazySection 은 즉시 렌더한다(폴백).

describe('Landing v2 — 시안 10섹션', () => {
  it('섹션 10개가 content 순서대로, 각자 id · landmark · 제목', () => {
    render(<Landing />);
    const sections = document.querySelectorAll('section[data-section]');
    expect([...sections].map((s) => s.id)).toEqual([...SECTION_IDS]);
    for (const s of sections) expect(s.querySelector('h1, h2')).not.toBeNull();
  });

  it('히어로 — h1 하나(이름), 배지, 역할, CTA 는 섹션 앵커', () => {
    render(<Landing />);
    const h1s = screen.getAllByRole('heading', { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent(LANDING.hero.name);
    expect(screen.getByText(LANDING.hero.badge)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '강의 문의하기' })).toHaveAttribute('href', '#contact');
    expect(screen.getByRole('link', { name: '강의 이력 보기' })).toHaveAttribute('href', '#teaching');
  });

  it('히어로 배경 영상(시안 D) — muted · loop · playsinline · poster, 장식(aria-hidden)', () => {
    render(<Landing />);
    const video = document.querySelector('video') as HTMLVideoElement;
    expect(video).not.toBeNull();
    expect(video).toHaveAttribute('src', '/hero/glaze-loop.mp4');
    expect(video).toHaveAttribute('poster', '/hero/glaze-poster.jpg');
    expect(video.muted).toBe(true);
    expect(video).toHaveAttribute('loop');
    expect(video).toHaveAttribute('playsinline');
    expect(video.closest('[aria-hidden="true"]')).not.toBeNull();
  });

  it('숫자는 공개용 이력서 값 — 38 · 1,000+ · 1,200+ · 51 · 3', () => {
    render(<Landing />);
    const about = document.getElementById('about')!;
    const items = within(about).getAllByRole('listitem');
    expect(items).toHaveLength(5);
    expect(items[0]).toHaveTextContent('38');
    expect(items[1]).toHaveTextContent('1,000');
    expect(items[1]).toHaveTextContent('+');
    expect(items[2]).toHaveTextContent('1,200');
    expect(items[3]).toHaveTextContent('51');
    expect(within(about).getByText(/기업 · 기관 출강 36곳/)).toBeInTheDocument();
  });

  it('확정한 제목 3개와 섹션 구성(칩 · 막대 14 · 덱 10 · 멘토링 5 · 경력 4 · 후기 2)', () => {
    render(<Landing />);
    expect(screen.getByRole('heading', { name: '현업 개발 역량을 그대로 교육으로' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '가르치는 내용은 직접 만들어 본 것들입니다' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '팀에 맞는 AX 교육을 함께 설계합니다' })).toBeInTheDocument();
    expect(screen.getByText('Module Federation')).toBeInTheDocument();
    expect(document.querySelectorAll('#audience [data-slot="bar"]')).toHaveLength(14);
    expect(within(screen.getByRole('region', { name: LANDING.teaching.deckLabel })).getAllByRole('article')).toHaveLength(10);
    for (const m of LANDING.mentoring.items) expect(screen.getByText(m.title)).toBeInTheDocument();
    expect(document.querySelectorAll('#career ol > li')).toHaveLength(4);
    for (const q of LANDING.feedback.quotes) expect(screen.getByText(q.quote)).toBeInTheDocument();
  });

  it('철학 문장은 단어 span 으로 쪼개져 진행도 하이라이트 대상이 된다', () => {
    render(<Landing />);
    const words = document.querySelectorAll('#philosophy [data-word]');
    expect(words.length).toBe(LANDING.philosophy.sentence.split(' ').length);
  });

  it('연락처 — 새 이메일 mailto, 외부 링크 noopener', () => {
    render(<Landing />);
    expect(screen.getByRole('link', { name: /sangwon\.lee@buddle\.it\.kr/ })).toHaveAttribute('href', 'mailto:sangwon.lee@buddle.it.kr');
    const gh = screen.getByRole('link', { name: 'GitHub' });
    expect(gh).toHaveAttribute('href', 'https://github.com/buddle6091');
    expect(gh).toHaveAttribute('rel', expect.stringContaining('noopener'));
  });

  it('비공개 원칙 — 고객사 실명 · 전화번호 · 생년월일 · 옛 이메일이 없다', () => {
    const { container } = render(<Landing />);
    const text = container.textContent ?? '';
    for (const name of ['삼성', '포스코', '롯데', '한솔', '농심', '씨젠', '세방', '카카오', 'LIG', '크래프톤', '현대중공업']) {
      expect(text, name).not.toContain(name);
    }
    expect(text).not.toMatch(/010[- ]?\d{4}[- ]?\d{4}/);
    expect(text).not.toMatch(/1998/);
    expect(text).not.toContain('naver.com');
  });

  it('expanded(≥1024) — 캔버스 자리는 히어로 안(전면 고정 아님), 리빌 요소 다수', async () => {
    const spy = vi.spyOn(window, 'matchMedia').mockImplementation(
      (q: string) =>
        ({
          matches: q === '(min-width: 1024px)',
          media: q,
          onchange: null,
          addListener: () => undefined,
          removeListener: () => undefined,
          addEventListener: () => undefined,
          removeEventListener: () => undefined,
          dispatchEvent: () => false,
        }) as MediaQueryList,
    );
    render(<Landing />);
    const canvas = await screen.findByTestId('hero-canvas');
    expect(canvas.closest('#top')).not.toBeNull();
    expect(document.querySelectorAll('[data-reveal]').length).toBeGreaterThan(10);
    spy.mockRestore();
  });

  it('compact·medium(<1024) — 3D 캔버스를 아예 마운트하지 않는다(영상 배경만)', () => {
    render(<Landing />);
    expect(screen.queryByTestId('hero-canvas')).toBeNull();
    expect(document.querySelector('[data-slot="hero-video"]')).not.toBeNull();
  });
});
