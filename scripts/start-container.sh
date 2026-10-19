#!/bin/sh
set -eu
# Bootstrap alone has privilege. The application and all jobs run as node with no capabilities.
mount_root=${COCREATE_CGROUP_MOUNT:-/sys/fs/cgroup}
test "$(/usr/bin/findmnt -n -o FSTYPE -T "$mount_root")" = cgroup2
case "$mount_root" in /sys/fs/cgroup|/run/cocreate-cgroup) ;; *) exit 126 ;; esac
test "$(id -u)" = 0
root="$mount_root/cocreate"
if test -d "$root"; then
  grep -q '^populated 0$' "$root/cgroup.events"
  for leaf in "$root/jobs"/*; do if test -d "$leaf"; then rmdir "$leaf"; fi; done
  rmdir "$root/jobs" "$root/app" "$root"
fi
mkdir "$root"
mkdir "$root/app"
echo $$ > "$root/app/cgroup.procs"
echo '+memory +pids' > "$root/cgroup.subtree_control"
echo 1073741824 > "$root/memory.max"
echo 0 > "$root/memory.swap.max"
echo 256 > "$root/pids.max"
mkdir "$root/jobs"
echo 536870912 > "$root/jobs/memory.max"
echo 0 > "$root/jobs/memory.swap.max"
echo 64 > "$root/jobs/pids.max"
echo '+memory +pids' > "$root/jobs/cgroup.subtree_control"
# Leave aggregate controller limits root-owned. Delegate migration at the common ancestor.
chown 1000:1000 "$root/cgroup.procs" "$root/app/cgroup.procs"
chown 1000:1000 "$root/jobs" "$root/jobs/cgroup.procs"
export COCREATE_LINUX_CGROUP_ROOT="$root"
exec /usr/bin/setpriv --reuid=1000 --regid=1000 --init-groups --bounding-set=-all --inh-caps=-all --ambient-caps=-all --no-new-privs /usr/bin/tini -s -- "$@"
