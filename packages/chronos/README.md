# @repo/chronos

Minute-resolution cron scheduler for Node.js — runs jobs on standard five-field cron expressions.

## API

Exports from `src/index.ts`:

- `Chronos` — scheduler with `addJob(spec)` and `runMisfireRecovery()`
- `JobSpec`, `JobRunContext`, `CronJobPolicy`, `CronExecutionStore` — job definition and optional execution policy
- `cronJobId(namespace, id)` — builds namespaced job id for logs

```ts
import { Chronos } from '@repo/chronos'

const chronos = new Chronos({
  logger,
  executionStore, // optional; required for misfirePolicy !== 'skip'
})

chronos.addJob({
  namespace: 'data-source',
  id: 'job-market-insight',
  cron: '5 18 * * *',
  script: async () => {
    return fetchMetrics()
  },
  consume: async (metrics, ctx) => {
    await persistMetrics(metrics, ctx.scheduledAt)
  },
  policy: {
    retry: { maxAttempts: 3, delaySec: 5 * 60 },
    misfirePolicy: 'run-latest',
  },
})

await chronos.runMisfireRecovery()
```

`script` returns a result; optional `consume` receives it with `JobRunContext` (`scheduledAt`, `attempt`, `namespace`,
`id`, `jobId`). Success is recorded only after both steps complete. On retry or misfire recovery, Chronos re-runs
**script and consume**.

Use `consume` for side effects (DB writes, cache, events) when `retry` or `misfirePolicy` is set — keep `script`
read-only or pure compute so retries do not duplicate mutations. Without `consume`, void-only jobs behave as before.

| Policy                                  | When `consume` helps most                                           |
| --------------------------------------- | ------------------------------------------------------------------- |
| `retry`                                 | Side effects in `consume`; failed consume retries the full pipeline |
| `misfirePolicy: run-latest` / `run-all` | Catch-up after downtime without repeating mutations in `script`     |
| `retry` + misfire                       | Largest benefit for daily jobs with persistence                     |
| No policy                               | Mostly clearer separation; no retry safety net                      |
| `concurrencyPolicy: allow` / `replace`  | Limited — overlapping runs still need idempotency                   |

```ts
// void-only job (unchanged)
chronos.addJob({
  namespace: 'knx',
  id: 'clocks-sync',
  cron: '0 * * * *',
  script: async () => {
    /* ... */
  },
})
```

Without `policy`, Chronos behaves as before: best effort, `forbid` overlap, log errors.

Jobs that are still running when the next tick fires are skipped unless `concurrencyPolicy` overrides it.

## Consumers

- [`@repo/cron-scripts`](../cron-scripts) — KNX scheduled jobs via `initKnxCronJobs()`
- [`@repo/feeds`](../feeds) — cron-based data source refresh in `DataSourceRegistry`

## Scripts

| Script            | Description       |
| ----------------- | ----------------- |
| `build`           | `tsc` → `dist/`   |
| `dev`             | `tsc --watch`     |
| `test`            | Vitest            |
| `lint` / `format` | ESLint / Prettier |
