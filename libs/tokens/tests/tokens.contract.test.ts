import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import {
  ALPHA_TOKENS,
  CONTAINER,
  PRIMITIVES,
  RADIUS,
  SEMANTIC,
  SHADOW_LEVELS,
  TYPOGRAPHY,
} from './fixtures/expected-tokens';

const SRC = join(dirname(fileURLToPath(import.meta.url)), '..', 'src');
const read = (file: string) => readFileSync(join(SRC, file), 'utf8');

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

describe('1. 완전성 — design.md semantic 토큰이 모두 존재', () => {
  it.each(Object.keys(SEMANTIC))('--bs-color-%s 가 light/dark 모두 정의된다', (token) => {
    const css = semanticCss();
    const name = `--bs-color-${token}`;

    expect(declarations(block(css, LIGHT)).has(name)).toBe(true);
    expect(declarations(block(css, SYSTEM_DARK)).has(name)).toBe(true);
    expect(declarations(block(css, EXPLICIT_DARK)).has(name)).toBe(true);
  });

  it('primitive 20개가 모두 정의된다', () => {
    const declared = declarations(read('primitives.css'));
    for (const key of Object.keys(PRIMITIVES)) {
      expect(declared.has(`--bs-color-${key}`)).toBe(true);
    }
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
});

describe('3. Primitive 해석 — semantic 은 raw hex 를 쓰지 않는다', () => {
  it.each([LIGHT, SYSTEM_DARK, EXPLICIT_DARK])('%s 블록의 모든 값이 var() 또는 color-mix()', (selector) => {
    for (const [name, value] of declarations(block(semanticCss(), selector))) {
      expect(value, `${name} 이 primitive 를 거치지 않는다`).toMatch(
        /^(var\(--bs-[\w-]+\)|color-mix\(.+\))$/,
      );
      expect(value, `${name} 에 하드코딩된 hex`).not.toMatch(/#[0-9a-fA-F]{3,8}/);
    }
  });

  it('semantic 값이 design.md 의 primitive 를 정확히 가리킨다', () => {
    const css = semanticCss();
    const light = declarations(block(css, LIGHT));
    const dark = declarations(block(css, EXPLICIT_DARK));

    for (const [token, expected] of Object.entries(SEMANTIC)) {
      const name = `--bs-color-${token}`;
      expect(light.get(name), `${name} (light)`).toContain(`--bs-color-${expected.light}`);
      expect(dark.get(name), `${name} (dark)`).toContain(`--bs-color-${expected.dark}`);
    }
  });

  it('알파 토큰이 design.md 의 퍼센트로 합성된다', () => {
    const css = semanticCss();
    for (const [token, pct] of Object.entries(ALPHA_TOKENS)) {
      const name = `--bs-color-${token}`;
      expect(declarations(block(css, LIGHT)).get(name)).toContain(`${pct.light}%`);
      expect(declarations(block(css, EXPLICIT_DARK)).get(name)).toContain(`${pct.dark}%`);
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
      if (!name.startsWith('--color-')) continue;
      expect(value, `${name} 은 var() 참조여야 inline 이 의미를 가진다`).toMatch(
        /^var\(--bs-color-[\w-]+\)$/,
      );
    }
  });

  it('모드 가변 색이 일반 @theme 블록에 새어 들어가지 않는다', () => {
    const plain = block(themeCss(), '@theme(?!\\s+inline)');
    for (const name of declarations(plain).keys()) {
      expect(name, `${name} 은 @theme inline 으로 가야 한다`).not.toMatch(/^--color-/);
    }
  });
});

describe('6. 스케일 값이 design.md 와 일치', () => {
  it('primitive hex 값이 정확하다', () => {
    const declared = declarations(read('primitives.css'));
    for (const [key, hex] of Object.entries(PRIMITIVES)) {
      expect(declared.get(`--bs-color-${key}`)?.toUpperCase()).toBe(hex);
    }
  });

  it('타이포 9종이 size/line-height/weight 를 모두 정의한다', () => {
    const declared = declarations(block(themeCss(), '@theme(?!\\s+inline)'));
    for (const [name, [size, leading, weight]] of Object.entries(TYPOGRAPHY)) {
      expect(declared.get(`--text-${name}`), `--text-${name}`).toBe(size);
      expect(declared.get(`--text-${name}--line-height`)).toBe(leading);
      expect(declared.get(`--text-${name}--font-weight`)).toBe(weight);
    }
  });

  it('radius / shadow / container 가 정의된다', () => {
    const declared = declarations(block(themeCss(), '@theme(?!\\s+inline)'));
    for (const [name, value] of Object.entries(RADIUS)) {
      expect(declared.get(`--radius-${name}`)).toBe(value);
    }
    for (const level of SHADOW_LEVELS) {
      expect(declared.get(`--shadow-${level}`)).toBeDefined();
    }
    for (const [name, value] of Object.entries(CONTAINER)) {
      expect(declared.get(`--container-${name}`)).toBe(value);
    }
  });

  it('스페이싱은 4px 베이스 한 줄로 정의한다', () => {
    const declared = declarations(block(themeCss(), '@theme(?!\\s+inline)'));
    expect(declared.get('--spacing')).toBe('4px');
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
});
