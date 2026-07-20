# @repo/chronos

Minute-resolution cron scheduler for Node.js — runs jobs on standard five-field cron expressions.

## API

Exports from `src/index.ts`:

- `Chronos` — scheduler with `addJob(cron, id, fn)` and `close()`
- `ChronosLogger` — optional callback for job lifecycle logs
- Log priority constants

```ts
import { Chronos } from '@repo/chronos'

const chronos = new Chronos((priority, msg) => console.log(priority, msg))
chronos.addJob('0 * * * *', 'hourly-task', async () => {
  /* ... */
})
```

Jobs that are still running when the next tick fires are skipped (no overlap).

## Consumers

- [`@repo/cron-scripts`](../cron-scripts) — KNX scheduled jobs via `initKnxCronJobs()`
- [`@repo/apollo-ws`](../apollo-ws) — cron-based data source refresh in `DataSource`

## Scripts

| Script            | Description       |
| ----------------- | ----------------- |
| `build`           | `tsc` → `dist/`   |
| `dev`             | `tsc --watch`     |
| `test`            | Vitest            |
| `lint` / `format` | ESLint / Prettier |
