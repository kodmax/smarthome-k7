# @repo/design-tokens

Shared design token values for the smart home dashboard. **Dark and light** schemes are defined in `tokens.dark.json`
and `tokens.light.json`. MUI `createTheme` and providers live in `@repo/styles`.

Scheme-aware colors in components should use `theme.vars.palette.*` or MUI `sx` shortcuts (`'text.primary'`,
`'temperature.main'`), not static `designTokens.color`.

| File                | Contents                                        |
| ------------------- | ----------------------------------------------- |
| `tokens.json`       | Shared — font, spacing, radius, layout, icon, … |
| `tokens.dark.json`  | Dark scheme — color, shadow, card, table        |
| `tokens.light.json` | Light scheme — color, shadow, card, table       |

`tokens.ts` merges them into `{ shared, schemes: { dark, light } }`.

## Exports

| Import                             | Description                    |
| ---------------------------------- | ------------------------------ |
| `@repo/design-tokens`              | `designTokens`, helpers, types |
| `@repo/design-tokens/tokens`       | Shared JSON only               |
| `@repo/design-tokens/tokens.dark`  | Dark scheme JSON               |
| `@repo/design-tokens/tokens.light` | Light scheme JSON              |

## Usage

```ts
import { designTokens } from '@repo/design-tokens'

designTokens.color.primary
designTokens.font.body.size
designTokens.shared.space
designTokens.schemes.dark.color.background
```

For theme and `AppThemeProvider`, use `@repo/styles`.
