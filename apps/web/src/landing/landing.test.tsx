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

describe('Landing — 이력서 기반 정보 흐름 9섹션', () => {
  it('섹션 9개가 content 순서대로, 각자 id 와 landmark 를 가진다', () => {
    render(<Landing />);
    const sections = document.querySelectorAll('section[data-section]');
    expect([...sections].map((s) => s.id)).toEqual([...SECTION_IDS]);
    for (const s of sections) {
      expect(s).toHaveAttribute('data-inview');
      expect(s.querySelector('h1, h2')).not.toBeNull();
    }
  });

  it('h1 은 하나(이름), 역할·소개·CTA·외부 링크', () => {
    render(<Landing />);
    const h1s = screen.getAllByRole('heading', { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent(LANDING.hero.name);
    expect(screen.getByText(LANDING.hero.role)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '글 보기' })).toHaveAttribute('href', '/blog');
    expect(screen.getByRole('link', { name: '캘린더' })).toHaveAttribute('href', '/calendar');
    const gh = screen.getAllByRole('link', { name: /GitHub/ })[0];
    expect(gh).toHaveAttribute('href', 'https://github.com/buddle6091');
    expect(gh).toHaveAttribute('rel', expect.stringContaining('noopener'));
  });

  it('숫자는 이력서 값 그대로 5개, 롤링 전에는 0 이 아니라 최종값을 노출(SSR/noscript)', () => {
    render(<Landing />);
    const stats = screen.getByRole('region', { name: LANDING.stats[0].label.includes('기업') ? '숫자로 보는 이력' : '' });
    const items = within(stats).getAllByRole('listitem');
    expect(items).toHaveLength(5);
    expect(items[0]).toHaveTextContent('34');
    expect(items[1]).toHaveTextContent('800');
    expect(items[2]).toHaveTextContent('1,200');
    expect(items[0]).toHaveTextContent('담당 기업 · 기관');
  });

  it('커리큘럼 칩, 기관 칩(시간 포함), 멘토링 4개, 후기 2개, 연락처', () => {
    render(<Landing />);
    expect(screen.getByText('Module Federation')).toBeInTheDocument();
    expect(screen.getByText('Claude Code')).toBeInTheDocument();
    const audience = document.getElementById('audience')!;
    expect(within(audience).getByText('삼성전자').closest('li')).toHaveTextContent('329h');
    expect(screen.getByText(/그 외 19곳/)).toHaveTextContent('119h');
    for (const m of LANDING.mentoring.items) expect(screen.getByText(m.title)).toBeInTheDocument();
    for (const q of LANDING.feedback.quotes) expect(screen.getByText(q.quote)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /buddle6091@naver.com/ })).toHaveAttribute(
      'href',
      'mailto:buddle6091@naver.com',
    );
  });

  it('전화번호·생년월일은 어디에도 없다', () => {
    const { container } = render(<Landing />);
    expect(container.textContent).not.toMatch(/010[- ]?\d{4}[- ]?\d{4}/);
    expect(container.textContent).not.toMatch(/1998/);
  });

  it('캔버스 자리(고정 배경)가 있고, 리빌 요소는 data-reveal 로만 표시된다', async () => {
    render(<Landing />);
    // next/dynamic(ssr:false) 는 비동기로 마운트된다
    expect(await screen.findByTestId('hero-canvas')).toBeInTheDocument();
    expect(document.querySelectorAll('[data-reveal]').length).toBeGreaterThan(10);
  });
});
