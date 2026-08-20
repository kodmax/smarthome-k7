/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ['@repo/eslint-config/index.js', 'next/core-web-vitals'],
  ignorePatterns: [
    '.next/**',
    'vitest.config.ts',
    'test/**',
    '**/*.test.ts',
    '**/*.test.tsx',
  ],
  parserOptions: {
    project: './tsconfig.json',
  },
}
