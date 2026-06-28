Agents should work within the currently opened package by default. Do not inspect or modify files outside that package
unless explicitly asked. If cross-package context is required, explain why before reading or editing external files.
Packages may define additional rules in their own `AGENTS.md`.

This repository is a monorepo. Its root folder holds shared configuration that applies across packages, including the root
`.gitignore`, shared ESLint presets in `packages/eslint-config/`, and shared TypeScript bases in
`packages/typescript-config/`. When reading or changing a package's local `.eslintrc.cjs`, `tsconfig.json`, or
`.gitignore`, take the root and shared presets into account — local files often extend or complement them, and both
layers matter for lint, build, and ignore rules.
