import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import {
  ALPHA_TOKENS,
  CONTAINER,
  FONT_FAMILIES,
  LAYOUT,
  MOTION,
  NON_COLOR_SEMANTIC,
  NON_COLOR_STATIC,
  PRIMITIVES,
  RADIUS,
  SEMANTIC,
  SHADOW_BASE,
  SHADOW_LEVELS,
  TYPOGRAPHY,
} from './fixtures/expected-tokens';

const SRC = join(dirname(fileURLToPath(import.meta.url)), '..', 'src');
const read = (file: string) => readFileSync(join(SRC, file), 'utf8');
const SRC_FILES = ['index.css', 'primitives.css', 'semantic.css', 'theme.css'] as const;
const allSrc = () => SRC_FILES.map(read).join('\n');

/** `--name: value;` 선언을 모두 뽑는다. */
function declarations(css: string): Map<string, string> {
  const out = new Map<string, string>();
  for (const [, name, value] of css.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
    out.set(name, value.trim());
  }
  return out;
}

/**
 * 중괄호 균형을 세어 최상위 블록 본문을 잘라낸다.
 * `selector` 는 정규식 조각(이미 이스케이프된 상태).
 */
function block(css: string, selector: string): string {
  const opener = new RegExp(`${selector}\\s*\\{`, 'g');
  const match = opener.exec(css);
  if (!match) throw new Error(`블록을 찾지 못했다: ${selector}`);

  let depth = 1;
  const start = match.index + match[0].length;
  for (let i = start; i < css.length; i++) {
    if (css[i] === '{') depth++;
    else if (css[i] === '}' && --depth === 0) return css.slice(start, i);
  }
  throw new Error(`닫히지 않은 블록: ${selector}`);
}

const semanticCss = () => read('semantic.css');
const themeCss = () => read('theme.css');

const LIGHT = ':root';
const SYSTEM_DARK = ':root:not\\(\\[data-theme="light"\\]\\)';
const EXPLICIT_DARK = '\\.dark,\\s*\\[data-theme="dark"\\]';
const MODES = [LIGHT, SYSTEM_DARK, EXPLICIT_DARK] as const;

const HEX = /#[0-9a-fA-F]{3,8}\b/;
const isColorToken = (name: string) => name.startsWith('--bs-color-');

describe('1. 완전성 — design.md semantic 토큰이 모두 존재', () => {
  it.each(Object.keys(SEMANTIC))('--bs-color-%s 가 light/dark 모두 정의된다', (token) => {
    const css = semanticCss();
    const name = `--bs-color-${token}`;
    for (const mode of MODES) {
      expect(declarations(block(css, mode)).has(name), `${name} in ${mode}`).toBe(true);
    }
  });

  it.each(NON_COLOR_SEMANTIC)('%s 가 세 모드 블록에 모두 정의된다', (name) => {
    const css = semanticCss();
    for (const mode of MODES) {
      expect(declarations(block(css, mode)).has(name), `${name} in ${mode}`).toBe(true);
    }
  });

  it(`primitive ${Object.keys(PRIMITIVES).length}개가 모두 정의된다`, () => {
    const declared = declarations(read('primitives.css'));
    for (const key of Object.keys(PRIMITIVES)) {
      expect(declared.has(`--bs-color-${key}`), key).toBe(true);
    }
  });

  it('v0.1 의 indigo 는 어디에도 남아 있지 않다', () => {
    expect(allSrc()).not.toMatch(/indigo/i);
  });
});

