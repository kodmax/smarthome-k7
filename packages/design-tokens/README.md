# @repo/design-tokens

Shared design tokens and MUI theme for the smart home dashboard.

**Dark mode** is the default. Tokens are split across three JSON files (see table below). Scheme-aware colors in
components should use `theme.vars.palette.*` or MUI `sx` shortcuts (`'text.primary'`, `'temperature.main'`), not static
`designTokens.color`.

| File                | Contents                                                      |
| ------------------- | ------------------------------------------------------------- |
| `tokens.json`       | Shared — font, spacing, radius, layout, icon, …               |
| `tokens.dark.json`  | Dark scheme — color, shadow, card, table                      |
| `tokens.light.json` | Light scheme — currently identical to dark; adjust when ready |

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
;<ThemeProvider theme={theme} defaultMode='dark'>
  ...
</ThemeProvider>
```

Flat tokens (backward compatible — resolves dark scheme):

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
