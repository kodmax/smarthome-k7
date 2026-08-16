# Development build and graceful shutdown

This document records how `apps/service` is started and stopped under Turborepo, how its development processes handle
signals, and how to recover if an interrupted development session leaves a process behind.

## What was broken and how it was diagnosed

The original root `yarn dev` process chain used Turbo 2.9.16 and a Yarn wrapper for every workspace task. Ctrl+C could
return the shell prompt before cleanup completed, truncate shutdown output, leave ports occupied, and orphan Yarn,
`dev.mjs`, or service processes under `PPID=1`. Application logs alone were misleading because the process could be
terminated between two completed shutdown steps.

The investigation separated the layers and established the following:

1. Running the service directly proved that its application-level shutdown sequence could close Nest, KNX, Redis, SQL,
   metrics, OpenTelemetry, and Sentry correctly.
2. Turbo was upgraded to 2.10.10 for graceful task shutdown and stream output. Its first Ctrl+C starts graceful
   shutdown, and a second Ctrl+C correctly force-kills any task that is still alive.
3. Yarn Classic 1.22.22 exits after SIGINT without waiting for its child. This explained prompts appearing while
   descendants continued writing logs and why package-local `yarn dev` exhibited the same output ordering.
4. Temporarily detaching the service protected it from premature process-group termination but did not solve signal
   routing. Turbo's interactive PTY selected the final service process as its signal target whether the child was
   detached or not.
5. Direct Turbo task commands removed Yarn from all persistent `dev` task paths. The scoped overrides had to repeat
   `dependsOn`, `cache`, and `persistent` because they do not inherit the unscoped task definition.
6. Signal tracing then proved that Turbo sent SIGINT directly to the service, not `dev.mjs`. The service exited cleanly,
   but the wrapper remained alive because of its file watchers, so Turbo correctly kept reporting
   `1 task shutting down`.
7. The final fix made `dev.mjs` exit when its current service child exits with code 0. Wrapper-initiated reloads are
   marked as expected, so source and dependency rebuilds continue to restart the service without stopping the watcher.

The verified final result is one Ctrl+C, the complete application shutdown sequence, clean exit of `dev.mjs`, Turbo's
task summary, and only then the shell prompt. No development process or service port remains.

## Development process tree

The recommended root command is:

```bash
turbo dev
```

It runs the persistent `dev` tasks through Turborepo 2.10.10. Turbo uses stream output, does not cache these tasks, and
executes package-scoped command overrides directly instead of invoking Yarn for each workspace. For `apps/service`, the
relevant process chain is conceptually:

```text
turbo dev
└── native Turbo
    └── node scripts/dev.mjs
        └── node -r ./dist/preload.js ./dist/index.js
```

`scripts/dev.mjs` compiles the service, watches its TypeScript sources and the `dist` directories of its `@repo/*`
dependencies, and restarts the Node process after relevant changes.

### Direct Turbo task commands

Turbo 2.10.10 supports experimental task command overrides. The root `turbo.json` enables
`futureFlags.experimentalTaskCommand` and provides a package-scoped command for every workspace with a `dev` script:

- `service#dev` runs `node scripts/dev.mjs`;
- `web#dev` runs Vite's JavaScript entrypoint through `node`;
- the 11 watchable `@repo/*` packages run `node ../../scripts/transpile-package.mjs --watch`.

These commands are argv arrays executed from each package directory without a shell or package manager. Package-scoped
tasks do not inherit the unscoped `dev` definition, so every override explicitly repeats `dependsOn: ["^transpile"]`,
`cache: false`, and `persistent: true`. Existing package.json scripts remain available for standalone package commands,
but Turbo's more-specific overrides take precedence over them.

The finite `^transpile` dependencies still use their package.json scripts and may print Yarn startup output. They finish
before the dependent persistent tasks start and are no longer present during shutdown; the long-running `dev` tasks
themselves run without Yarn wrappers.

The override is experimental and intentionally absent from Turbo's published JSON schema. Turbo 2.10.10 accepts it even
if an editor reports `command` as an unknown property.

## Signal strategy and detached-process history

Before direct task commands were enabled, Turbo, its PTY, Yarn, `dev.mjs`, and the service formed several
signal-forwarding layers. A parent process exiting did not automatically terminate its descendants: Unix does not
recursively propagate parent termination, including `SIGKILL`. Surviving processes were reparented to `launchd` with
`PPID=1`, while active watchers or servers kept their event loops alive.

The service was temporarily spawned with `detached: true` to isolate it from premature task-process-group termination.
Testing showed that detachment was unnecessary: Turbo's interactive PTY targets the final service process whether or not
it is detached. The service received SIGINT and completed graceful shutdown, while `dev.mjs` received no signal and
remained alive because of its file watchers. Turbo then correctly waited for `service#dev` until a second Ctrl+C
force-killed the wrapper.

The service is now non-detached, and `dev.mjs` handles both possible shutdown paths. If the wrapper receives SIGINT or
SIGTERM, it explicitly forwards the signal and waits for the service. If Turbo signals the service directly, an `exit`
listener stops the wrapper after the service exits successfully:

```text
Ctrl+C
  → Turbo signals the service
  → the service completes application shutdown
  → service exits with code 0
  → dev.mjs observes the clean child exit and stops its watcher
  → Turbo observes service#dev exit
```

Child exits caused by source or dependency restarts are marked as expected and do not stop the wrapper. Non-zero service
exits also leave the watcher running so a later code change can restart the service.

