import { describe, expect, it } from 'vitest';

import { contentSecurityPolicy, securityHeaders } from './headers';

const get = (dev: boolean, key: string) => securityHeaders({ dev }).find((h) => h.key === key)?.value;

describe('securityHeaders', () => {
  it('기본 세트가 빠짐없이 들어간다', () => {
    const keys = securityHeaders({ dev: false }).map((h) => h.key);
    expect(keys).toEqual([
      'Content-Security-Policy',
      'Strict-Transport-Security',
      'X-Content-Type-Options',
      'X-Frame-Options',
      'Referrer-Policy',
      'Permissions-Policy',
      'Cross-Origin-Opener-Policy',
    ]);
  });

  it('HSTS 는 2년 + 서브도메인, preload 는 넣지 않는다(되돌리기 어려운 약속)', () => {
    expect(get(false, 'Strict-Transport-Security')).toBe('max-age=63072000; includeSubDomains');
  });

  it('클릭재킹 차단 — X-Frame-Options DENY + CSP frame-ancestors none', () => {
    expect(get(false, 'X-Frame-Options')).toBe('DENY');
    expect(contentSecurityPolicy({ dev: false })).toContain("frame-ancestors 'none'");
  });

  it('권한 정책 — 카메라·마이크·위치는 끄고, 이메일 복사용 클립보드 쓰기만 자기 출처에 허용', () => {
    const v = get(false, 'Permissions-Policy')!;
    expect(v).toContain('camera=()');
    expect(v).toContain('microphone=()');
    expect(v).toContain('geolocation=()');
    expect(v).toContain('clipboard-write=(self)');
  });
});

describe('contentSecurityPolicy', () => {
  const prod = contentSecurityPolicy({ dev: false });
  const dev = contentSecurityPolicy({ dev: true });

  it('운영은 eval 금지, 개발만 HMR 용 unsafe-eval · ws 허용', () => {
    expect(prod).not.toContain('unsafe-eval');
    expect(prod).not.toContain('ws:');
    expect(dev).toContain("'unsafe-eval'");
    expect(dev).toContain('ws:');
  });

  it('폰트 CDN(Pretendard · JetBrains Mono) 만 외부로 연다', () => {
    expect(prod).toContain('style-src');
    expect(prod).toMatch(/style-src [^;]*https:\/\/cdn\.jsdelivr\.net[^;]*https:\/\/fonts\.googleapis\.com/);
    expect(prod).toMatch(/font-src [^;]*https:\/\/fonts\.gstatic\.com/);
    expect(prod).toMatch(/script-src 'self' 'unsafe-inline'(;|$)/);
  });

  it('플러그인 · base 탈취 · 외부 폼 전송 차단, http 는 https 로 올린다', () => {
    for (const d of ["object-src 'none'", "base-uri 'self'", "form-action 'self'", 'upgrade-insecure-requests']) expect(prod).toContain(d);
    expect(dev).not.toContain('upgrade-insecure-requests');
  });
});
