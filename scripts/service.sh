#!/bin/sh
set -eu

REPO_DIR="/home/pi/smart-home/smarthome-k7"
NVM_NODE_DIR="/home/pi/.nvm/versions/node"

NODE_MAJOR="$(tr -d '[:space:]' < "$REPO_DIR/.nvmrc")"

NODE_BIN="$(
  find "$NVM_NODE_DIR" \
    -path "*/v${NODE_MAJOR}.*/bin/node" \
    -type f \
    | sort -V \
    | tail -n 1
)"

if [ -z "$NODE_BIN" ] || [ ! -x "$NODE_BIN" ]; then
  echo "Apollo: no installed Node ${NODE_MAJOR}.x binary found in $NVM_NODE_DIR" >&2
  exit 127
fi

exec "$NODE_BIN" \
  --require "$REPO_DIR/apps/service/dist/preload.js" \
  "$REPO_DIR/apps/service/dist/index.js"
