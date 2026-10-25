'use client';

import * as React from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer, MeshTransmissionMaterial } from '@react-three/drei';
import { damp, damp3 } from 'maath/easing';

import { KEYFRAMES, sample, snapSample, type RenderMode, type RigState } from '../scroll/progress';
import { scrollStore } from '../scroll/store';
import type { Palette } from './palette';

/** 리그 → 기물 사이의 현재 상태. 프레임마다 바뀌므로 React 상태가 아니라 모듈 변수. */
const rigState: { current: RigState } = { current: sample(KEYFRAMES, 0) };
/** 유약 수위 클리핑 평면 — y <= -constant 만 보인다. 씬은 한 번에 하나라 모듈 변수로 둔다. */
const glazePlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), -1.0);

/* ---------- 달항아리 프로필 (반지름, 높이) — 백자 moon jar ---------- */
const JAR_PROFILE: Array<[number, number]> = [
  [0.0, -1.15],
  [0.42, -1.15],
  [0.5, -1.1],
  [0.78, -0.95],
  [1.02, -0.62],
  [1.14, -0.2],
  [1.12, 0.22],
  [0.98, 0.62],
  [0.74, 0.9],
  [0.5, 1.02],
  [0.46, 1.12],
  [0.52, 1.18],
  [0.56, 1.22],
  [0.0, 1.22],
];

function useJarGeometry() {
  return React.useMemo(() => {
    // 스플라인으로 프로필을 촘촘히 → 각진 면 없이 매끈한 백자
    const ctrl = JAR_PROFILE.map(([r, y]) => new THREE.Vector2(r, y));
    const curve = new THREE.SplineCurve(ctrl.slice(1, -1));
    const pts = [ctrl[0], ...curve.getPoints(80), ctrl[ctrl.length - 1]];
    const geo = new THREE.LatheGeometry(pts, 180);
    geo.computeVertexNormals();
    return geo;
  }, []);
}

/* ---------- 캔버스 안 배경 — 오브젝트 뒤에만, 저알파 3색 (흰 배경에서 굴절이 보이게) ---------- */
const BACKDROP_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;
const BACKDROP_FRAG = /* glsl */ `
  uniform vec3 uA; uniform vec3 uB; uniform vec3 uC; uniform float uAlpha;
  varying vec2 vUv;
  void main() {
    // 좌상 blue → 우중 celadon → 하단 violet, 가장자리로 갈수록 투명 (블롭이 아니라 한 장의 비네팅 평면)
    float t = smoothstep(0.0, 1.0, vUv.x * 0.6 + (1.0 - vUv.y) * 0.4);
    vec3 col = mix(uA, uB, smoothstep(0.0, 0.55, t));
    col = mix(col, uC, smoothstep(0.55, 1.0, t));
    float d = distance(vUv, vec2(0.5, 0.45));
    float a = uAlpha * (1.0 - smoothstep(0.25, 0.6, d));
    gl_FragColor = vec4(col, a);
  }
`;

