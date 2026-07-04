# @repo/design-tokens

Shared design tokens and MUI theme for the smart home dashboard.

## Exports

| Import                       | Description                                  |
| ---------------------------- | -------------------------------------------- |
| `@repo/design-tokens`        | `designTokens`, `theme`, `DesignTokens` type |
| `@repo/design-tokens/tokens` | Raw JSON tokens (framework-agnostic)         |
| `@repo/design-tokens/theme`  | MUI `theme` only                             |

## Usage

```tsx
import { theme } from '@repo/design-tokens'
import { ThemeProvider } from '@mui/material/styles'
;<ThemeProvider theme={theme} defaultMode='dark'>
  ...
</ThemeProvider>
```

Raw tokens without MUI:

```ts
import designTokens from '@repo/design-tokens/tokens'

designTokens.color.primary
```

## Scripts

| Script   | Description |
| -------- | ----------- |
| `format` | Prettier    |
