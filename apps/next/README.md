# next-app

Minimal Next.js 15 playground (App Router) for experiments — SSR, cookies, hydration, etc.

Uses shared styling from the monorepo:

- `@repo/styles/reset.css` — global CSS reset
- `@repo/styles` — MUI `theme`, `AppThemeProvider` (`ssrSafe`)
- `@repo/design-tokens` — raw token values backing the theme

Next-specific glue (`AppRouterCacheProvider`, `InitColorSchemeScript`, Inter font) stays in this app.

## Running

```sh
yarn workspace next-app dev    # http://localhost:3000
turbo dev                      # with web + service
```

## Scripts

| Script   | Description           |
| -------- | --------------------- |
| `dev`    | Next dev (:3000)      |
| `build`  | Production build      |
| `start`  | Production server     |
| `lint`   | ESLint                |
| `format` | Prettier              |
| `verify` | format + lint + build |

Dashboard (Vite SPA): [`apps/web`](../web) on port **5173**.
