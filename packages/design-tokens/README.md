# @repo/design-tokens

Shared design tokens and MUI theme for the smart home dashboard. **Dark and light** schemes are both defined in
`tokens.dark.json` and `tokens.light.json`. The app defaults to **system theme** — MUI picks dark or light from the OS
`prefers-color-scheme` (`defaultMode='system'` in `apps/web/src/main.tsx`).

Scheme-aware colors in components should use `theme.vars.palette.*` or MUI `sx` shortcuts (`'text.primary'`,
`'temperature.main'`), not static `designTokens.color`.

| File                | Contents                                        |
| ------------------- | ----------------------------------------------- |
| `tokens.json`       | Shared — font, spacing, radius, layout, icon, … |
| `tokens.dark.json`  | Dark scheme — color, shadow, card, table        |
| `tokens.light.json` | Light scheme — color, shadow, card, table       |

`tokens.ts` merges them into `{ shared, schemes: { dark, light } }`.

## Exports

| Import                             | Description                             |
| ---------------------------------- | --------------------------------------- |
| `@repo/design-tokens`              | `designTokens`, `theme`, helpers, types |
| `@repo/design-tokens/tokens`       | Shared JSON only                        |
| `@repo/design-tokens/tokens.dark`  | Dark scheme JSON                        |
| `@repo/design-tokens/tokens.light` | Light scheme JSON                       |
| `@repo/design-tokens/theme`        | MUI `theme` only                        |

## Usage

```tsx
import { theme } from '@repo/design-tokens'
import { ThemeProvider } from '@mui/material/styles'
;<ThemeProvider theme={theme} defaultMode='system'>
  ...
</ThemeProvider>
```

`defaultMode` accepts `'system'`, `'light'`, or `'dark'`. The app uses `'system'` in `apps/web/src/main.tsx`.

Flat tokens (backward compatible — resolves the dark scheme regardless of active mode):

```ts
import { designTokens } from '@repo/design-tokens'

designTokens.color.primary
designTokens.font.body.size
designTokens.shared.space
designTokens.schemes.dark.color.background
```

Raw JSON per file:

```ts
import shared from '@repo/design-tokens/tokens'
import dark from '@repo/design-tokens/tokens.dark'
import light from '@repo/design-tokens/tokens.light'

dark.color.primary
shared.font.body.size
```

## Scripts

| Script   | Description |
| -------- | ----------- |
| `format` | Prettier    |
