'use client';

import * as React from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload } from '@react-three/drei';

import { shouldRender3D, type RenderMode } from '../scroll/progress';
import { readPalette, type Palette } from './palette';
import { Scene } from './scene';

function detect(): { mode: RenderMode; palette: Palette | null } {
  let webgl = false;
  try {
    const c = document.createElement('canvas');
    webgl = !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    webgl = false;
  }
  const mode = shouldRender3D({
    webgl,
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    compact: !window.matchMedia('(min-width: 600px)').matches,
  });
  return { mode, palette: mode ? readPalette() : null };
}

/**
 * 고정 배경 캔버스 1장. next/dynamic(ssr:false) 로만 로드된다.
 * frameloop="demand": 스크롤 스토어 변화·리사이즈·테마 변경에만 그린다(Scene 안의 Rig 가 invalidate).
 */
export function HeroCanvas() {
  // ssr:false 로만 로드되므로 첫 렌더에서 바로 감지한다(effect 안 setState 금지)
  const [env, setEnv] = React.useState<{ mode: RenderMode; palette: Palette | null }>(() => detect());

  React.useEffect(() => {
    const mql = [
      window.matchMedia('(prefers-reduced-motion: reduce)'),
      window.matchMedia('(min-width: 600px)'),
      window.matchMedia('(prefers-color-scheme: dark)'),
    ];
    const update = () => setEnv(detect());
    for (const m of mql) m.addEventListener('change', update);
    const obs = new MutationObserver(update); // data-theme 토글
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class'] });
    return () => {
      for (const m of mql) m.removeEventListener('change', update);
      obs.disconnect();
    };
  }, []);

  if (!env.mode || !env.palette) return null;

  return (
    <div data-slot="hero-canvas" aria-hidden="true">
      <Canvas
        frameloop="demand"
        dpr={env.mode === 'lite' ? 1 : [1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0.6, 7], fov: 32, near: 0.1, far: 40 }}
        performance={{ min: 0.5 }}
        onCreated={({ gl }) => {
          gl.localClippingEnabled = true; // 유약 수위 클리핑
        }}
        style={{ background: 'transparent' }}
      >
        <Scene mode={env.mode} palette={env.palette} />
        <Preload all />
      </Canvas>
    </div>
  );
}
