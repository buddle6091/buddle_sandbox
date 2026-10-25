/**
 * 스크롤 → 진행도 → 3D 상태. 전부 순수 함수(WebGL 없이 테스트).
 */
import { SECTION_IDS, type SectionId } from '../content/landing';

export const clamp01 = (n: number) => (Number.isFinite(n) ? Math.min(1, Math.max(0, n)) : 0);

/** 문서 전체 진행도 0~1 */
export function computeProgress(scrollY: number, scrollHeight: number, innerHeight: number) {
  const max = scrollHeight - innerHeight;
  if (max <= 0) return 0;
  return clamp01(scrollY / max);
}

export type SectionRange = { id: SectionId; from: number; to: number };

/** 섹션별 진행도 구간 — 섹션 높이 비율(랜딩 플랜 표). 0 에서 1 까지 빈틈 없이. */
const BOUNDS = [0, 0.15, 0.28, 0.42, 0.55, 0.65, 0.75, 0.87, 0.94, 1] as const;

export const SECTION_RANGES: SectionRange[] = SECTION_IDS.map((id, i) => ({
  id,
  from: BOUNDS[i],
  to: BOUNDS[i + 1],
}));

export function sectionAt(p: number) {
  const x = clamp01(p);
  const i = SECTION_RANGES.findIndex((r) => x >= r.from && x < r.to);
  return i === -1 ? SECTION_RANGES.length - 1 : i;
}

export function sectionLocal(p: number, r: SectionRange) {
  return clamp01((p - r.from) / (r.to - r.from));
}

/* ---------- 3D 리그 키프레임 ---------- */
export type Vec3 = [number, number, number];
export type RigState = {
  at: number;
  camera: Vec3;
  lookAt: Vec3;
  jar: { rot: number; y: number; scale: number };
  ring: { y: number; tilt: number; radius: number };
  /** 유약 고임 0~1 (아래 절반에서 차오름) */
  glaze: number;
};

const T = Math.PI / 4;

/** 섹션마다 하나. 카메라는 항상 z>0(기물 앞). 자동 회전 없음 — 스크롤에만 반응. */
export const KEYFRAMES: RigState[] = [
  // hero — 정면, 유약 아래
  { at: BOUNDS[0], camera: [0, 0.6, 7], lookAt: [0, 0.1, 0], jar: { rot: 0, y: 0, scale: 0.92 }, ring: { y: 0.2, tilt: Math.PI / 2.4, radius: 1.6 }, glaze: 0.1 },
  // stats — 살짝 우측, 링이 뒤로 펼쳐짐
  { at: BOUNDS[1], camera: [1.0, 0.9, 8.4], lookAt: [0, 0, 0], jar: { rot: T * 0.5, y: 0, scale: 0.82 }, ring: { y: -0.1, tilt: Math.PI / 2.1, radius: 1.9 }, glaze: 0.18 },
  // philosophy — 측면, 1/4 회전
  { at: BOUNDS[2], camera: [1.8, 0.4, 8.2], lookAt: [0, 0.2, 0], jar: { rot: T * 2, y: 0.1, scale: 0.8 }, ring: { y: 0.6, tilt: Math.PI / 3, radius: 1.5 }, glaze: 0.26 },
  // curriculum — 조금 위에서, 링 수평
  { at: BOUNDS[3], camera: [0.8, 2.0, 8.6], lookAt: [0, 0, 0], jar: { rot: T * 3, y: 0, scale: 0.78 }, ring: { y: 0.9, tilt: Math.PI / 2, radius: 1.8 }, glaze: 0.34 },
  // audience — 좌측, 광원 뒤로
  { at: BOUNDS[4], camera: [-1.4, 0.8, 8.4], lookAt: [0, 0.1, 0], jar: { rot: T * 4, y: 0, scale: 0.78 }, ring: { y: -0.4, tilt: Math.PI / 2.6, radius: 1.85 }, glaze: 0.42 },
  // mentoring — 상단
  { at: BOUNDS[5], camera: [-0.4, 2.6, 7.8], lookAt: [0, 0.2, 0], jar: { rot: T * 5, y: 0.05, scale: 0.8 }, ring: { y: 0.3, tilt: Math.PI / 2, radius: 1.4 }, glaze: 0.52 },
  // experience — 링이 타임라인 축처럼 세로
  { at: BOUNDS[6], camera: [1.4, 0.6, 8.8], lookAt: [0, 0, 0], jar: { rot: T * 6, y: 0, scale: 0.78 }, ring: { y: 0, tilt: Math.PI / 3.4, radius: 1.9 }, glaze: 0.64 },
  // feedback — 정면 복귀
  { at: BOUNDS[7], camera: [0.3, 0.7, 8.0], lookAt: [0, 0.1, 0], jar: { rot: T * 7, y: 0, scale: 0.84 }, ring: { y: 0.2, tilt: Math.PI / 2.4, radius: 1.7 }, glaze: 0.8 },
  // contact — 가까이, 유약 가득
  { at: BOUNDS[9], camera: [0, 0.2, 7.6], lookAt: [0, -0.9, 0], jar: { rot: T * 8, y: -0.05, scale: 0.88 }, ring: { y: 0.1, tilt: Math.PI / 2.4, radius: 1.5 }, glaze: 1 },
];

const smooth = (t: number) => t * t * (3 - 2 * t);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerp3 = (a: Vec3, b: Vec3, t: number): Vec3 => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];

/** 키프레임 사이를 smoothstep 보간. 키 위치에서는 그 키 자체를 돌려준다. */
export function sample(keys: RigState[], p: number): RigState {
  const x = clamp01(p);
  if (x <= keys[0].at) return keys[0];
  const last = keys[keys.length - 1];
  if (x >= last.at) return last;
  let i = 0;
  while (i < keys.length - 1 && !(x >= keys[i].at && x < keys[i + 1].at)) i++;
  const a = keys[i];
  const b = keys[i + 1];
  if (x === a.at) return a;
  const t = smooth((x - a.at) / (b.at - a.at));
  return {
    at: x,
    camera: lerp3(a.camera, b.camera, t),
    lookAt: lerp3(a.lookAt, b.lookAt, t),
    jar: { rot: lerp(a.jar.rot, b.jar.rot, t), y: lerp(a.jar.y, b.jar.y, t), scale: lerp(a.jar.scale, b.jar.scale, t) },
    ring: { y: lerp(a.ring.y, b.ring.y, t), tilt: lerp(a.ring.tilt, b.ring.tilt, t), radius: lerp(a.ring.radius, b.ring.radius, t) },
    glaze: lerp(a.glaze, b.glaze, t),
  };
}

/** reduced-motion — 현재 섹션의 키프레임으로 스냅 */
export function snapSample(keys: RigState[], p: number): RigState {
  return keys[Math.min(sectionAt(p), keys.length - 1)];
}

export type RenderMode = 'full' | 'lite' | 'static' | false;

/** WebGL 없음 → 렌더 안 함. reduced-motion → 정지 프레임. compact → 경량. */
export function shouldRender3D(env: { webgl: boolean; reducedMotion: boolean; compact: boolean }): RenderMode {
  if (!env.webgl) return false;
  if (env.reducedMotion) return 'static';
  return env.compact ? 'lite' : 'full';
}
