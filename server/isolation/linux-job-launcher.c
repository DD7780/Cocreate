#include <errno.h>
#include <signal.h>
#include <stdio.h>
#include <sys/prctl.h>
#include <unistd.h>

/* Trusted launcher only. Candidate execution cannot begin before parent attachment. */
int main(int argc, char **argv) {
    if (argc < 2) return 126;
    pid_t parent = getppid();
    if (parent <= 1 || prctl(PR_SET_PDEATHSIG, SIGKILL) != 0 || getppid() != parent) return 126;
    if (raise(SIGSTOP) != 0) return 126;
    execv(argv[1], &argv[1]);
    perror("Isolated launcher exec");
    return errno == ENOENT ? 127 : 126;
}