When the wrapper initiates shutdown or restart, it waits for up to 30 seconds. If the child is still running after that
limit, it logs a warning and sends `SIGKILL`. Checks of both `exitCode` and `signalCode`, plus listeners installed
before waiting, avoid races when a child has already exited or exits because of a signal.

## Application shutdown order

`apps/service/src/graceful-shutdown.ts` handles both `SIGINT` and `SIGTERM`. Only the first signal starts shutdown;
duplicates are logged and ignored.

Resources are closed sequentially in this order:

1. Abort an in-flight KNX connection attempt.
2. Close the Nest application.
3. Stop the KNX cron.
4. Close registered data sources.
5. Disconnect the active KNX link.
6. Close Redis.
7. Close SQL connections.
8. Close the Prometheus metrics server.
9. Close OpenTelemetry.
10. Close Sentry.

After successful cleanup, the logger is flushed before `process.exit(0)`. A failure is logged, captured, and followed by
a final Sentry close before `process.exit(1)`.

Prometheus shutdown treats `ERR_SERVER_NOT_RUNNING` as successful cleanup. This covers the race where shutdown starts
before the metrics server has completed listening or after it has already stopped.

## OpenTelemetry in local development

When enabled, OpenTelemetry shutdown was observed to take about 15.6 seconds. The local, ignored `apps/service/.env`
disables it during development:

```dotenv
OTEL_SDK_DISABLED=1
```

With this setting, `closeOpenTelemetry()` is a no-op even though the normal `step: "open-telemetry"` completion log is
still emitted. A complete local shutdown was observed to take about 23 ms instead. This is intentionally a local
development setting rather than an environment override in `dev.mjs`; production and other environments retain their own
observability configuration.

## Running a package directly

The service package's `dev` script runs `node scripts/dev.mjs`. Starting it through package-local Yarn therefore still
adds Yarn Classic as a process layer:

```bash
cd apps/service
yarn dev
```

The application completes its full graceful-shutdown sequence in this mode, but Yarn exits on Ctrl+C before `dev.mjs`
and the service have finished. The shell can consequently return its prompt while shutdown logs are still being printed.
With OpenTelemetry disabled, the remaining work took only about 23 ms and hid this behavior; with OpenTelemetry enabled,
the prompt returned after the metrics step and the remaining logs appeared about 15.6 seconds later.

To test the wrapper without Yarn, run:

```bash
cd apps/service
node scripts/dev.mjs
```

In this mode, Ctrl+C starts the same application shutdown, `dev.mjs` waits for the service child, and the shell does not
return its prompt until `Shutdown complete`. This isolates and confirms that the application shutdown and `dev.mjs`
lifecycle work correctly.

## Known terminal-output limitation

Yarn Classic 1.22.22 returns control to the shell after receiving Ctrl+C without waiting for the child process to finish
its asynchronous shutdown. This still occurs with package-local `yarn dev`.

Use `turbo dev` at the repository root. This avoids the outer Yarn process, while the package-scoped command overrides
avoid Yarn inside each Turbo task. To prevent accidental use of the old process chain, root `yarn dev` no longer starts
Turbo and only prints `Please use turbo dev instead of yarn dev`.

During shutdown, Turbo continues reporting `1 task shutting down` while OpenTelemetry finishes. The service child-exit
listener then terminates `dev.mjs`, allowing Turbo to print its task summary and exit without a second Ctrl+C.

An early prompt from a Yarn-based invocation is not evidence that shutdown failed. The important checks are that:

- the application reports its shutdown steps when its output pipe remains available;
- the service releases its ports;
- no `dev.mjs`, service, Yarn dev, or Turbo process remains.

The service remains non-detached because process isolation did not change Turbo's PTY signal target and is no longer
needed for this lifecycle.

## Cleaning up an interrupted session

If a terminal or Turbo is terminated abnormally, run:

```bash
yarn dev:cleanup
```

`scripts/dev-cleanup.sh` finds relevant processes by:

- ports `9464` and `3679`;
- service processes running `scripts/dev.mjs` or `./dist/preload.js` from `apps/service`;
- orphaned `yarn run dev` processes whose working directory is inside this repository.

It first sends `SIGTERM`, waits one second, and sends `SIGKILL` only to targets that are still alive.

A process with `PPID=1` has lost its original parent and has been adopted by the operating system's init process
(`launchd` on macOS). For a long-running `yarn run dev` process inside this repository, that usually means its terminal,
shell, or Turbo parent exited without reaping it. The cleanup script deliberately limits this check by command, parent
PID, and working directory to avoid terminating unrelated Yarn processes.

## Diagnostic checklist

After Ctrl+C:

1. Allow shutdown to complete even if the prompt appears early.
2. Confirm that no relevant development process remains:

   ```bash
   ps ax -o pid=,ppid=,pgid=,stat=,etime=,command= \
     | awk '/smarthome-k7|turbo|dev\.mjs|dist\/preload\.js|yarn\.js run dev/ && !/awk/'
   ```

3. Confirm that the service ports are free:

   ```bash
   lsof -nP -i :9464
   lsof -nP -i :3679
   ```

4. If either check finds leftovers, run `yarn dev:cleanup` and repeat the checks.

## Verification

The implementation is covered by graceful-shutdown and Prometheus shutdown tests. Run the complete repository
verification with:

```bash
yarn verify
```

The baseline implementation was introduced by commit `8827c42` (`Preserve graceful service shutdown under Turborepo.`).
