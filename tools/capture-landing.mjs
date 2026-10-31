/**
 * 랜딩 캡처 — headless Chromium 으로 실제 뷰포트 스크린샷.
 * 사용: node tools/capture-landing.mjs <outDir> [baseUrl]
 * 1280×800 light/dark × 스크롤 0/25/50/75/100, 390×844 light × 0/50/100, 테마 토글 크로스페이드(0.3s/1.2s).
 * dev 서버(:3000)가 떠 있어야 한다. 콘솔 에러 · 가로 스크롤 · backdrop-filter 수 · LazySection 마운트 수를 함께 출력한다.
 */
import { mkdirSync } from 'node:fs';
import { chromium } from 'playwright';

const [, , outDir = './captures', base = 'http://localhost:3000'] = process.argv;
mkdirSync(outDir, { recursive: true });
// 시스템 Chrome(GPU, Metal) 이 있으면 우선 — headless shell 은 소프트웨어 WebGL 이라 3D 가 느리다
let browser;
try {
  browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--enable-gpu', '--ignore-gpu-blocklist', '--use-angle=metal'] });
  console.log('browser: chrome (GPU)');
} catch {
  browser = await chromium.launch();
  console.log('browser: chromium headless shell (software GL)');
}

async function metrics(page) {
  return page.evaluate(() => ({
    scrollW: document.documentElement.scrollWidth,
    vw: innerWidth,
    blurs: [...document.querySelectorAll('*')].filter((e) => getComputedStyle(e).backdropFilter !== 'none').length,
    mounted: `${document.querySelectorAll('[data-mounted="true"]').length}/${document.querySelectorAll('[data-mounted]').length}`,
    theme: document.documentElement.dataset.theme ?? 'system',
    video: !!document.querySelector('video'),
    canvas: !!document.querySelector('canvas'),
  }));
}

async function run(name, viewport, scheme, stops, { toggle = false } = {}) {
  const ctx = await browser.newContext({ viewport, colorScheme: scheme, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await page.goto(base + '/', { waitUntil: 'networkidle' });
  await page.waitForSelector('canvas', { timeout: 15000 }).catch(() => {});
  // 헤드리스는 소프트웨어 WebGL 이라 프레임이 느리다 — 크로스페이드가 끝날 시간을 넉넉히
  await page.waitForTimeout(4000);
  for (const stop of stops) {
    await page.evaluate((s) => window.scrollTo({ top: (document.documentElement.scrollHeight - innerHeight) * s, behavior: 'instant' }), stop);
    await page.waitForTimeout(1600);
    await page.screenshot({ path: `${outDir}/${name}-${scheme}-${Math.round(stop * 100)}.png` });
  }
  if (toggle) {
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.waitForTimeout(600);
    await page.getByRole('button', { name: /모드로 전환/ }).click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: `${outDir}/${name}-toggle-mid.png` });
    await page.waitForTimeout(4000);
    await page.screenshot({ path: `${outDir}/${name}-toggle-done.png` });
  }
  console.log(name, scheme, JSON.stringify(await metrics(page)), errors.length ? `ERRORS: ${errors.join(' | ')}` : 'no console errors');
  await ctx.close();
}

await run('desktop-1280', { width: 1280, height: 800 }, 'light', [0, 0.25, 0.5, 0.75, 1], { toggle: true });
await run('desktop-1280', { width: 1280, height: 800 }, 'dark', [0, 0.5, 1]);
await run('mobile-390', { width: 390, height: 844 }, 'light', [0, 0.5, 1]);
await browser.close();
console.log('saved to', outDir);
