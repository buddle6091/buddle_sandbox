'use client';

import * as React from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

import { heroState } from './hero-state';
import type { Palette } from './palette';

/* ── 백자(light): 청자 유약 방울 + 궤도 고리 2 + 위성 2 + 먼지 520 ── */

const BLOB_VERT = /* glsl */ `
  uniform float uTime; varying float vDisp; varying vec3 vN; varying vec3 vView; varying float vY;
  void main(){
    vec3 p = position;
    float d = 0.11*sin(2.6*p.x+uTime*0.9)*sin(2.3*p.y+uTime*0.7)*sin(2.1*p.z+uTime*0.8) + 0.05*sin(4.2*(p.x+p.z)+uTime*1.2);
    vDisp = d; vY = p.y;
    vec4 mv = modelViewMatrix * vec4(p + normal*d, 1.0);
    vN = normalize(normalMatrix*normal); vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;
const BLOB_FRAG = /* glsl */ `
  uniform vec3 uInner; uniform vec3 uRim; uniform vec3 uHi; uniform vec3 uGlaze; uniform float uFade;
  varying float vDisp; varying vec3 vN; varying vec3 vView; varying float vY;
  void main(){
    float fr = pow(1.0-max(dot(normalize(vN),normalize(vView)),0.0),2.0);
    vec3 pool = mix(uInner, mix(uInner,uGlaze,0.45), smoothstep(0.6,-1.2,vY));
    vec3 c = mix(pool, uRim, fr*0.85);
    c += uHi*smoothstep(0.03,0.14,vDisp)*0.4;
    c = mix(c, uRim, (0.5+0.5*sin(vDisp*70.0))*0.06);
    gl_FragColor = vec4(c, mix(0.92,1.0,fr)*uFade);
  }
`;

/** 셰이더 uniforms — 프레임마다 바뀌므로 모듈 변수(씬은 한 번에 하나) */
const uniforms = {
  uTime: { value: 0 },
  uFade: { value: 1 },
  uInner: { value: new THREE.Color() },
  uRim: { value: new THREE.Color() },
  uHi: { value: new THREE.Color() },
  uGlaze: { value: new THREE.Color() },
};
/**
 * 재질은 직접 생성해 `uniforms` 참조를 공유한다.
 * JSX <shaderMaterial uniforms={...}> 로 넘기면 R3F 가 다른 객체를 붙여 useFrame 의 갱신이 셰이더에 닿지 않는다(실측).
 */
const blobMaterial = new THREE.ShaderMaterial({ uniforms, vertexShader: BLOB_VERT, fragmentShader: BLOB_FRAG, transparent: true, depthWrite: false });

function ringPoints(r: number) {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i < 160; i++) {
    const a = (i / 160) * Math.PI * 2;
    pts.push(new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r, 0));
  }
  return new THREE.BufferGeometry().setFromPoints(pts);
}

function dustPositions(n: number) {
  const pos = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const u = Math.random() * 2 - 1;
    const th = Math.random() * Math.PI * 2;
    const rad = 2.4 + Math.random() * 1.2;
    const s = Math.sqrt(1 - u * u);
    pos[i * 3] = s * Math.cos(th) * rad;
    pos[i * 3 + 1] = u * rad;
    pos[i * 3 + 2] = s * Math.sin(th) * rad;
  }
  return pos;
}

export function SceneLight({ palette }: { palette: Palette }) {
  const group = React.useRef<THREE.Group>(null);
  const r1 = React.useRef<THREE.LineLoop>(null);
  const r2 = React.useRef<THREE.LineLoop>(null);
  const moon1 = React.useRef<THREE.Mesh>(null);
  const moon2 = React.useRef<THREE.Mesh>(null);
  const dust = React.useRef<THREE.Points>(null);
  const ringMat1 = React.useRef<THREE.LineBasicMaterial>(null);
  const ringMat2 = React.useRef<THREE.LineBasicMaterial>(null);
  const moonMat = React.useRef<THREE.MeshBasicMaterial>(null);
  const dustMat = React.useRef<THREE.PointsMaterial>(null);

  // 팔레트(테마) 변경은 effect 에서 모듈 uniforms 에 반영 — useFrame 이 mutate 하는 값은 모듈 변수여야 한다(lint)
  React.useEffect(() => {
    uniforms.uInner.value.set(palette.celadonInner);
    uniforms.uRim.value.set(palette.accent);
    uniforms.uHi.value.set(palette.highlight);
    uniforms.uGlaze.value.set(palette.celadon);
  }, [palette]);
  const blobGeo = React.useMemo(() => new THREE.IcosahedronGeometry(1.35, 48), []);
  const ringGeo1 = React.useMemo(() => ringPoints(2.05), []);
  const ringGeo2 = React.useMemo(() => ringPoints(2.45), []);
  const dustGeo = React.useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(dustPositions(520), 3));
    return g;
  }, []);

  useFrame(() => {
    const { t, fades } = heroState;
    const lf = fades.lf;
    uniforms.uTime.value = t;
    uniforms.uFade.value = lf;
    if (group.current) {
      group.current.visible = fades.lightVisible;
      group.current.scale.setScalar(fades.lightScale);
    }
    if (ringMat1.current) ringMat1.current.opacity = 0.3 * lf;
    if (ringMat2.current) ringMat2.current.opacity = 0.3 * lf;
    if (moonMat.current) moonMat.current.opacity = lf;
    if (dustMat.current) dustMat.current.opacity = 0.45 * lf;
    if (r1.current) r1.current.rotation.z = t * 0.25;
    if (r2.current) r2.current.rotation.z = -t * 0.18;
    if (moon1.current) moon1.current.position.set(Math.cos(t * 0.6) * 2.05, Math.sin(t * 0.6) * 2.05, 0);
    if (moon2.current) moon2.current.position.set(Math.cos(-t * 0.45 + 2) * 2.45, Math.sin(-t * 0.45 + 2) * 2.45, 0);
    if (dust.current) dust.current.rotation.y = t * 0.03;
  });

  return (
    <group ref={group}>
      <mesh geometry={blobGeo} material={blobMaterial} />
      <lineLoop ref={r1} geometry={ringGeo1} rotation={[1.15, 0.25, 0]}>
        <lineBasicMaterial ref={ringMat1} color={palette.accent} transparent opacity={0.3} />
        <mesh ref={moon1}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshBasicMaterial ref={moonMat} color={palette.celadon} transparent />
        </mesh>
      </lineLoop>
      <lineLoop ref={r2} geometry={ringGeo2} rotation={[1.45, -0.6, 0]}>
        <lineBasicMaterial ref={ringMat2} color={palette.accent} transparent opacity={0.3} />
        <mesh ref={moon2}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshBasicMaterial color={palette.celadon} transparent />
        </mesh>
      </lineLoop>
      <points ref={dust} geometry={dustGeo}>
        <pointsMaterial ref={dustMat} color={palette.accent} size={0.028} transparent opacity={0.45} sizeAttenuation depthWrite={false} />
      </points>
    </group>
  );
}
