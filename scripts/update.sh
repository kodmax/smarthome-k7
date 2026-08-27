#!/usr/bin/env bash
# Production deploy for Raspberry Pi (build, Sentry source maps, frontend, systemd).
#
# Host layout (override with env vars if needed):
#   /home/pi/smart-home/update.sh
#   /home/pi/smart-home/deploy.secrets.env
#   /home/pi/smart-home/smarthome-k7/   ← git repo
#
# Usage:  /home/pi/smart-home/update.sh

set -euo pipefail

SMART_HOME_DIR="${SMART_HOME_DIR:-/home/pi/smart-home}"
REPO_DIR="${REPO_DIR:-$SMART_HOME_DIR/smarthome-k7}"
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

# Pi: colder full rebuilds can swap-thrash at turbo.json's concurrency=15.
yarn turbo run build --concurrency=4

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
echo "Service restarted!"

echo "Update complete! release=$SENTRY_RELEASE"
