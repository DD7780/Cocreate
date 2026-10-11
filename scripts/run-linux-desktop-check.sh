#!/bin/sh
set -eu
root=${COCREATE_DESKTOP_CI_ROOT:?Dedicated CI desktop cgroup root required}
case "$root" in /sys/fs/cgroup/cocreate-desktop-ci-*) ;; *) exit 126 ;; esac
test "$(cat "$root/memory.max")" = 3221225472
test "$(cat "$root/pids.max")" = 256
exec docker run --rm --network none --cap-drop ALL \
  --cap-add CHOWN --cap-add SETUID --cap-add SETGID --cap-add SETPCAP \
  --security-opt no-new-privileges --security-opt seccomp=unconfined \
  --security-opt apparmor=unconfined --security-opt systempaths=unconfined \
  --memory 3g --memory-swap 3g --pids-limit 256 --cgroupns host \
  --volume "$root:/run/cocreate-cgroup:rw" --env COCREATE_CGROUP_MOUNT=/run/cocreate-cgroup \
  --env COCREATE_INTERACTIVE_BLENDER=linux-xvfb-v1 --env COCREATE_HOSTED=false --env COCREATE_AUTH_MODE=local cocreate-check "$@"
