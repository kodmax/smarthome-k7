# next-app

Minimal Next.js 15 playground (App Router) for experiments — SSR, cookies, hydration, etc.

Not connected to the smarthome dashboard, backend, or shared UI packages.

## Running

```sh
# from monorepo root
yarn workspace next-app dev    # http://localhost:3000

# or with everything else
turbo dev
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

The main dashboard stays in [`apps/web`](../web) (Vite SPA on port **5173**).
