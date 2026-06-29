# @repo/typescript-config

Shared `tsconfig.json` presets for the monorepo.

## Presets

| File | Purpose |
|------|---------|
| `base.json` | Strict ESNext — base for most packages |
| `vite.json` | Vite apps (DOM, `noEmit`) |
| `react-library.json` | React libraries (`jsx: react-jsx`) |

## Usage

```json
{
  "extends": "@repo/typescript-config/vite.json",
  "compilerOptions": { "outDir": "dist" },
  "include": ["src"]
}
```

## Consumers

`apps/web`, `@repo/feed-client`, `@repo/ui`, `@repo/cron-scripts`, and other packages with a local `tsconfig.json`.

## Scripts

| Script | Description |
|--------|-------------|
| `format` | Prettier |
