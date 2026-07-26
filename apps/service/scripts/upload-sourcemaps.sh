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

sentry-cli releases new "$SENTRY_RELEASE" --project "$SENTRY_SERVICE_PROJECT"
sentry-cli releases files "$SENTRY_RELEASE" upload-sourcemaps ./dist --project "$SENTRY_SERVICE_PROJECT"
sentry-cli releases finalize "$SENTRY_RELEASE"

echo "[sentry] source maps uploaded (release=$SENTRY_RELEASE)"
