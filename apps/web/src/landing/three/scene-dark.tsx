'use client';

import * as React from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

import { heroState } from './hero-state';
import type { Palette } from './palette';

/* ── 흑유(dark): 흑요석 핵 + 청자 성운 원반 4,200 + 별먼지 900 + 빛무리 ── */

const CORE_VERT = /* glsl */ `
  varying vec3 vN; varying vec3 vView; varying vec3 vP;
  void main(){ vP = position; vec4 mv = modelViewMatrix*vec4(position,1.0);
    vN = normalize(normalMatrix*normal); vView = normalize(-mv.xyz); gl_Position = projectionMatrix*mv; }
`;
const CORE_FRAG = /* glsl */ `
  uniform float uTime; uniform float uFade; uniform vec3 uBase; uniform vec3 uBase2; uniform vec3 uGlaze; uniform vec3 uBlue; uniform vec3 uHi;
  varying vec3 vN; varying vec3 vView; varying vec3 vP;
  void main(){
    float ndv = max(dot(normalize(vN),normalize(vView)),0.0);
    float fr = pow(1.0-ndv,2.6);
    vec3 base = mix(uBase,uBase2,smoothstep(-1.0,1.0,vP.y));
    float band = smoothstep(0.92,1.0,0.5+0.5*sin(vP.y*7.0-uTime*0.6+sin(vP.x*3.0+uTime*0.3)));
    vec3 glaze = mix(uGlaze,uBlue,0.5+0.5*vP.x);
    vec3 c = base + glaze*fr*0.95 + glaze*band*0.18;
    float spec = pow(max(dot(normalize(vN),normalize(vec3(-0.4,0.6,0.7))),0.0),40.0);
    c += uHi*spec*0.35;
    gl_FragColor = vec4(c,uFade);
  }
`;
const DISK_VERT = /* glsl */ `
  attribute vec4 aData; uniform float uTime; uniform float uPR; uniform vec3 uGlaze; uniform vec3 uBlue; uniform vec3 uViolet; uniform vec3 uHi;
  varying vec3 vC; varying float vA;
  void main(){
    float r = aData.x; float a = aData.y + uTime*(0.55/pow(r,1.5));
    float y = aData.z + 0.06*sin(a*3.0+uTime*0.8+r*2.0);
    vec3 p = vec3(cos(a)*r, y, sin(a)*r);
    vec4 mv = modelViewMatrix*vec4(p,1.0);
    float h = aData.w;
    vC = mix(uGlaze,uBlue,smoothstep(1.6,3.4,r));
    vC = mix(vC,uViolet,step(0.92,h)*0.6);
    vC = mix(vC,uHi,step(0.985,h));
    vA = (0.35+0.65*smoothstep(3.6,1.5,r))*(0.6+0.4*sin(uTime*1.5+h*40.0));
    gl_PointSize = (1.4+h*2.6)*uPR*(7.0/-mv.z);
    gl_Position = projectionMatrix*mv;
  }
`;
const DISK_FRAG = /* glsl */ `
  uniform float uFade; varying vec3 vC; varying float vA;
  void main(){ vec2 q = gl_PointCoord-0.5; float d = length(q); float g = smoothstep(0.5,0.0,d);
    float a = g*vA*uFade;
    gl_FragColor = vec4(vC*a, a); }
`;
const HALO_VERT = /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }`;
const HALO_FRAG = /* glsl */ `
  uniform float uFade; uniform vec3 uGlaze; varying vec2 vUv;
  void main(){ float d = length(vUv-0.5)*2.0; float g = smoothstep(1.0,0.35,d)*smoothstep(0.25,0.55,d);
    float a = g*0.22*uFade;
    gl_FragColor = vec4(uGlaze*a, a); }
