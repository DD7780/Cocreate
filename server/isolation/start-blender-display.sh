#!/bin/sh
set -eu
# This runs inside a fresh no-network namespace, never on the host display.
/bin/Xvfb :99 -screen 0 960x640x24 -nolisten tcp -ac -noreset &
display_pid=$!
trap 'kill "$display_pid" 2>/dev/null || true' EXIT TERM INT
attempt=0
until test -S /tmp/.X11-unix/X99; do
  attempt=$((attempt+1)); test "$attempt" -lt 100
  /bin/sleep .05
done
/blender/blender --factory-startup --disable-autoexec --threads 2 --window-geometry 0 0 960 640 --python-exit-code 1 --python /control/interactive-blender.py -- /session/input.json
