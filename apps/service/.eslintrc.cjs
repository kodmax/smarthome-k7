/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@repo/eslint-config/index.js"],
  parserOptions: {
    project: "./tsconfig.json"
  },
  ignorePatterns: [
    "src/test.ts",
    "src/tryit.ts",
    "**/*.test.ts",
    "**/*.spec.ts"
  ]
};
