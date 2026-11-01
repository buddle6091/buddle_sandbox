'use client';

import * as React from 'react';
import { Canvas } from '@react-three/fiber';

import { useThemeMode } from '@sandbox/ui/hooks/use-theme-mode';

import { LANDING } from '../content/landing';
import { MQ_REDUCED_MOTION, useMedia } from '../observe/use-media';
import { HeroRig } from './hero-rig';
import { readPalette, type Palette } from './palette';

function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

/**
 * 히어로 우측 캔버스 — next/dynamic(ssr:false) 로만 로드된다.
 * frameloop: 히어로 in-view && reduced-motion 아님 → always, 그 외 demand(테마·리사이즈에만 그림).
 * 테마가 바뀌면 팔레트를 다시 읽는다(useThemeMode.set 이 data-theme 을 동기 적용한 뒤 리렌더).
 */
export function HeroCanvas({ inView }: { inView: boolean }) {
  const { resolved } = useThemeMode();
  const reduce = useMedia(MQ_REDUCED_MOTION);
  // 1024~1180 구간은 캔버스 폭이 좁아 카메라를 조금 뒤로
  const narrow = !useMedia('(min-width: 1180px)');
  const [webgl] = React.useState(() => hasWebGL());
  const palette: Palette = React.useMemo(() => readPalette(), [resolved]); // eslint-disable-line react-hooks/exhaustive-deps -- resolved 가 바뀌면 CSS 변수가 바뀐다

  if (!webgl) return null;
  const dark = resolved === 'dark';
  const label = dark ? LANDING.hero.canvasLabel.dark : LANDING.hero.canvasLabel.light;

  return (
    <div data-slot="hero-canvas" role="img" aria-label={label} className="absolute inset-0">
      <Canvas
        frameloop={inView && !reduce ? 'always' : 'demand'}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0, narrow ? 8.2 : 7], fov: 35, near: 0.1, far: 100 }}
        style={{ background: 'transparent' }}
      >
        <HeroRig palette={palette} dark={dark} reduce={reduce} />
      </Canvas>
    </div>
  );
}
