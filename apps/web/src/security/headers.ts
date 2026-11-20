/**
 * 응답 보안 헤더 — next.config.ts 의 headers() 가 모든 경로에 붙인다. 호스트 중립(CloudFront · Workers · Vercel 모두 그대로 전달).
 *
 * CSP 는 nonce 방식이 아니다: nonce 를 쓰면 모든 페이지가 요청마다 동적 렌더가 되어 랜딩 · 블로그의 정적 프리렌더(CDN 캐시)가 사라진다.
 * 그래서 script-src 에 'unsafe-inline'(Next 의 인라인 부트스트랩 스크립트용)을 두고, 대신 외부 스크립트 출처는 하나도 열지 않는다.
 * 외부로 여는 건 폰트 CDN 2곳뿐(packages/tokens/src/index.css 의 @import).
 */
type Opts = { dev: boolean };

const FONT_CSS = ['https://cdn.jsdelivr.net', 'https://fonts.googleapis.com'];
const FONT_FILES = ['https://cdn.jsdelivr.net', 'https://fonts.gstatic.com'];

export function contentSecurityPolicy({ dev }: Opts) {
  const directives: [string, ...string[]][] = [
    ['default-src', "'self'"],
    // 개발 서버(Turbopack HMR · React 디버그)는 eval 과 웹소켓이 필요하다 — 운영에는 넣지 않는다
    ['script-src', "'self'", "'unsafe-inline'", ...(dev ? ["'unsafe-eval'"] : [])],
    ['style-src', "'self'", "'unsafe-inline'", ...FONT_CSS],
    ['font-src', "'self'", 'data:', ...FONT_FILES],
    // liquid glass 굴절 맵은 data: SVG, three 텍스처는 blob:
    ['img-src', "'self'", 'data:', 'blob:'],
    ['media-src', "'self'"],
    ['connect-src', "'self'", ...(dev ? ['ws:', 'wss:'] : [])],
    ['worker-src', "'self'", 'blob:'],
    ['frame-ancestors', "'none'"],
    ['object-src', "'none'"],
    ['base-uri', "'self'"],
    ['form-action', "'self'"],
  ];
  const parts = directives.map((d) => d.join(' '));
  if (!dev) parts.push('upgrade-insecure-requests');
  return parts.join('; ');
}

export function securityHeaders({ dev }: Opts) {
  return [
    { key: 'Content-Security-Policy', value: contentSecurityPolicy({ dev }) },
    // preload 목록 등록은 되돌리기 어려워 넣지 않는다 — 도메인 운영이 안정되면 그때 결정
    { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'X-Frame-Options', value: 'DENY' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=(), clipboard-write=(self)' },
    { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  ];
}
