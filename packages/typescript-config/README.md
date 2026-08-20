# @repo/typescript-config

Shared `tsconfig.json` presets for the monorepo.

## Presets

| File                 | Purpose                                                                        |
| -------------------- | ------------------------------------------------------------------------------ |
| `base.json`          | Strict ESNext — base for most packages                                         |
| `node.json`          | Node backend — `node16` emit to `dist/` with maps (`inlineSources` for Sentry) |
| `vite.json`          | Vite apps (DOM, `noEmit`)                                                      |
| `react-library.json` | React libraries (`jsx: react-jsx`)                                             |

## Usage

Vite app:

```json
{
  "extends": "@repo/typescript-config/vite.json",
  "compilerOptions": { "outDir": "dist" },
  "include": ["src"]
}
```

Node package (emit to `dist/`):

```json
{
  "extends": "@repo/typescript-config/node.json",
  "compilerOptions": {
    "rootDir": "src",
    "outDir": "./dist"
  },
  "include": ["src/**/*.ts"],
  "exclude": ["dist", "src/**/*.test.ts", "src/**/*.spec.ts"]
}
```

`rootDir` and `outDir` must live in the consuming package — TypeScript resolves path options relative to the file that
defines them, not the extended preset.

## Consumers

`apps/web`, `apps/mcp`, `apps/service`, `@repo/apollo-card`, `@repo/chronos`, `@repo/common`, `@repo/cron-scripts`,
`@repo/db`, `@repo/di`, `@repo/env`, `@repo/feeds`, `@repo/feed-client`, `@repo/i18n`, `@repo/knx-schema`,
`@repo/logger`, `@repo/transmission`, `@repo/types`, `@repo/assets`, and other packages with a local `tsconfig.json`.

## Scripts

| Script   | Description |
| -------- | ----------- |
| `format` | Prettier    |
