#!/bin/sh
set -eu

cd /home/pi/smart-home/smarthome-k7

exec /home/pi/.nvm/versions/node/v26.3.0/bin/node \
  --require ./apps/service/dist/preload.js \
  ./apps/service/dist/index.js