function Backdrop({ palette }: { palette: Palette }) {
  const uniforms = React.useMemo(
    () => ({
      uA: { value: new THREE.Color(palette.accent) },
      uB: { value: new THREE.Color(palette.celadon) },
      uC: { value: new THREE.Color(palette.violet) },
      uAlpha: { value: palette.dark ? 0.34 : 0.22 },
    }),
    [palette],
  );
  return (
    <mesh position={[0, 0, -3]} scale={[9, 7, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        vertexShader={BACKDROP_VERT}
        fragmentShader={BACKDROP_FRAG}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

/* ---------- 기물 + 유약 고임 + 유리 링 ---------- */
function Porcelain({ palette, mode }: { palette: Palette; mode: RenderMode }) {
  const geo = useJarGeometry();
  const jarRef = React.useRef<THREE.Group>(null);

  const ringRef = React.useRef<THREE.Group>(null);
  const ringMat = React.useRef<THREE.MeshPhysicalMaterial>(null);
  const lite = mode !== 'full';

  useFrame((_, dt) => {
    const s = rigState.current;
    const step = Math.min(dt, 1 / 30);
    if (jarRef.current) {
      damp(jarRef.current.rotation, 'y', s.jar.rot, 0.35, step);
      damp(jarRef.current.position, 'y', s.jar.y, 0.35, step);
      const sc = jarRef.current.scale.x;
      const n = THREE.MathUtils.damp(sc, s.jar.scale * (lite ? 0.55 : 1), 6, step);
      jarRef.current.scale.setScalar(n);
    }
    // 고임: 클리핑 평면의 수위가 아래에서 차오른다 (y <= level 만 보임)
    const level = -1.15 + s.glaze * 2.1;
    glazePlane.constant = THREE.MathUtils.damp(glazePlane.constant, level, 4, step);
    if (ringRef.current) {
      damp(ringRef.current.position, 'y', s.ring.y, 0.35, step);
      damp(ringRef.current.rotation, 'x', s.ring.tilt, 0.35, step);
      damp(ringRef.current.rotation, 'y', s.jar.rot * 0.4, 0.35, step);
      const r = THREE.MathUtils.damp(ringRef.current.scale.x, s.ring.radius, 5, step);
      ringRef.current.scale.setScalar(r);
    }
  });

  return (
    <group>
      <group ref={jarRef} position={[0, 0, 0]}>
        {/* 백자 — near-white, clearcoat, 청자 sheen */}
        <mesh geometry={geo} castShadow={!lite} receiveShadow={!lite}>
          <meshPhysicalMaterial
            color={palette.jar}
            roughness={0.38}
            metalness={0}
            clearcoat={1}
            clearcoatRoughness={0.18}
            sheen={0.5}
            sheenRoughness={0.6}
            sheenColor={palette.celadon}
            envMapIntensity={0.9}
          />
        </mesh>
        {/* 유약 고임 — 기물을 감싸는 얇은 셸을 수위(클리핑 평면) 아래에서만 보여 차오르게 한다 */}
        <mesh geometry={geo} scale={1.012}>
          <meshPhysicalMaterial
            color={palette.celadon}
            transparent
            opacity={0.34}
            roughness={0.2}
            clearcoat={1}
            depthWrite={false}
            clippingPlanes={[glazePlane]}
          />
        </mesh>
      </group>

      {/* 유리 링 — 유리 3단계 콘셉트의 'solid' 한 장. compact 는 굴절 없는 물리 재질 */}
      <group ref={ringRef} position={[0, 0.2, 0]} rotation={[Math.PI / 2.4, 0, 0]} scale={1.6}>
        <mesh>
          <torusGeometry args={[1, 0.035, 24, 160]} />
          {lite ? (
            <meshPhysicalMaterial
              ref={ringMat}
              color={palette.celadon}
              transparent
              opacity={0.55}
              roughness={0.15}
              clearcoat={1}
            />
          ) : (
            <MeshTransmissionMaterial
              samples={4}
              resolution={256}
              thickness={0.6}
              roughness={0.15}
              ior={1.45}
              chromaticAberration={0.02}
              anisotropy={0.1}
              color={palette.jar}
              attenuationColor={palette.celadon}
              attenuationDistance={1.5}
            />
          )}
        </mesh>
      </group>
    </group>
  );
}

/* ---------- 카메라 리그 — 스토어 구독 → invalidate, useFrame 에서 damp ---------- */
function Rig({ mode, offsetX }: { mode: RenderMode; offsetX: number }) {
  const invalidate = useThree((s) => s.invalidate);
  const camera = useThree((s) => s.camera);
  const target = React.useRef<RigState>(sample(KEYFRAMES, 0));
  const lookAt = React.useRef(new THREE.Vector3(0, 0, 0));

  React.useEffect(() => {
    const apply = (p: number) => {
      target.current = mode === 'static' ? snapSample(KEYFRAMES, p) : sample(KEYFRAMES, p);
      invalidate();
    };
    apply(scrollStore.progress);
    const off = scrollStore.subscribe(apply);
    const onResize = () => invalidate();
    window.addEventListener('resize', onResize);
    return () => {
      off();
      window.removeEventListener('resize', onResize);
    };
  }, [invalidate, mode]);

  useFrame((_, dt) => {
    const t = target.current;
    const step = Math.min(dt, 1 / 30);
    // 화면 프레이밍: full 은 기물이 우측(시선을 기물보다 0.95 왼쪽에), lite 는 기물이 위쪽(시선을 아래로) + 멀리
    const shiftX = offsetX - (offsetX ? 1.35 : 0);
    const shiftY = offsetX ? 0 : -1.35;
    const zoom = offsetX ? 1 : 1.7;
    const camTarget: [number, number, number] = [t.camera[0] + shiftX, t.camera[1] + shiftY, t.camera[2] * zoom];
    const lookTarget: [number, number, number] = [t.lookAt[0] + shiftX, t.lookAt[1] + shiftY, t.lookAt[2]];
    if (mode === 'static') {
      camera.position.set(...camTarget);
      lookAt.current.set(...lookTarget);
      camera.lookAt(lookAt.current);
      rigState.current = t;
      return;
    }
    damp3(camera.position, camTarget, 0.4, step);
    damp3(lookAt.current, lookTarget, 0.4, step);
    camera.lookAt(lookAt.current);
    rigState.current = t;
    // 수렴 전까지만 다음 프레임 요청(demand)
    const dist = camera.position.distanceTo(new THREE.Vector3(...camTarget));
    if (dist > 0.002) invalidate();
  });
  return null;
}

export function Scene({ mode, palette }: { mode: RenderMode; palette: Palette }) {
  // medium+ 에서는 기물을 오른쪽 1/3 지점에 둔다(카메라는 기물보다 왼쪽을 바라본다). compact 는 중앙 위쪽(텍스트 뒤)
  const offsetX = mode === 'lite' ? 0 : 1.9;
  return (
    <group position={[offsetX, 0, 0]}>
      <Backdrop palette={palette} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 5, 4]} intensity={1.1} castShadow={mode === 'full'} />
      <Environment resolution={mode === 'full' ? 256 : 64} background={false}>
        {/* 스튜디오 조명 3장 — HDR 네트워크 로드 없음 */}
        <Lightformer form="rect" intensity={2.2} position={[0, 4, 2]} scale={[6, 3, 1]} color={palette.jar} />
        <Lightformer form="rect" intensity={0.9} position={[-5, 1, 1]} scale={[2, 4, 1]} color={palette.celadon} />
        <Lightformer form="rect" intensity={0.7} position={[5, 0.5, -1]} scale={[2, 4, 1]} color={palette.violet} />
      </Environment>
      <Porcelain palette={palette} mode={mode} />
      <Rig mode={mode} offsetX={offsetX} />
    </group>
  );
}
