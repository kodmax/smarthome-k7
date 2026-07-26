#!/usr/bin/env bash
set -euo pipefail

if [[ -z "${SENTRY_AUTH_TOKEN:-}" ]]; then
  echo '[sentry] skipping source map upload (missing SENTRY_AUTH_TOKEN)'
  exit 0
fi

if [[ -z "${SENTRY_RELEASE:-}" ]]; then
  echo '[sentry] source map upload requires SENTRY_RELEASE' >&2
  exit 1
fi

if [[ -z "${SENTRY_SERVICE_PROJECT:-}" ]]; then
  echo '[sentry] source map upload requires SENTRY_SERVICE_PROJECT' >&2
  exit 1
fi

if [[ ! -f ./dist/index.js || ! -f ./dist/index.js.map ]]; then
  echo '[sentry] missing ./dist/index.js or ./dist/index.js.map — run service build first' >&2
  exit 1
fi

sentry-cli releases new "$SENTRY_RELEASE" --project "$SENTRY_SERVICE_PROJECT" || true
sentry-cli sourcemaps upload ./dist/index.js \
  --release "$SENTRY_RELEASE" \
  --project "$SENTRY_SERVICE_PROJECT"
sentry-cli releases finalize "$SENTRY_RELEASE" --project "$SENTRY_SERVICE_PROJECT"

echo "[sentry] source maps uploaded (release=$SENTRY_RELEASE)"
