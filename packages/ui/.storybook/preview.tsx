import type { Decorator, Preview } from '@storybook/react-vite';
import { useEffect } from 'react';
import '../src/styles.css';

/**
 * design.md §3.1 검증 뷰포트. 390 은 iPhone 14 — 이 폭에서 가로 스크롤 0 이 규칙이다.
 */
export const VIEWPORTS = {
  compact: { name: 'compact 390', styles: { width: '390px', height: '844px' }, type: 'mobile' },
  medium: { name: 'medium 768', styles: { width: '768px', height: '1024px' }, type: 'tablet' },
  expanded: { name: 'expanded 1280', styles: { width: '1280px', height: '800px' }, type: 'desktop' },
  wide: { name: 'wide 1440', styles: { width: '1440px', height: '900px' }, type: 'desktop' },
} as const;

/**
 * 테마는 토큰 레이어의 명시적 선택 경로(`data-theme`)로 토글한다.
 * 라이트는 `data-theme="light"` 를 명시해 시스템 다크를 무시하게 만든다(스토리 재현성).
 */
function ThemeSync({ theme }: { theme: 'light' | 'dark' }) {
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  }, [theme]);
  return null;
}

const withTheme: Decorator = (Story, context) => {
  const theme = (context.globals.theme as 'light' | 'dark' | undefined) ?? 'light';
  return (
    <>
      <ThemeSync theme={theme} />
      <Story />
    </>
  );
};

/** 페이지 배경(bg/page) 위에 올려 유리가 실제 맥락에서 보이게 한다. */
const withPage: Decorator = (Story, context) => {
  const padded = context.parameters.layout !== 'fullscreen';
  return (
    <div className={padded ? 'min-h-dvh bg-bg-page p-6' : 'min-h-dvh bg-bg-page'}>
      <Story />
    </div>
  );
};

const preview: Preview = {
  globalTypes: {
    theme: {
      description: '라이트/다크 (data-theme)',
      toolbar: {
        title: 'Theme',
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: 'light', viewport: { value: 'expanded', isRotated: false } },
  decorators: [withPage, withTheme],
  parameters: {
    viewport: { options: VIEWPORTS },
    backgrounds: { disable: true },
    a11y: { test: 'error' },
    controls: { expanded: true },
  },
};

export default preview;
