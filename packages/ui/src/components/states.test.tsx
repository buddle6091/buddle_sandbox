import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Button } from './button';
import { EmptyState } from './empty-state';
import { ErrorState } from './error-state';
import { SyncBanner } from './sync-banner';
import { expectTokenOnly } from '../test-utils/class-rules';

describe('EmptyState — STATES.md 공통: 제목 16/700 + 설명 body-sm muted + 행동 1개', () => {
  it('제목·설명·행동·점선 자리표시, 아이콘 없음', () => {
    render(
      <EmptyState
        title="아직 글이 없어요"
        description="첫 글을 쓰면 여기에 보여요."
        action={<Button>새 글 쓰기</Button>}
      />,
    );
    const title = screen.getByRole('heading', { name: '아직 글이 없어요' });
    expect(title).toHaveClass('font-bold');
    expect(screen.getByText('첫 글을 쓰면 여기에 보여요.')).toHaveClass('text-body-sm', 'text-fg-muted');
    expect(screen.getByRole('button', { name: '새 글 쓰기' })).toBeInTheDocument();
    const ph = document.querySelector('[data-slot="empty-placeholder"]');
    expect(ph).toHaveClass('border-dashed');
    expect(document.querySelector('svg')).toBeNull();
    expectTokenOnly((ph as HTMLElement).className);
  });

  it('검색 0건 — 입력값을 「」 로 감싼 제목', () => {
    render(<EmptyState title={<>「react 19」 검색 결과가 없어요</>} description="맞춤법을 확인하거나 다른 단어로 찾아 보세요." />);
    expect(screen.getByRole('heading')).toHaveTextContent('「react 19」 검색 결과가 없어요');
  });
});

describe('ErrorState — Badge warning + 「다시 시도」 primary + Mono caption 디버그', () => {
  it('구성과 재시도 콜백', async () => {
    const onRetry = vi.fn();
    render(<ErrorState title="글 목록을 불러오지 못했어요" onRetry={onRetry} debug="GET /posts · 503" />);
    expect(screen.getByText('오류')).toHaveAttribute('data-variant', 'warning');
    expect(screen.getByRole('heading', { name: '글 목록을 불러오지 못했어요' })).toBeInTheDocument();
    const retry = screen.getByRole('button', { name: '다시 시도' });
    expect(retry).toHaveAttribute('data-variant', 'primary');
    await userEvent.click(retry);
    expect(onRetry).toHaveBeenCalledTimes(1);
    expect(screen.getByText('GET /posts · 503')).toHaveClass('font-mono', 'text-caption', 'text-fg-muted');
  });

  it('role=alert 로 읽힌다', () => {
    render(<ErrorState title="실패" onRetry={() => undefined} />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});

describe('SyncBanner — 그리드 위 띠 1개', () => {
  it.each([
    ['warning', ['bg-warning-default/12', 'border-warning-default/40']],
    ['subtle', ['bg-bg-subtle', 'border-border-default']],
    ['danger', ['bg-danger-default/12', 'border-danger-default/40']],
    ['inverse', ['bg-bg-inverse', 'text-fg-inverse']],
  ] as const)('variant=%s', (variant, classes) => {
    render(<SyncBanner variant={variant}>구글 캘린더와 연결이 끊겼어요.</SyncBanner>);
    const el = screen.getByRole('status');
    for (const c of classes) expect(el).toHaveClass(c);
    expect(el).toHaveAttribute('data-variant', variant);
    expectTokenOnly(el.className);
  });

  it('액션 1개 (라벨 + onClick)', async () => {
    const onClick = vi.fn();
    render(
      <SyncBanner variant="danger" action={{ label: '다시 시도', onClick }}>
        일정을 불러오지 못했어요.
      </SyncBanner>,
    );
    await userEvent.click(screen.getByRole('button', { name: '다시 시도' }));
    expect(onClick).toHaveBeenCalled();
  });

  it('상태 점(dot) — warning/danger/success 색을 띠 좌측에', () => {
    render(
      <SyncBanner variant="inverse" dot="warning">
        오프라인 · 저장된 글을 보여주고 있어요
      </SyncBanner>,
    );
    const dot = document.querySelector('[data-slot="banner-dot"]');
    expect(dot).toHaveClass('bg-warning-default');
  });
});
