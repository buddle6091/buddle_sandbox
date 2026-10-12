import nxPlugin from '@nx/eslint-plugin';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';

/**
 * 루트 flat config.
 *
 * 핵심은 `@nx/enforce-module-boundaries` 다 — CLAUDE.md 의 태그 규칙
 * (`scope:*` / `type:*`, `app -> feature -> ui -> util`) 을 여기서 강제한다.
 * 프로젝트별 `project.json` 의 `tags` 가 입력이므로, 새 프로젝트를 만들 때
 * 태그를 빠뜨리면 이 규칙이 아무것도 잡지 못한다.
 */
export default [
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.next/**',
      '**/coverage/**',
      '**/.nx/**',
      '**/storybook-static/**',
      '**/dist/**',
    ],
  },

  // 경계 규칙: TS/JS 소스 전반.
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx', '**/*.mjs', '**/*.cjs'],
    plugins: { '@nx': nxPlugin },
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          // 상대경로로 프로젝트 경계를 넘는 것도 위반으로 잡는다.
          allow: [],
          depConstraints: [
            // --- scope: 도메인 격리 ---
            // shared 는 누구나 쓴다.
            { sourceTag: 'scope:shared', onlyDependOnLibsWithTags: ['scope:shared'] },
            // ui 는 shared 까지만. 앱(scope:web)을 역참조할 수 없다.
            { sourceTag: 'scope:ui', onlyDependOnLibsWithTags: ['scope:ui', 'scope:shared'] },
            { sourceTag: 'scope:web', onlyDependOnLibsWithTags: ['scope:web', 'scope:ui', 'scope:shared'] },

            // --- type: 계층 방향 (app -> feature -> ui -> util), 역방향 금지 ---
            { sourceTag: 'type:app', onlyDependOnLibsWithTags: ['type:feature', 'type:ui', 'type:util'] },
            { sourceTag: 'type:feature', onlyDependOnLibsWithTags: ['type:feature', 'type:ui', 'type:util'] },
            { sourceTag: 'type:ui', onlyDependOnLibsWithTags: ['type:ui', 'type:util'] },
            { sourceTag: 'type:util', onlyDependOnLibsWithTags: ['type:util'] },
          ],
        },
      ],
    },
  },

  // TS 권장 규칙. 타입 정보 없이(non-type-checked) 돌려서 lint 를 가볍게 유지한다.
  // 타입 검사는 별도 `typecheck` 타깃(tsc --noEmit)이 맡는다.
  ...tseslint.configs.recommended.map((config) => ({
    ...config,
    files: ['**/*.ts', '**/*.tsx'],
  })),
  // React 훅 규칙 — libs/ui / apps 의 tsx 전반.
  {
    files: ['**/*.tsx'],
    plugins: { 'react-hooks': reactHooks },
    rules: {
      ...reactHooks.configs.recommended.rules,
    },
  },
];
