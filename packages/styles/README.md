# @repo/styles

Shared MUI theme layer and global CSS reset for frontends in the monorepo.

## Contents

| Export                   | Description                                                                            |
| ------------------------ | -------------------------------------------------------------------------------------- |
| `@repo/styles`           | `theme`, `AppThemeProvider`, `colorMode`, media query helpers, `PillToggleButtonGroup` |
| `@repo/styles/reset.css` | Global CSS reset (box-sizing, font-smoothing)                                          |

Dark/light colors and typography come from MUI `createTheme` backed by `@repo/design-tokens` JSON — not from the reset
CSS.

## Usage

**Vite SPA (`apps/web`):**

```tsx
import '@repo/styles/reset.css'
import { AppThemeProvider } from '@repo/styles'
;<AppThemeProvider>{children}</AppThemeProvider>
```

**Next.js (`apps/next`):** import reset + `AppThemeProvider` with `ssrSafe`; keep `AppRouterCacheProvider` and
`InitColorSchemeScript` in the app.

## Boundaries

- `@repo/design-tokens` — raw token values (JSON, `designTokens`)
- `@repo/styles` — MUI theme + reset + provider (no Next.js code)
- `apps/next` — Next-specific glue (`material-nextjs`, layout script)
