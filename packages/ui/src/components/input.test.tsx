import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Input } from './input';
import { Label } from './label';
import { Textarea } from './textarea';
import { expectTokenOnly } from '../test-utils/class-rules';

describe('Input — design.md §6.2', () => {
  it('textbox 로 렌더되고 입력을 전달한다', async () => {
    const onChange = vi.fn();
    render(<Input placeholder="닉네임" onChange={onChange} />);
    const el = screen.getByRole('textbox');
    await userEvent.type(el, '버들');
    expect(onChange).toHaveBeenCalled();
    expect(el).toHaveValue('버들');
    expect(el).toHaveAttribute('placeholder', '닉네임');
  });

  it('치수·표면 — 40h(compact/medium 44), 좌우 space/3, radius/md, 음각, compact 16px', () => {
    render(<Input />);
    const el = screen.getByRole('textbox');
    expect(el).toHaveClass('h-11', 'expanded:h-10', 'px-3', 'rounded-md');
    expect(el).toHaveClass('bg-bg-default', 'shadow-intaglio', 'border-border-default');
    expect(el).toHaveClass('placeholder:text-fg-subtle');
    // iOS 자동 확대 방지: compact 에서 16px 미만 금지. medium 이상은 body(15).
    expect(el).toHaveClass('text-[16px]', 'medium:text-body');
    expectTokenOnly(el.className);
  });

  it('focus 는 accent 테두리 + shadow/ring', () => {
    render(<Input />);
    const el = screen.getByRole('textbox');
    expect(el).toHaveClass('focus-visible:border-accent-default', 'focus-visible:shadow-ring');
  });

  it('error — danger 테두리 + caption 메시지 + aria-invalid/aria-describedby', () => {
    render(<Input error="제목을 입력해 주세요." />);
    const el = screen.getByRole('textbox');
    expect(el).toHaveAttribute('aria-invalid', 'true');
    expect(el).toHaveClass('aria-invalid:border-danger-default');
    const msg = screen.getByText('제목을 입력해 주세요.');
    expect(msg).toHaveClass('text-caption', 'text-danger-default');
    expect(el).toHaveAttribute('aria-describedby', msg.id);
  });

  it('error 가 없으면 메시지 요소를 만들지 않는다', () => {
    const { container } = render(<Input />);
    expect(container.querySelectorAll('[data-slot="input-error"]')).toHaveLength(0);
  });

  it('disabled 는 50% opacity', () => {
    render(<Input disabled />);
    const el = screen.getByRole('textbox');
    expect(el).toBeDisabled();
    expect(el).toHaveClass('disabled:opacity-50');
  });

  it('id 와 Label 이 htmlFor 로 연결된다', () => {
    render(
      <>
        <Label htmlFor="nick">닉네임</Label>
        <Input id="nick" />
      </>,
    );
    expect(screen.getByLabelText('닉네임')).toBeInTheDocument();
    expect(screen.getByText('닉네임')).toHaveClass('text-label', 'text-fg-body');
  });
});

describe('Textarea — design.md §6.2', () => {
  it('min-h 80 + resize-y, Input 과 같은 표면', () => {
    render(<Textarea placeholder="댓글" />);
    const el = screen.getByRole('textbox');
    expect(el).toHaveClass('min-h-20', 'resize-y', 'bg-bg-default', 'shadow-intaglio', 'rounded-md');
    expect(el).toHaveClass('text-[16px]', 'medium:text-body');
    expectTokenOnly(el.className);
  });

  it('error 상태', () => {
    render(<Textarea error="댓글 내용을 입력해 주세요." />);
    const el = screen.getByRole('textbox');
    expect(el).toHaveAttribute('aria-invalid', 'true');
    expect(el).toHaveAttribute('aria-describedby', screen.getByText('댓글 내용을 입력해 주세요.').id);
  });

  it('maxLength 등 네이티브 속성을 전달한다', async () => {
    render(<Textarea maxLength={5} />);
    const el = screen.getByRole('textbox');
    await userEvent.type(el, '1234567');
    expect(el).toHaveValue('12345');
  });
});
