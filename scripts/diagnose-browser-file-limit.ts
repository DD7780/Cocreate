import childProcess, {type SpawnOptions} from 'node:child_process';
import {syncBuiltinESMExports} from 'node:module';

// CI only: attach the stopped job before tracing, preserving the production cgroup handshake.
const spawn = childProcess.spawn;
Object.defineProperty(childProcess, 'spawn', {value: (file: string, input: readonly string[] | SpawnOptions = [], options?: SpawnOptions) => {
  const args: readonly string[] = Array.isArray(input) ? input : [];
  const settings = Array.isArray(input) ? options : input as SpawnOptions;
  return spawn(file, file === '/usr/local/bin/cocreate-job-launcher' ? ['/usr/bin/strace', '-f', '-yy',
    '-e', 'trace=ftruncate,truncate', '-e', 'signal=SIGXFSZ', ...args] : args, settings ?? {});
}});
syncBuiltinESMExports();
try {
  const {assertVerificationBrowserAvailable} = await import('../server/isolation/browser.js');
  await assertVerificationBrowserAvailable();
} finally {
  childProcess.spawn = spawn;
  syncBuiltinESMExports();
}
