import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * design.md 토큰 이름을 tailwind-merge 에 알려준다.
 *
 * 기본 설정의 tailwind-merge 는 `text-label` 같은 이름을 모르므로 "텍스트 색"으로 분류하고,
 * 뒤에 오는 `text-accent-fg-on` 과 충돌한다며 지워버린다 — 에러 없이 타이포가 빠진다.
 * 여기 등록한 이름은 올바른 그룹(font-size / color / shadow …)으로 분류된다.
 * packages/tokens 에 토큰을 추가하면 여기도 같이 늘린다.
 */
export const TOKEN_TEXT_STYLES = [
  'display',
  'h1',
  'h2',
  'h3',
  'body-lg',
  'body',
  'body-sm',
  'label',
  'caption',
  'code',
] as const;

export const TOKEN_COLORS = [
  'bg-page',
  'bg-default',
  'bg-subtle',
  'bg-muted',
  'fg-default',
  'fg-body',
  'fg-muted',
  'fg-subtle',
  'fg-link',
  'border-default',
  'border-strong',
  'bg-inverse',
  'fg-inverse',
  'overlay-bg',
  'accent-default',
  'accent-hover',
  'accent-subtle-bg',
  'accent-fg-on',
  'accent-fg-strong',
  'accent-secondary',
  'accent-tertiary',
  'danger-default',
  'success-default',
  'warning-default',
  'glass-subtle-bg',
  'glass-subtle-border',
  'glass-base-bg',
  'glass-base-border',
  'glass-foot',
  'glass-solid-bg',
  'glass-solid-border',
  'glass-fallback-bg',
  'glaze-tint',
  'glaze-celadon',
] as const;

type CustomGroups = 'glass' | 'focus-ring' | 'touch-target' | 'bg-image';

const twMerge = extendTailwindMerge<CustomGroups>({
  extend: {
    theme: {
      text: [...TOKEN_TEXT_STYLES],
      color: [...TOKEN_COLORS],
      shadow: ['sm', 'md', 'lg', 'glass', 'ring', 'intaglio'],
      radius: ['sm', 'md', 'lg', 'xl', 'full'],
      blur: ['glass-sm', 'glass-md', 'glass-lg'],
      ease: ['bs'],
      container: ['landing', 'content'],
      breakpoint: ['medium', 'expanded', 'wide'],
    },
    classGroups: {
      // src/styles.css 의 @utility — 서로 배타적인 유리 단계는 한 그룹
      glass: ['glass-subtle', 'glass-base', 'glass-base-flat', 'glass-solid'],
      'focus-ring': ['focus-ring'],
      'touch-target': ['touch-target'],
      'bg-image': ['bg-glaze-pool', 'bg-orb-primary', 'bg-orb-tertiary', 'bg-orb-secondary'],
    },
  },
});

/** shadcn 표준 `cn` — clsx 로 합치고 tailwind-merge 로 충돌을 정리한다. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
