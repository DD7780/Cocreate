import childProcess, {type SpawnOptions} from 'node:child_process';
import {syncBuiltinESMExports} from 'node:module';

// CI only: attach the stopped job before tracing, preserving the production cgroup handshake.
const spawn = childProcess.spawn;
Object.defineProperty(childProcess, 'spawn', {value: (file: string, input: readonly string[] | SpawnOptions = [], options?: SpawnOptions) => {
  const args: readonly string[] = Array.isArray(input) ? input : [];
  const settings = Array.isArray(input) ? options : input as SpawnOptions;
  const child = spawn(file, file === '/usr/local/bin/cocreate-job-launcher' ? ['/usr/bin/strace', '-f', '-qq', '-yy',
    '-e', 'trace=ftruncate,truncate', '-e', 'signal=SIGXFSZ', ...args] : args, settings ?? {});
  if (file === '/usr/local/bin/cocreate-job-launcher') {
    let bytes = 0;
    child.stderr?.on('data', chunk => {
      bytes += Buffer.byteLength(chunk);
      if (bytes <= 16_000) process.stderr.write(chunk);
    });
  }
  return child;
}});
syncBuiltinESMExports();
try {
  const {assertVerificationBrowserAvailable, withIsolatedBrowser} = await import('../server/isolation/browser.js');
  if (process.argv.includes('--output')) {
    await withIsolatedBrowser(async browser => {
      const {targetId} = await browser.call('Target.createTarget', {url: 'about:blank'});
      const {sessionId} = await browser.call('Target.attachToTarget', {targetId, flatten: true});
      await browser.call('Runtime.evaluate', {expression: "'x'.repeat(5*1024*1024)", returnByValue: true}, sessionId);
    });
  } else await assertVerificationBrowserAvailable();
} finally {
  childProcess.spawn = spawn;
  syncBuiltinESMExports();
}
