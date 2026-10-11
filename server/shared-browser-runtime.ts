import fs from 'node:fs';
import path from 'node:path';
import { browserExecutable } from './isolation/browser.js';
import { browserHash } from './browser-state.js';

/** Server/image-owned selection only. No browser page, model or HTTP input can choose a runtime. */
export function assertSharedBrowserRuntime() {
  const executable = browserExecutable();
  if (process.arch !== 'x64' || !fs.existsSync(executable)) throw new Error('A verified shared-browser runtime is required.');
  const checksum = browserHash(fs.readFileSync(executable));
  if (process.platform === 'win32' && checksum === '798971a4fb66ed219f2cae1e6a0e97ad68a2e935d5e140d7150745b063dea65b') return;
  if (process.platform === 'linux' && executable === '/usr/lib/chromium/chromium-headless-shell' && fs.realpathSync(executable) === executable) {
    const record = JSON.parse(fs.readFileSync(path.resolve('.runtime/shared-browser-runtime.json'), 'utf8'));
    if (record?.schemaVersion === 1 && record.platform === 'linux' && record.architecture === 'x64' && record.executable === executable && typeof record.version === 'string' && /^(?:Chromium|Google Chrome|HeadlessChrome) \d+\.\d+\.\d+\.\d+/.test(record.version) && /^[a-f0-9]{64}$/.test(record.sha256) && checksum === record.sha256) return;
  }
  throw new Error('Shared-browser runtime differs from its trusted image/official Windows checksum. Repair it explicitly; no host fallback.');
}
