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

- `apps/web`, `apps/service`, `apps/mcp`
- `@repo/apollo-ws`, `@repo/apollo-card`, `@repo/chronos`, `@repo/feed-client`, `@repo/i18n-react`
- `@repo/knx-schema`, `@repo/types`, `@repo/assets`
- Root `.eslintrc.js`

## Scripts

| Script   | Description |
| -------- | ----------- |
| `format` | Prettier    |