`;

/** 셰이더 uniforms — 프레임마다 바뀌므로 모듈 변수(씬은 한 번에 하나) */
const coreU = {
  uTime: { value: 0 },
  uFade: { value: 0 },
  uBase: { value: new THREE.Color() },
  uBase2: { value: new THREE.Color() },
  uGlaze: { value: new THREE.Color() },
  uBlue: { value: new THREE.Color() },
  uHi: { value: new THREE.Color() },
};
const diskU = {
  uTime: { value: 0 },
  uFade: { value: 0 },
  uPR: { value: 1 },
  uGlaze: { value: new THREE.Color() },
  uBlue: { value: new THREE.Color() },
  uViolet: { value: new THREE.Color() },
  uHi: { value: new THREE.Color() },
};
const haloU = { uFade: { value: 0 }, uGlaze: { value: new THREE.Color() } };
/** 재질 직접 생성 — uniforms 참조 공유(JSX shaderMaterial 은 다른 객체를 붙인다, scene-light 참고) */
const coreMaterial = new THREE.ShaderMaterial({ uniforms: coreU, vertexShader: CORE_VERT, fragmentShader: CORE_FRAG, transparent: true });
const diskMaterial = new THREE.ShaderMaterial({ uniforms: diskU, vertexShader: DISK_VERT, fragmentShader: DISK_FRAG, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
const haloMaterial = new THREE.ShaderMaterial({ uniforms: haloU, vertexShader: HALO_VERT, fragmentShader: HALO_FRAG, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });

function diskData(n: number) {
  const a = new Float32Array(n * 4);
  for (let k = 0; k < n; k++) {
    const rr = 1.45 + Math.pow(Math.random(), 1.6) * 2.1;
    a[k * 4] = rr;
    a[k * 4 + 1] = Math.random() * Math.PI * 2;
    a[k * 4 + 2] = (Math.random() + Math.random() + Math.random() - 1.5) * 0.12 * (rr - 1.0);
    a[k * 4 + 3] = Math.random();
  }
  return a;
}
function starPositions(n: number) {
  const sp = new Float32Array(n * 3);
  for (let j = 0; j < n; j++) {
    const u = Math.random() * 2 - 1;
    const th = Math.random() * Math.PI * 2;
    const sr = 4.2 + Math.random() * 3.5;
    const ss = Math.sqrt(1 - u * u);
    sp[j * 3] = ss * Math.cos(th) * sr;
    sp[j * 3 + 1] = u * sr;
    sp[j * 3 + 2] = ss * Math.sin(th) * sr;
  }
  return sp;
}

export function SceneDark({ palette, pixelRatio }: { palette: Palette; pixelRatio: number }) {
  const group = React.useRef<THREE.Group>(null);
  const stars = React.useRef<THREE.Points>(null);
  const starMat = React.useRef<THREE.PointsMaterial>(null);
  const halo = React.useRef<THREE.Mesh>(null);

  React.useEffect(() => {
    coreU.uBase.value.set(palette.obsidian);
    coreU.uBase2.value.set(palette.obsidianGlaze);
    coreU.uGlaze.value.set(palette.celadon);
    coreU.uBlue.value.set(palette.accent);
    coreU.uHi.value.set(palette.highlight);
    diskU.uGlaze.value.set(palette.celadon);
    diskU.uBlue.value.set(palette.accent);
    diskU.uViolet.value.set(palette.violet);
    diskU.uHi.value.set(palette.highlight);
    diskU.uPR.value = pixelRatio;
    haloU.uGlaze.value.set(palette.celadon);
  }, [palette, pixelRatio]);

  const diskGeo = React.useMemo(() => {
    const n = 4200;
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3), 3));
    g.setAttribute('aData', new THREE.BufferAttribute(diskData(n), 4));
    return g;
  }, []);
  const starGeo = React.useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(starPositions(900), 3));
    return g;
  }, []);

  useFrame(() => {
    const { t, fades } = heroState;
    const df = fades.df;
    coreU.uTime.value = t;
    coreU.uFade.value = df;
    diskU.uTime.value = t;
    diskU.uFade.value = df;
    haloU.uFade.value = df;
    if (group.current) {
      group.current.visible = fades.darkVisible;
      group.current.scale.setScalar(fades.darkScale);
    }
    if (starMat.current) starMat.current.opacity = 0.55 * df;
    if (stars.current) stars.current.rotation.y = t * 0.01;
    if (halo.current) halo.current.visible = fades.darkVisible;
  });

  return (
    <>
      <group ref={group}>
        <mesh material={coreMaterial}>
          <sphereGeometry args={[1, 64, 64]} />
        </mesh>
        <points geometry={diskGeo} material={diskMaterial} rotation={[0.42, 0, -0.32]} frustumCulled={false} />
        <points ref={stars} geometry={starGeo}>
          <pointsMaterial ref={starMat} color={palette.celadon} size={0.022} transparent opacity={0} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
        </points>
      </group>
      {/* 빛무리 — 그룹 밖(스케일 영향 없이 뒤에서 은은하게) */}
      <mesh ref={halo} material={haloMaterial} position={[0, 0, -0.2]}>
        <planeGeometry args={[4.6, 4.6]} />
      </mesh>
    </>
  );
}
