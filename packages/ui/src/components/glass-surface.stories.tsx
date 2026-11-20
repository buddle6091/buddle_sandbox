import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Mic, Pause, Square } from 'lucide-react';

import { GlassSurface } from './glass-surface';

/**
 * 렌즈 굴절은 뒤 배경이 화려해야 보인다 — 스토리 배경은 토큰 색 그라디언트(accent · tertiary · secondary).
 * 굴절은 Chromium 에서만. Safari · Firefox 는 blur 폴백을 본다.
 */
const Backdrop = ({ children }: { children: React.ReactNode }) => (
  <div className="relative flex min-h-[420px] w-[min(720px,90vw)] items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-accent-default via-accent-tertiary to-accent-secondary p-10">
    <div aria-hidden="true" className="absolute inset-0 grid grid-cols-6 gap-3 p-6 opacity-70">
      {Array.from({ length: 18 }, (_, i) => (
        <span key={i} className="rounded-md bg-bg-page" style={{ height: 18 + ((i * 37) % 60) }} />
      ))}
    </div>
    <div className="relative flex flex-col items-center gap-6">{children}</div>
  </div>
);

const meta = {
  title: 'Components/GlassSurface',
  component: GlassSurface,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof GlassSurface>;

export default meta;
type Story = StoryObj<typeof meta>;

function RecorderDemo() {
  const [on, setOn] = React.useState(true);
  const [level, setLevel] = React.useState(0.6);
  return (
    <Backdrop>
      <GlassSurface className="flex h-16 items-center gap-3 pr-5 pl-2">
        <GlassSurface
          as="button"
          type="button"
          variant="circle"
          interactive
          backdrop="none"
          glow={on ? level : 0}
          aria-pressed={on}
          aria-label={on ? '녹음 멈추기' : '녹음 시작'}
          onClick={() => setOn((v) => !v)}
          className="focus-ring flex size-12 items-center justify-center"
        >
          {on ? <Square className="size-4" /> : <Mic className="size-5" />}
        </GlassSurface>
        <span className="font-mono text-label tabular-nums">{on ? '00:42' : '대기'}</span>
        <Pause aria-hidden="true" className="size-4 text-fg-muted" />
      </GlassSurface>
      <label className="flex items-center gap-3 rounded-full bg-bg-default px-4 py-2 text-label text-fg-default">
        glow level
        <input type="range" min={0} max={1} step={0.05} value={level} onChange={(e) => setLevel(Number(e.target.value))} />
      </label>
    </Backdrop>
  );
}

/** glass recorder — pill 안에 circle 버튼(더 강한 렌즈 + 별도 하이라이트), glow level 슬라이더 */
export const Recorder: Story = {
  render: () => <RecorderDemo />,
};

/** 세기 비교 — intensity 0 · .5 · 1 */
export const Intensity: Story = {
  render: () => (
    <Backdrop>
      {[0, 0.5, 1].map((i) => (
        <GlassSurface key={i} intensity={i} className="flex h-14 w-72 items-center justify-center text-label">
          intensity {i}
        </GlassSurface>
      ))}
    </Backdrop>
  ),
};

/** 링크 · 버튼 — 젤리(hover 늘고 눌림, press 더) */
export const Interactive: Story = {
  render: () => (
    <Backdrop>
      <GlassSurface as="a" href="#" interactive className="focus-ring inline-flex h-12 items-center px-6 text-body font-semibold">
        교육 이력 보기
      </GlassSurface>
      <GlassSurface as="button" type="button" variant="circle" interactive glow={0.4} aria-label="재생" className="focus-ring flex size-14 items-center justify-center">
        <Mic className="size-5" />
      </GlassSurface>
    </Backdrop>
  ),
};

/** density · backdrop — clear(기본) / dense(본문 위 글자 표면) / backdrop medium(compact 390 에서 불투명) / none */
export const DensityBackdrop: Story = {
  name: 'density · backdrop',
  render: () => (
    <Backdrop>
      <GlassSurface className="flex h-14 w-80 items-center justify-center text-label">density clear (기본)</GlassSurface>
      <GlassSurface density="dense" className="flex h-14 w-80 items-center justify-center text-label">
        density dense — TabBar
      </GlassSurface>
      <GlassSurface backdrop="medium" className="flex h-14 w-80 items-center justify-center text-label">
        backdrop medium — 390 에서 불투명
      </GlassSurface>
      <GlassSurface backdrop="none" glow={0.4} className="flex h-14 w-80 items-center justify-center text-label">
        backdrop none + glow .4
      </GlassSurface>
    </Backdrop>
  ),
};

export const RecorderDark: Story = { ...Recorder, name: 'Recorder — dark', globals: { theme: 'dark' } };
export const IntensityDark: Story = { ...Intensity, name: 'Intensity — dark', globals: { theme: 'dark' } };
export const InteractiveDark: Story = { ...Interactive, name: 'Interactive — dark', globals: { theme: 'dark' } };
export const DensityBackdropDark: Story = { ...DensityBackdrop, name: 'density · backdrop — dark', globals: { theme: 'dark' } };
