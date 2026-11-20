import type { NextConfig } from 'next';

import { securityHeaders } from './src/security/headers';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // X-Powered-By: Next.js 노출 제거 — 스택 정보를 공짜로 주지 않는다
  poweredByHeader: false,
  // 모든 경로에 보안 헤더(CSP · HSTS · 클릭재킹 · 권한 정책). 정의와 이유는 src/security/headers.ts
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders({ dev: process.env.NODE_ENV !== 'production' }) }];
  },
  // 워크스페이스 패키지(@sandbox/ui)는 소스(TS/CSS)로 소비한다 — Next 가 직접 트랜스파일.
  transpilePackages: ['@sandbox/ui', '@sandbox/tokens'],
  // three 계열은 ESM 전용. 서버 번들에 끌려 들어가지 않게 외부화하지 않는다(클라이언트 전용 dynamic import).
  experimental: {
    optimizePackageImports: ['@react-three/drei', 'lucide-react'],
  },
};

export default nextConfig;
