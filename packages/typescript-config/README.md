# @repo/typescript-config

Shared `tsconfig.json` presets for the monorepo.

## Presets

| File                 | Purpose                                |
| -------------------- | -------------------------------------- |
| `base.json`          | Strict ESNext — base for most packages |
| `vite.json`          | Vite apps (DOM, `noEmit`)              |
| `react-library.json` | React libraries (`jsx: react-jsx`)     |

## Usage

```json
{
  "extends": "@repo/typescript-config/vite.json",
  "compilerOptions": { "outDir": "dist" },
  "include": ["src"]
}
```

## Consumers

`apps/web`, `apps/mcp`, `@repo/apollo-card`, `@repo/chronos`, `@repo/cron-scripts`, `@repo/feed-client`,
`@repo/i18n-react`, `@repo/assets`, and other packages with a local `tsconfig.json`.

## Scripts

| Script   | Description |
| -------- | ----------- |
| `format` | Prettier    |
