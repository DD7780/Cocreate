#!/bin/sh
set -eu
# Disposable CI only; the bound parent covers both the app and delegated jobs after migration.
root=${COCREATE_CI_CGROUP_ROOT:?CI cgroup root required}
case "$root" in /sys/fs/cgroup/cocreate-ci-*) ;; *) exit 126 ;; esac
test "$(cat "$root/memory.max")" = 1073741824
test "$(cat "$root/pids.max")" = 256
exec docker run --rm --network none --cap-drop ALL \
  --cap-add CHOWN --cap-add SETUID --cap-add SETGID --cap-add SETPCAP \
  --security-opt no-new-privileges --security-opt seccomp=unconfined \
  --security-opt apparmor=unconfined --security-opt systempaths=unconfined \
  --memory 1g --memory-swap 1g --pids-limit 256 --cgroupns host \
  --volume "$root:/run/cocreate-cgroup:rw" --env COCREATE_CGROUP_MOUNT=/run/cocreate-cgroup \
  --env COCREATE_HOSTED=false --env COCREATE_AUTH_MODE=local cocreate-check "$@"
