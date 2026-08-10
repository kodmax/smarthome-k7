/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@repo/eslint-config/index.js"],
  plugins: ["react-hooks"],
  parserOptions: {
    project: "./tsconfig.json",
  },
  rules: {
    "react-hooks/exhaustive-deps": "warn",
  },
};
