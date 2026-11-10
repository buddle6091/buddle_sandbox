import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { LANDING, SECTION_IDS } from './content/landing';
import { courseFilterStore } from './filter/store';
import { Landing } from './landing';
import { scrollStore } from './scroll/store';

// WebGL 은 jsdom 에 없다 — 캔버스는 자리만 확인한다.
vi.mock('./three/hero-canvas', () => ({
  HeroCanvas: () => <div data-slot="hero-canvas" data-testid="hero-canvas" />,
}));
vi.mock('./scroll/scroll-driver', () => ({
  ScrollDriver: () => null,
}));
// jsdom 에는 IntersectionObserver 가 없으므로 LazySection 은 즉시 렌더한다(폴백).

afterEach(() => courseFilterStore.reset());

describe('Landing — 10섹션', () => {
  it('섹션 10개가 content 순서대로, 각자 id · landmark · 제목', () => {
    render(<Landing />);
    const sections = document.querySelectorAll('section[data-section]');
    expect([...sections].map((s) => s.id)).toEqual([...SECTION_IDS]);
    for (const s of sections) expect(s.querySelector('h1, h2')).not.toBeNull();
  });

  it('히어로 — h1 하나(이름), 역할, 소개 3줄, CTA 는 섹션 앵커 (v3: 배지 · 스크롤 화살표 없음)', () => {
    render(<Landing />);
    const h1s = screen.getAllByRole('heading', { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent(LANDING.hero.name);
    for (const line of LANDING.hero.lines) expect(screen.getByText(line)).toBeInTheDocument();
    expect(document.querySelector('#top .landing-cue')).toBeNull();
    // 최근 강의 한 줄 — 시작일이 가장 늦은 과정, 강의 이력 앵커
    const recent = document.querySelector('#top [data-slot="hero-recent"]')!;
    expect(recent).toHaveAttribute('href', '#teaching');
    expect(recent).toHaveTextContent('AI-EXPERT PBL 멘토링 (3일)');
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

  it('히어로 v2.1 — slash 광선 4개(장식) · 역할 줄 캐럿 · Clients 한 줄', () => {
    render(<Landing />);
    const shards = document.querySelectorAll('#top [data-slot="shard"]');
    expect(shards).toHaveLength(4);
    for (const s of shards) expect(s.closest('[aria-hidden="true"]')).not.toBeNull();
    expect(document.querySelector('#top .landing-caret')).not.toBeNull();
    expect(document.getElementById('top')).toHaveTextContent('노원 미래산업고');
  });

  it('숫자 v2.1 — 대표 숫자 1 + 스파크라인(주요 10개 과정 누적, 축 숫자 없음)', () => {
    render(<Landing />);
    const about = document.getElementById('about')!;
    const path = about.querySelector('svg[data-slot="sparkline"] path[data-slot="spark-path"]');
    expect(path?.getAttribute('d')).toMatch(/^M/);
    expect(about.querySelector('svg text')).toBeNull();
    expect(within(about).getByText(/주요 10개 과정 누적 강의 시간/)).toBeInTheDocument();
    expect(about.querySelector('[data-slot="stat-lead"]')).toHaveTextContent('1,000');
  });

  it('숫자는 공개용 이력서 값 — 38 · 1,000+ · 1,200+ · 51 · 3', () => {
    render(<Landing />);
    const about = document.getElementById('about')!;
    const items = within(about).getAllByRole('listitem');
    expect(items).toHaveLength(5);
    // v2.1: 대표 숫자(1,000h+)가 맨 앞, 나머지는 원래 순서
    expect(items[0]).toHaveTextContent('1,000');
    expect(items[0]).toHaveTextContent('+');
    expect(items[1]).toHaveTextContent('38');
    expect(items[2]).toHaveTextContent('1,200');
    expect(items[3]).toHaveTextContent('51');
    expect(items[4]).toHaveTextContent('3');
    expect(within(about).getByText(/기업 · 기관 출강 36곳/)).toBeInTheDocument();
  });

  it('제목 3개와 섹션 구성(칩 · 막대 14 · 강의 행 10 · 멘토링 5 · 경력 4 · 후기 2)', () => {
    render(<Landing />);
    expect(screen.getByRole('heading', { name: LANDING.expertise.title })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: LANDING.career.title })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: LANDING.contact.title })).toBeInTheDocument();
    // v3: 영문 대문자 소제목(eyebrow)은 없다
    expect(document.body.textContent).not.toMatch(/EXPERTISE & SKILLS|TEACHING PHILOSOPHY|DEVELOPER CAREER|AT A GLANCE/);
    expect(screen.getByText('Module Federation')).toBeInTheDocument();
    expect(document.querySelectorAll('#audience [data-slot="bar"]')).toHaveLength(14);
    expect(document.querySelectorAll('#teaching [data-course-row]')).toHaveLength(10);
    expect(document.querySelectorAll('#teaching [data-course-row] .landing-caret')).toHaveLength(10);
    expect(document.getElementById('teaching')).not.toHaveTextContent('옆으로 넘겨');
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
    expect(screen.getByRole('link', { name: LANDING.contact.openMail })).toHaveAttribute('href', 'mailto:sangwon.lee@buddle.it.kr');
    expect(screen.getByRole('button', { name: /이메일 주소 복사: sangwon\.lee@buddle\.it\.kr/ })).toBeInTheDocument();
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
    // 멘토링 v2.1 — expanded 에서만 sticky 스택 스테이지 + 카드 5
    const stage = document.querySelector('#mentoring [data-stack]');
    expect(stage).not.toBeNull();
    const cards = document.querySelectorAll<HTMLElement>('#mentoring [data-stack-card]');
    expect(cards).toHaveLength(5);
    scrollStore.set(0.5, 1234);
    await new Promise((r) => setTimeout(r, 50));
    expect(cards[0].style.opacity).toBe('1');
    spy.mockRestore();
  });

  it('compact·medium(<1024) — 멘토링은 스택 없이 번호 목록(5)', () => {
    render(<Landing />);
    expect(document.querySelector('#mentoring [data-stack]')).toBeNull();
    expect(document.querySelectorAll('#mentoring [data-slot="mentoring-list"] > li')).toHaveLength(5);
    for (const m of LANDING.mentoring.items) expect(screen.getByText(m.title)).toBeInTheDocument();
  });

  it('compact·medium(<1024) — 3D 캔버스를 아예 마운트하지 않는다(영상 배경만)', () => {
    render(<Landing />);
    expect(screen.queryByTestId('hero-canvas')).toBeNull();
    expect(document.querySelector('[data-slot="hero-video"]')).not.toBeNull();
  });

  it('v3 강의 필터 — 대상 칩으로 행을 거르고 결과 수를 알린다, 「전체」로 되돌린다', () => {
    render(<Landing />);
    const teaching = document.getElementById('teaching')!;
    const rows = () => teaching.querySelectorAll('[data-course-row]');
    const count = teaching.querySelector('[data-slot="course-count"]')!;
    expect(count).toHaveTextContent('전체 10개');
    expect(count).toHaveAttribute('aria-live', 'polite');
    const exec = within(teaching).getByRole('button', { name: '임원' });
    fireEvent.click(exec);
    expect(exec).toHaveAttribute('aria-pressed', 'true');
    expect(rows()).toHaveLength(1);
    expect(count).toHaveTextContent('10개 중 1개');
    // 번호는 원래 순서 그대로(3번째 과정)
    expect(rows()[0]).toHaveTextContent('03');
    fireEvent.click(within(teaching).getByRole('button', { name: '전체' }));
    expect(rows()).toHaveLength(10);
  });

  it('v3 산업군 막대 연동 — 강의 행이 있는 막대만 #teaching 링크, 누르면 그 산업군으로 걸러진다', () => {
    render(<Landing />);
    const links = document.querySelectorAll<HTMLAnchorElement>('#audience [data-bar-link]');
    // 전자/반도체 · 노원 미래산업고 · 그룹 연수원 · 제조/배터리 — 나머지 10개는 정적
    expect(links).toHaveLength(4);
    for (const a of links) expect(a).toHaveAttribute('href', '#teaching');
    const semi = screen.getByRole('link', { name: /전자\/반도체 329시간 — 강의 이력 4건 보기/ });
    fireEvent.click(semi);
    const teaching = document.getElementById('teaching')!;
    expect(teaching.querySelectorAll('[data-course-row]')).toHaveLength(4);
    expect(semi).toHaveAttribute('aria-current', 'true');
    // 산업군 칩으로 해제
    // 고르지 않은 막대 13개는 트랙이 흐려진다
    expect(document.querySelectorAll('#audience [data-dim="true"]')).toHaveLength(13);
    fireEvent.click(within(teaching).getByRole('button', { name: '산업군 전자/반도체 필터 해제' }));
    expect(teaching.querySelectorAll('[data-course-row]')).toHaveLength(10);
    // 칩이 사라져도 포커스는 「전체」 칩에 남는다
    expect(within(teaching).getByRole('button', { name: '전체' })).toHaveFocus();
  });

  it('v3 전문 분야 — 분야 이름은 토글 버튼, 하나만 눌린다', () => {
    render(<Landing />);
    const dev = screen.getByRole('button', { name: /개발 스택/ });
    const ai = screen.getByRole('button', { name: /AI · AX/ });
    expect(dev).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(dev);
    expect(dev).toHaveAttribute('aria-pressed', 'true');
    // 고른 분야만 또렷, 나머지 둘은 흐림 표시(data-dim)
    const groups = [...document.querySelectorAll('#expertise [data-expertise-group]')];
    expect(groups.map((g) => g.getAttribute('data-dim'))).toEqual(['false', 'true', 'true']);
    fireEvent.click(ai);
    expect(dev).toHaveAttribute('aria-pressed', 'false');
    expect(ai).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(ai);
    expect(ai).toHaveAttribute('aria-pressed', 'false');
    // 유리 카드 · 칩이 아니다
    expect(document.querySelector('#expertise [data-slot="card"]')).toBeNull();
  });

  it('v3 경력 — 불릿 6개는 3개만 보이고 「나머지 3개 더 보기」로 편다', () => {
    render(<Landing />);
    const first = document.querySelector('#career ol > li')!;
    expect(first.querySelectorAll('ul > li')).toHaveLength(3);
    const more = within(first as HTMLElement).getByRole('button', { name: '나머지 3개 더 보기' });
    expect(more).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(more);
    expect(first.querySelectorAll('ul > li')).toHaveLength(6);
    expect(within(first as HTMLElement).getByRole('button', { name: '접기' })).toHaveAttribute('aria-expanded', 'true');
    // 불릿이 적은 항목에는 버튼이 없다
    expect(document.querySelectorAll('#career ol > li button')).toHaveLength(1);
  });

  it('v3 스파크라인 스크럽 — slider, 기본은 가장 최근 점, 좌우 화살표로 이동, 누적 합 숫자는 보여주지 않는다', () => {
    render(<Landing />);
    const slider = screen.getByRole('slider', { name: '과정 시작일 순으로 살펴보기' });
    const readout = document.querySelector('#about [data-slot="spark-readout"]')!;
    expect(slider).toHaveAttribute('aria-valuemax', '9'); // 10개 과정, 같은 시작일 2개가 한 점
    expect(slider).toHaveAttribute('aria-valuenow', '9');
    expect(readout).toHaveTextContent('AI-EXPERT PBL 멘토링 (3일)');
    fireEvent.keyDown(slider, { key: 'Home' });
    expect(slider).toHaveAttribute('aria-valuenow', '1');
    expect(readout).toHaveTextContent('파이썬 기초 과정 및 데이터 시각화 교육');
    fireEvent.keyDown(slider, { key: 'ArrowLeft' });
    expect(slider).toHaveAttribute('aria-valuenow', '1');
    expect(readout.textContent).not.toMatch(/누적/);
    expect(document.querySelector('#about svg text')).toBeNull();
  });

  it('v3 이메일 복사 — 클립보드에 주소를 넣는다', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    render(<Landing />);
    fireEvent.click(screen.getByRole('button', { name: /이메일 주소 복사/ }));
    await waitFor(() => expect(writeText).toHaveBeenCalledWith('sangwon.lee@buddle.it.kr'));
  });

  it('v3 이메일 복사 — 클립보드를 쓸 수 없으면 mailto 로 넘긴다', async () => {
    Object.defineProperty(navigator, 'clipboard', { value: { writeText: vi.fn().mockRejectedValue(new Error('denied')) }, configurable: true });
    const assign = vi.fn();
    const original = window.location;
    Object.defineProperty(window, 'location', { value: { ...original, assign }, configurable: true });
    render(<Landing />);
    fireEvent.click(screen.getByRole('button', { name: /이메일 주소 복사/ }));
    await waitFor(() => expect(assign).toHaveBeenCalledWith('mailto:sangwon.lee@buddle.it.kr'));
    Object.defineProperty(window, 'location', { value: original, configurable: true });
  });
});
