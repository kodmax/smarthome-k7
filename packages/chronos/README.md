# @repo/chronos

Minute-resolution cron scheduler for Node.js — runs jobs on standard five-field cron expressions.

## API

Exports from `src/index.ts`:

- `Chronos` — scheduler with `addJob(spec)` and `runMisfireRecovery()`
- `JobSpec`, `CronJobPolicy`, `CronExecutionStore` — job definition and optional execution policy
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
    /* ... */
  },
  policy: {
    retry: { maxAttempts: 3, delaySec: 5 * 60 },
    misfirePolicy: 'run-latest',
  },
})

await chronos.runMisfireRecovery()
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
