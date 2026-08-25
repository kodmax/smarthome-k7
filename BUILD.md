# Development build

How `apps/service` and shared packages run in development vs production.

## Recommended command

```bash
turbo dev
```

Starts **service** and **web** — two persistent tasks, no package watchers.

```text
turbo dev
├── service  → node --watch + @swc-node/register (TypeScript from source)
└── web      → vite
```

Next.js is not part of the default dev stack. Run it separately when needed:

```bash
yarn dev:next
```

## Service dev vs production

| Mode | Command                                  | What runs                                                          |
| ---- | ---------------------------------------- | ------------------------------------------------------------------ |
| Dev  | `yarn workspace service dev`             | `@swc-node/register` executes `src/index.ts` with `src/preload.ts` |
| Prod | `yarn workspace service build` → `start` | `tsc` → `dist/` → `node -r ./dist/preload.js ./dist/index.js`      |

In dev, `@repo/*` dependencies resolve to **package source** via
[`apps/service/tsconfig.dev.json`](apps/service/tsconfig.dev.json) paths — no `dist/` build step and no separate package
dev watchers.

Node's built-in `--watch` restarts the service when files change under `apps/service/src` or `packages/`.

Production builds still compile packages to `dist/` first (`^build` dependency in Turbo).

## Graceful shutdown

Application shutdown is handled in [`apps/service/src/graceful-shutdown.ts`](apps/service/src/graceful-shutdown.ts) (KNX
cron → data sources → KNX disconnect → Nest close). There is no dev wrapper — SIGINT/SIGTERM go directly to the Node
process running the service.

Turbo runs `service#dev` and `web#dev` via **direct task commands** (no Yarn wrapper per workspace). Yarn Classic exits
immediately on SIGINT without waiting for the service to finish shutdown, which truncates logs before
`Shutdown complete`.

On Ctrl+C you should see the full shutdown sequence including `Shutdown complete`. Dev loads
[`apps/service/scripts/watch-parent-exit.cjs`](apps/service/scripts/watch-parent-exit.cjs) via `-r` so that after the
child exits on SIGINT the `node --watch` parent is also terminated (otherwise Turbo would wait on the watcher). Reload
uses SIGTERM and does not kill the watch parent.

If ports stay occupied after an interrupted session, run:

```bash
yarn dev:cleanup
```

## Individual workspaces

```bash
yarn workspace web dev
yarn workspace service dev
yarn dev:next    # next-app only
```

Prefer `turbo dev` at the repo root for service + web together.
