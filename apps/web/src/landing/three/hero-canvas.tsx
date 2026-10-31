'use client';

import * as React from 'react';
import { Canvas } from '@react-three/fiber';

import { useThemeMode } from '@sandbox/ui/hooks/use-theme-mode';

import { LANDING } from '../content/landing';
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

function useMedia(query: string) {
  const subscribe = React.useCallback(
    (cb: () => void) => {
      const m = window.matchMedia(query);
      m.addEventListener('change', cb);
      return () => m.removeEventListener('change', cb);
    },
    [query],
  );
  return React.useSyncExternalStore(subscribe, () => window.matchMedia(query).matches, () => false);
}

/**
 * 히어로 우측 캔버스 — next/dynamic(ssr:false) 로만 로드된다.
 * frameloop: 히어로 in-view && reduced-motion 아님 → always, 그 외 demand(테마·리사이즈에만 그림).
 * 테마가 바뀌면 팔레트를 다시 읽는다(useThemeMode.set 이 data-theme 을 동기 적용한 뒤 리렌더).
 */
export function HeroCanvas({ inView }: { inView: boolean }) {
  const { resolved } = useThemeMode();
  const reduce = useMedia('(prefers-reduced-motion: reduce)');
  const compact = !useMedia('(min-width: 520px)');
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
        camera={{ position: [0, 0, compact ? 8.2 : 7], fov: 35, near: 0.1, far: 100 }}
        style={{ background: 'transparent' }}
      >
        <HeroRig palette={palette} dark={dark} reduce={reduce} />
      </Canvas>
    </div>
  );
}
