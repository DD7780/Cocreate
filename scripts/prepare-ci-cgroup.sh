#!/bin/sh
set -eu
test "$(id -u)" = 0
root=${1:?Fixed disposable CI root required}
case "$root" in /sys/fs/cgroup/cocreate-ci-*) ;; *) exit 126 ;; esac
test "$(/usr/bin/findmnt -n -o FSTYPE -T /sys/fs/cgroup)" = cgroup2
test ! -e "$root"
echo '+memory +pids' > /sys/fs/cgroup/cgroup.subtree_control
mkdir "$root"
echo 1073741824 > "$root/memory.max"
echo 0 > "$root/memory.swap.max"
echo 256 > "$root/pids.max"
echo '+memory +pids' > "$root/cgroup.subtree_control"
