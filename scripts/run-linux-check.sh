#!/bin/sh
set -eu
# Disposable CI only; the bound parent covers both the app and delegated jobs after migration.
root=${TWOGUYS1CANVAS_CI_CGROUP_ROOT:-${COCREATE_CI_CGROUP_ROOT:?CI cgroup root required}}
case "$root" in /sys/fs/cgroup/2guys1canvas-ci-*|/sys/fs/cgroup/cocreate-ci-*) ;; *) exit 126 ;; esac
test "$(cat "$root/memory.max")" = 1073741824
test "$(cat "$root/pids.max")" = 256
exec docker run --rm --network none --cap-drop ALL \
  --cap-add CHOWN --cap-add SETUID --cap-add SETGID --cap-add SETPCAP \
  --security-opt no-new-privileges --security-opt seccomp=unconfined \
  --security-opt apparmor=unconfined --security-opt systempaths=unconfined \
  --memory 1g --memory-swap 1g --pids-limit 256 --cgroupns host \
  --volume "$root:/run/2guys1canvas-cgroup:rw" --env TWOGUYS1CANVAS_CGROUP_MOUNT=/run/2guys1canvas-cgroup \
  --env TWOGUYS1CANVAS_HOSTED=false --env TWOGUYS1CANVAS_AUTH_MODE=local 2guys1canvas-check "$@"
