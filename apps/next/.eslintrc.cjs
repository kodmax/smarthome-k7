/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ['@repo/eslint-config/index.js', 'next/core-web-vitals'],
  ignorePatterns: ['.next/**'],
  parserOptions: {
    project: './tsconfig.json',
  },
}
