# @repo/eslint-config

Shared ESLint configuration for monorepo packages.

## Usage

In a package's `.eslintrc.cjs`:

```js
module.exports = {
  extends: ['@repo/eslint-config'],
}
```

Exports from `index.js`: TypeScript ESLint + Prettier rules (`eslint-config-prettier`).

## Consumers

- `apps/web`
- `@repo/feed-client`, `@repo/knx-schema`, `@repo/types`, `@repo/ui`

`apps/service` uses a separate config based on `eslint-config-standard`.

## Scripts

| Script | Description |
|--------|-------------|
| `format` | Prettier |
