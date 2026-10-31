import { cn } from './utils';

describe('cn — tailwind-merge 가 design.md 토큰을 올바른 그룹으로 분류한다', () => {
  it('클래스를 합치고 Tailwind 충돌은 뒤가 이긴다', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4');
    expect(cn('text-fg-muted', false && 'hidden', 'bg-bg-default')).toBe('text-fg-muted bg-bg-default');
  });

  it('타이포 토큰과 텍스트 색 토큰은 충돌하지 않는다 (회귀: text-label 이 사라지던 버그)', () => {
    expect(cn('text-label', 'text-accent-fg-on')).toBe('text-label text-accent-fg-on');
    expect(cn('text-accent-fg-on', 'text-caption')).toBe('text-accent-fg-on text-caption');
  });

  it('타이포 토큰끼리는 충돌한다', () => {
    expect(cn('text-label', 'text-body')).toBe('text-body');
  });

  it('색 토큰끼리는 충돌한다', () => {
    expect(cn('bg-bg-default', 'bg-accent-default')).toBe('bg-accent-default');
    expect(cn('text-fg-default', 'text-fg-muted')).toBe('text-fg-muted');
    expect(cn('border-border-default', 'border-accent-default')).toBe('border-accent-default');
  });

  it('shadow / radius / blur / ease 토큰', () => {
    expect(cn('shadow-md', 'shadow-glass')).toBe('shadow-glass');
    expect(cn('rounded-md', 'rounded-xl')).toBe('rounded-xl');
    expect(cn('backdrop-blur-glass-sm', 'backdrop-blur-glass-lg')).toBe('backdrop-blur-glass-lg');
    expect(cn('ease-linear', 'ease-bs')).toBe('ease-bs');
  });

  it('유리 단계 유틸리티는 서로 배타적이다', () => {
    expect(cn('glass-base', 'glass-solid')).toBe('glass-solid');
    expect(cn('glass-base', 'text-fg-default')).toBe('glass-base text-fg-default');
  });

  it('반응형 variant 를 보존한다', () => {
    expect(cn('h-11', 'expanded:h-10')).toBe('h-11 expanded:h-10');
    expect(cn('expanded:h-10', 'expanded:h-12')).toBe('expanded:h-12');
  });
});
