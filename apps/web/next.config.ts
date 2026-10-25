import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // 워크스페이스 패키지(@sandbox/ui)는 소스(TS/CSS)로 소비한다 — Next 가 직접 트랜스파일.
  transpilePackages: ['@sandbox/ui', '@sandbox/tokens'],
  // three 계열은 ESM 전용. 서버 번들에 끌려 들어가지 않게 외부화하지 않는다(클라이언트 전용 dynamic import).
  experimental: {
    optimizePackageImports: ['@react-three/drei', 'lucide-react'],
  },
};

export default nextConfig;
