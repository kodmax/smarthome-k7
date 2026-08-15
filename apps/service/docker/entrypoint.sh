#!/usr/bin/env bash
set -euo pipefail

cd /app

for attempt in $(seq 1 30); do
  if node packages/db/scripts/migrate.js up; then
    break
  fi

  if [ "$attempt" -eq 30 ]; then
    echo "fatal: PostgreSQL migrations failed after 30 attempts" >&2
    exit 1
  fi

  echo "Waiting for PostgreSQL (attempt ${attempt}/30)..."
  sleep 2
done

cd /app/apps/service
exec node -r ./dist/preload.js ./dist/index.js
