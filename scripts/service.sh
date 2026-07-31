#!/bin/sh
/home/pi/.nvm/versions/node/v26.3.0/bin/node \
  --require /home/pi/smart-home/smarthome-k7/apps/service/dist/otel-instrumentation.js \
  /home/pi/smart-home/smarthome-k7/apps/service/dist