/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@repo/eslint-config/index.js"],
  parserOptions: {
    project: "./tsconfig.json"
  },
  ignorePatterns: [
    "scripts/**",
    "**/*.test.ts",
    "**/*.spec.ts"
  ]
};
