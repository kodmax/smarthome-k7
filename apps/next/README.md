# next-app

Minimal Next.js 15 playground (App Router) for experiments — SSR, cookies, hydration, etc.

Uses shared styling from the monorepo:

- `@repo/styles/reset.css` — global CSS reset
- `@repo/styles` — MUI `theme`, `AppThemeProvider` (`ssrSafe`)
- `@repo/design-tokens` — raw token values backing the theme

Next-specific glue (`AppRouterCacheProvider`, `InitColorSchemeScript`, Inter font) stays in this app.

## Running

```sh
yarn workspace next-app dev:next   # http://localhost:3000
yarn dev:next                      # same from repo root
```

Not part of `yarn build` / Turbo `build` (playground only). Use `yarn workspace next-app build:next` when you need a
production Next build.

## Scripts

| Script       | Description                       |
| ------------ | --------------------------------- |
| `dev:next`   | Next dev (:3000)                  |
| `build:next` | Production build (manual only)    |
| `start`      | Production server                 |
| `lint`       | ESLint                            |
| `test`       | Vitest                            |
| `format`     | Prettier                          |
| `verify`     | format + lint + test + build:next |

Dashboard (Vite SPA): [`apps/web`](../web) on port **5173**.
