'use client';

import * as React from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';

import { mixToFades, stepMix } from '../fx/theme-mix';
import { scrollStore } from '../scroll/store';
import { heroState } from './hero-state';
import type { Palette } from './palette';
import { SceneDark } from './scene-dark';
import { SceneLight } from './scene-light';

/**
 * 히어로 리그 — 두 장면을 함께 두고 mix 로 크로스페이드(약 1초).
 * 입력: 포인터 → 그룹 기울기(감쇠), 스크롤 → 회전 · 위로 이동 · 0.75배까지 축소.
 * reduced-motion: 시간 정지 · 포인터 무시 · 테마 전환 즉시. 우선순위 −1 로 장면들보다 먼저 돈다.
 */
export function HeroRig({ palette, dark, reduce }: { palette: Palette; dark: boolean; reduce: boolean }) {
  const group = React.useRef<THREE.Group>(null);
  const invalidate = useThree((s) => s.invalidate);
  const gl = useThree((s) => s.gl);
  const tilt = React.useRef({ rx: 0, ry: 0 });

  React.useEffect(() => {
    heroState.reduce = reduce;
    if (reduce) {
      heroState.mix = dark ? 1 : 0;
      heroState.fades = mixToFades(heroState.mix);
    }
    invalidate();
  }, [dark, reduce, invalidate]);

  React.useEffect(() => {
    if (reduce) return;
    const onPointer = (e: PointerEvent) => {
      heroState.px = (e.clientX / window.innerWidth) * 2 - 1;
      heroState.py = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onPointer, { passive: true });
    return () => window.removeEventListener('pointermove', onPointer);
  }, [reduce]);

  useFrame((_, dt) => {
    const step = Math.min(0.1, dt);
    const target: 0 | 1 = dark ? 1 : 0;
    const before = heroState.mix;
    heroState.mix = stepMix(heroState.mix, target, step, reduce);
    if (heroState.mix !== before) heroState.fades = mixToFades(heroState.mix);
    if (reduce) {
      if (group.current) group.current.rotation.set(0, 0, 0);
      return;
    }
    heroState.t += step;
    const sy = scrollStore.scrollY;
    const tx = heroState.py * 0.35;
    const ty = heroState.px * 0.5;
    tilt.current.rx += (tx - tilt.current.rx) * Math.min(1, step * 3);
    tilt.current.ry += (ty - tilt.current.ry) * Math.min(1, step * 3);
    const g = group.current;
    if (g) {
      g.rotation.x = tilt.current.rx + sy * 0.0008;
      g.rotation.y = tilt.current.ry + heroState.t * 0.12;
      g.position.y = sy * 0.0012;
      const sc = Math.max(0.75, 1 - sy * 0.0002);
      g.scale.setScalar(sc);
    }
    // 테마 전환 중에는 demand 모드여도 다음 프레임을 요청해 크로스페이드가 끝까지 간다
    if (heroState.mix !== target) invalidate();
  }, -1);

  return (
    <group ref={group}>
      <SceneLight palette={palette} />
      <SceneDark palette={palette} pixelRatio={gl.getPixelRatio()} />
    </group>
  );
}
