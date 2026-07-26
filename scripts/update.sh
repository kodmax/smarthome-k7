#!/usr/bin/env bash
# Production deploy for Raspberry Pi (build, Sentry source maps, frontend, systemd).
#
# Prerequisites on the host (not in repo):
#   - ~/smart-home/deploy.secrets.env  (SENTRY_AUTH_TOKEN, org/project slugs)
#   - /etc/apollo/apollo.env           (runtime env for apollo-daemon, incl. SENTRY_DSN)
#
# Usage:
#   ./scripts/update.sh
#   # or from ~/smart-home:  ./smarthome-k7/scripts/update.sh

set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SMART_HOME_DIR="${SMART_HOME_DIR:-$(dirname "$REPO_DIR")}"
SERVICE_ENV="${SERVICE_ENV:-/etc/apollo/apollo.env}"
SECRETS_FILE="${SECRETS_FILE:-$SMART_HOME_DIR/deploy.secrets.env}"
WEB_DIST_DIR="${WEB_DIST_DIR:-$REPO_DIR/apps/web/dist}"
WEB_ROOT="${WEB_ROOT:-/var/www/dashboard}"

source "$SECRETS_FILE"

export VITE_SENTRY_DSN="https://791ced37c132dcffdd0296014b03cb7a@o4511802390282240.ingest.de.sentry.io/4511802402603088"

cd "$REPO_DIR"
git pull
yarn install --frozen-lockfile

export SENTRY_RELEASE="$(git rev-parse HEAD)"
export VITE_SENTRY_RELEASE="$SENTRY_RELEASE"

yarn build
yarn workspace service sentry:upload-sourcemaps

tmp="$(mktemp /tmp/apollo.env.XXXXXX)"
trap 'rm -f "$tmp"' EXIT

sudo cp -a "$SERVICE_ENV" "${SERVICE_ENV}.bak"
sudo grep -v '^SENTRY_RELEASE=' "$SERVICE_ENV" > "$tmp"
echo "SENTRY_RELEASE=$SENTRY_RELEASE" >> "$tmp"

if [[ ! -s "$tmp" ]]; then
  echo "fatal: refusing to overwrite $SERVICE_ENV (empty temp file)" >&2
  exit 1
fi

sudo mv "$tmp" "$SERVICE_ENV"
sudo chmod 600 "$SERVICE_ENV"
trap - EXIT

sudo rm -rf "${WEB_ROOT:?}"/*
sudo cp -R "$WEB_DIST_DIR/." "$WEB_ROOT/"
echo "Frontend deployed!"

sudo systemctl restart apollo-daemon

echo "Update complete! release=$SENTRY_RELEASE"