describe('2. Light/Dark 키 패리티 — 가장 중요한 회귀 방어', () => {
  it('세 블록이 완전히 동일한 키 집합을 정의한다', () => {
    const css = semanticCss();
    const keys = (selector: string) =>
      [...declarations(block(css, selector)).keys()].sort();

    const light = keys(LIGHT);
    expect(light.length).toBeGreaterThan(0);
    // light 에만 추가하고 dark 를 빠뜨리는 실패는 테마를 토글하기 전까지 안 보인다.
    expect(keys(SYSTEM_DARK)).toEqual(light);
    expect(keys(EXPLICIT_DARK)).toEqual(light);
  });

  it('system dark 와 explicit dark 의 값까지 동일하다', () => {
    const css = semanticCss();
    expect(
      Object.fromEntries(declarations(block(css, SYSTEM_DARK))),
    ).toEqual(Object.fromEntries(declarations(block(css, EXPLICIT_DARK))));
  });

  it('semantic.css 의 모드 블록은 정확히 세 개뿐이다 (별도 :root 블록 금지)', () => {
    // v0.1 에는 shadow 만 담은 네 번째 `:root, :host` 블록이 있었다. 패리티 검사 밖이라 위험.
    const rootBlocks = semanticCss().match(/^:root[^{]*\{/gm) ?? [];
    expect(rootBlocks).toHaveLength(1);
  });
});

describe('3. Primitive 해석 — semantic 은 raw hex 를 쓰지 않는다', () => {
  it.each(MODES)('%s 블록의 색 토큰은 전부 var() 또는 color-mix()', (selector) => {
    for (const [name, value] of declarations(block(semanticCss(), selector))) {
      if (!isColorToken(name)) continue;
      expect(value, `${name} 이 primitive 를 거치지 않는다`).toMatch(
        /^(var\(--bs-color-[\w-]+\)|color-mix\(.+\))$/,
      );
    }
  });

  it.each(MODES)('%s 블록의 모든 값에 하드코딩된 hex 가 없다', (selector) => {
    for (const [name, value] of declarations(block(semanticCss(), selector))) {
      expect(value, `${name} 에 하드코딩된 hex`).not.toMatch(HEX);
    }
  });

  it.each(MODES)('%s 블록의 비색 토큰 안의 색은 var(--bs-color-*) 만 쓴다', (selector) => {
    const decls = declarations(block(semanticCss(), selector));
    for (const name of NON_COLOR_SEMANTIC) {
      const value = decls.get(name) ?? '';
      // var()/color-mix()/숫자/키워드만 남기고 색 함수가 직접 쓰였는지 본다.
      const stripped = value.replace(/var\(--bs-color-[\w-]+\)/g, '');
      expect(stripped, `${name} 에 primitive 를 거치지 않은 색`).not.toMatch(
        /\b(rgba?|hsla?|oklch|oklab)\(/,
      );
      expect(stripped).not.toMatch(HEX);
    }
  });

  it('semantic 색 값이 design.md 의 primitive 를 정확히 가리킨다', () => {
    const css = semanticCss();
    const light = declarations(block(css, LIGHT));
    const dark = declarations(block(css, EXPLICIT_DARK));

    for (const [token, expected] of Object.entries(SEMANTIC)) {
      const name = `--bs-color-${token}`;
      expect(light.get(name), `${name} (light)`).toContain(`--bs-color-${expected.light})`);
      expect(dark.get(name), `${name} (dark)`).toContain(`--bs-color-${expected.dark})`);
    }
  });

  it('알파 토큰이 design.md 의 퍼센트로 합성된다', () => {
    const css = semanticCss();
    const light = declarations(block(css, LIGHT));
    const dark = declarations(block(css, EXPLICIT_DARK));
    for (const [token, pct] of Object.entries(ALPHA_TOKENS)) {
      const name = `--bs-color-${token}`;
      expect(light.get(name), `${name} (light)`).toContain(`${pct.light}%`);
      expect(dark.get(name), `${name} (dark)`).toContain(`${pct.dark}%`);
    }
  });

  it('알파가 아닌 색 토큰은 color-mix 없이 primitive 를 직접 가리킨다', () => {
    const css = semanticCss();
    for (const mode of MODES) {
      for (const [name, value] of declarations(block(css, mode))) {
        if (!isColorToken(name)) continue;
        const token = name.replace('--bs-color-', '');
        if (token in ALPHA_TOKENS) continue;
        expect(value, `${name} 은 불투명 토큰이다`).toMatch(/^var\(--bs-color-[\w-]+\)$/);
      }
    }
  });

  it('그림자는 라이트 = navy 알파, 다크 = black 알파만 쓴다 (design.md §7-3)', () => {
    const css = semanticCss();
    const light = declarations(block(css, LIGHT));
    const dark = declarations(block(css, EXPLICIT_DARK));
    for (const level of ['sm', 'md', 'lg', 'glass', 'intaglio']) {
      const name = `--bs-shadow-${level}`;
      expect(light.get(name), `${name} light`).toContain(`--bs-color-${SHADOW_BASE.light}`);
      expect(light.get(name), `${name} light 에 black`).not.toContain(`--bs-color-${SHADOW_BASE.dark}`);
      expect(dark.get(name), `${name} dark`).toContain(`--bs-color-${SHADOW_BASE.dark}`);
      expect(dark.get(name), `${name} dark 에 navy`).not.toContain(`--bs-color-${SHADOW_BASE.light}`);
    }
  });

  it('모드 무관 비색 토큰은 세 블록에서 같은 값이다', () => {
    const css = semanticCss();
    for (const [name, value] of Object.entries(NON_COLOR_STATIC)) {
      for (const mode of MODES) {
        expect(declarations(block(css, mode)).get(name), `${name} in ${mode}`).toBe(value);
      }
    }
  });

  it('glaze/pool 은 glaze 색 토큰만으로 그려진다', () => {
    const css = semanticCss();
    for (const mode of MODES) {
      const pool = declarations(block(css, mode)).get('--bs-glaze-pool') ?? '';
      expect(pool).toMatch(/gradient\(/);
      expect(pool).toContain('var(--bs-color-glaze-tint)');
      expect(pool).toContain('var(--bs-color-glaze-celadon)');
    }
  });
});

describe('4. Theme 매핑 — 모든 semantic 토큰이 유틸리티로 도달 가능', () => {
  it.each(Object.keys(SEMANTIC))('--color-%s 가 @theme inline 에 매핑된다', (token) => {
    const inlineBlock = block(themeCss(), '@theme inline');
    expect(declarations(inlineBlock).get(`--color-${token}`)).toBe(
      `var(--bs-color-${token})`,
    );
  });

  it.each(SHADOW_LEVELS)('--shadow-%s 가 @theme inline 에서 --bs-shadow 를 참조한다', (level) => {
    const inlineBlock = block(themeCss(), '@theme inline');
    expect(declarations(inlineBlock).get(`--shadow-${level}`)).toBe(`var(--bs-shadow-${level})`);
  });

  it('glaze pool / orb 가 background-image 유틸리티로, blur 가 backdrop-blur 유틸리티로 노출된다', () => {
    const inline = declarations(block(themeCss(), '@theme inline'));
    expect(inline.get('--background-image-glaze-pool')).toBe('var(--bs-glaze-pool)');
    for (const orb of ['primary', 'tertiary', 'secondary']) {
      expect(inline.get(`--background-image-orb-${orb}`)).toBe(`var(--bs-orb-${orb})`);
    }
    for (const size of ['sm', 'md', 'lg']) {
      expect(inline.get(`--blur-glass-${size}`)).toBe(`var(--bs-glass-blur-${size})`);
    }
  });
});

describe('5. inline 가드 — 빠지면 다크모드가 무증상으로 죽는다', () => {
  it('색 매핑 블록이 반드시 `@theme inline` 이다', () => {
    const css = themeCss();
    // 일반 @theme 은 :root 에 전역 --color-* 를 만들어 간접참조를 접어버린다.
    // 그러면 .dark 재정의가 흐르지 않는데, 에러도 안 나고 유틸리티도 계속 생성된다.
    expect(css).toMatch(/@theme\s+inline\s*\{/);

    const inlineDecls = declarations(block(css, '@theme inline'));
    const colorVars = [...inlineDecls.keys()].filter((k) => k.startsWith('--color-'));
    expect(colorVars.length).toBe(Object.keys(SEMANTIC).length);

    for (const [name, value] of inlineDecls) {
      expect(value, `${name} 은 var() 참조여야 inline 이 의미를 가진다`).toMatch(
        /^var\(--bs-[\w-]+\)$/,
      );
    }
  });

  it('모드 가변 값(색·그림자·그래디언트·blur)이 일반 @theme 블록에 새어 들어가지 않는다', () => {
    const plain = block(themeCss(), '@theme(?!\\s+inline)');
    for (const name of declarations(plain).keys()) {
      expect(name, `${name} 은 @theme inline 으로 가야 한다`).not.toMatch(
        /^--(color|shadow|background-image|blur)-/,
      );
    }
  });
});

describe('6. 스케일 값이 design.md 와 일치', () => {
  it('primitive 값이 정확하다', () => {
    const declared = declarations(read('primitives.css'));
    for (const [key, expected] of Object.entries(PRIMITIVES)) {
      expect(declared.get(`--bs-color-${key}`)?.toUpperCase(), key).toBe(expected.toUpperCase());
    }
  });

  it('primitives.css 는 design.md 표에 없는 색을 정의하지 않는다', () => {
    const declared = [...declarations(read('primitives.css')).keys()].sort();
    const expected = Object.keys(PRIMITIVES).map((k) => `--bs-color-${k}`).sort();
    expect(declared).toEqual(expected);
  });

  it('타이포 10종이 size/line-height/weight/letter-spacing 을 모두 정의한다', () => {
    const declared = declarations(block(themeCss(), '@theme(?!\\s+inline)'));
    for (const [name, [size, leading, weight, tracking]] of Object.entries(TYPOGRAPHY)) {
      expect(declared.get(`--text-${name}`), `--text-${name}`).toBe(size);
      expect(declared.get(`--text-${name}--line-height`), `${name} lh`).toBe(leading);
      expect(declared.get(`--text-${name}--font-weight`), `${name} weight`).toBe(weight);
      expect(declared.get(`--text-${name}--letter-spacing`), `${name} tracking`).toBe(tracking);
    }
  });

  it('폰트는 Pretendard + JetBrains Mono 뿐, 세리프 토큰은 없다', () => {
    const declared = declarations(block(themeCss(), '@theme(?!\\s+inline)'));
    expect(declared.get('--font-sans')).toContain(FONT_FAMILIES.sans);
    expect(declared.get('--font-mono')).toContain(FONT_FAMILIES.mono);
    expect(declared.has('--font-serif')).toBe(false);
    expect(allSrc()).not.toMatch(/--font-serif|Noto Serif|Nanum Myeongjo|Georgia/);
  });

  it('radius / shadow / container 가 정의된다', () => {
    const declared = declarations(block(themeCss(), '@theme(?!\\s+inline)'));
    for (const [name, value] of Object.entries(RADIUS)) {
      expect(declared.get(`--radius-${name}`), name).toBe(value);
    }
    for (const [name, value] of Object.entries(CONTAINER)) {
      expect(declared.get(`--container-${name}`)).toBe(value);
    }
  });

  it('스페이싱은 4px 베이스 한 줄로 정의한다', () => {
    const declared = declarations(block(themeCss(), '@theme(?!\\s+inline)'));
    expect(declared.get('--spacing')).toBe('4px');
  });

  it('모션 — 이징 하나(ease-bs)와 지속시간 셋', () => {
    const theme = declarations(block(themeCss(), '@theme(?!\\s+inline)'));
    expect(theme.get('--ease-bs')).toBe(MOTION.ease);
    // 다른 이징 토큰을 추가로 두지 않는다 (design.md §4 "유일한 이징").
    const eases = [...theme.keys()].filter((k) => k.startsWith('--ease-'));
    expect(eases).toEqual(['--ease-bs']);

    const all = declarations(allSrc());
    for (const [name, ms] of Object.entries(MOTION.durations)) {
      expect(all.get(`--bs-motion-${name}`), name).toBe(ms);
    }
  });

  it('셸 레이아웃 치수가 정의되고 compact 에서 topbar 52 / touch 44 로 바뀐다', () => {
    const all = declarations(allSrc());
    for (const [name, value] of Object.entries(LAYOUT)) {
      expect(all.get(name), name).toBe(value);
    }
    const css = allSrc();
    expect(css).toMatch(/--bs-layout-topbar-h:\s*52px/);
    expect(css).toMatch(/--bs-layout-touch:\s*44px/);
  });
});

describe('index.css 진입점', () => {
  it('tailwind 와 세 레이어를 import 하고 dark variant 를 정의한다', () => {
    const css = read('index.css');
    expect(css).toContain('@import "tailwindcss"');
    for (const layer of ['primitives.css', 'semantic.css', 'theme.css']) {
      expect(css).toContain(layer);
    }
    // @custom-variant 는 기본 media query 를 대체하므로 클래스/속성 모두 걸어야 한다.
    expect(css).toMatch(/@custom-variant\s+dark\s*\(/);
    expect(css).toContain('[data-theme="dark"]');
  });

  it('Pretendard Variable 과 JetBrains Mono 를 로드한다 (design.md §2)', () => {
    const css = read('index.css');
    expect(css).toMatch(/@import url\(.*pretendardvariable.*\)/);
    expect(css).toMatch(/@import url\(.*JetBrains\+Mono.*\)/);
  });
});
