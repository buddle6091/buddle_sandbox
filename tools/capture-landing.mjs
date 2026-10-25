/**
 * 랜딩 캡처 — headless Chromium 으로 실제 뷰포트 크기 스크린샷.
 * 사용: node tools/capture-landing.mjs <outDir> [baseUrl]
 * 1280×800 light/dark × 스크롤 4단계, 390×844 light × 3단계. dev 서버(:3000)가 떠 있어야 한다.
 */
import { mkdirSync } from 'node:fs';
import { chromium } from 'playwright';

const [, , outDir = './captures', base = 'http://localhost:3000'] = process.argv;
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const shots = [];

async function run(name, viewport, scheme, stops) {
  const ctx = await browser.newContext({ viewport, colorScheme: scheme, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await page.goto(base + '/', { waitUntil: 'networkidle' });
  await page.waitForSelector('canvas', { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(1500);
  for (const stop of stops) {
    await page.evaluate((s) => window.scrollTo({ top: (document.documentElement.scrollHeight - innerHeight) * s, behavior: 'instant' }), stop);
    await page.waitForTimeout(1400);
    const file = `${outDir}/${name}-${scheme}-${Math.round(stop * 100)}.png`;
    await page.screenshot({ path: file });
    shots.push(file);
  }
  const metrics = await page.evaluate(() => ({
    scrollW: document.documentElement.scrollWidth,
    vw: innerWidth,
    blurs: [...document.querySelectorAll('*')].filter((e) => getComputedStyle(e).backdropFilter !== 'none').length,
    inview: [...document.querySelectorAll('section[data-section]')].filter((s) => s.dataset.inview === 'true').length,
  }));
  console.log(name, scheme, JSON.stringify(metrics), errors.length ? `ERRORS: ${errors.join(' | ')}` : 'no console errors');
  await ctx.close();
}

await run('desktop-1280', { width: 1280, height: 800 }, 'light', [0, 0.3, 0.62, 1]);
await run('desktop-1280', { width: 1280, height: 800 }, 'dark', [0, 0.62]);
await run('mobile-390', { width: 390, height: 844 }, 'light', [0, 0.3, 1]);
await browser.close();
console.log(shots.join('\n'));
