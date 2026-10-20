import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createCoCreateServer } from '../server/index.js';

test('built application routes work below hidden checkout directories without exposing dotfiles', async () => {
  const previousDirectory = process.cwd(), previousMode = process.env.NODE_ENV;
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'historical-spa-'));
  const checkout = path.join(temporary, '.hidden-checkout');
  fs.mkdirSync(path.join(checkout, 'dist'), { recursive: true });
  fs.writeFileSync(path.join(checkout, 'dist', 'index.html'), '<main>Historical application</main>');
  fs.writeFileSync(path.join(checkout, 'dist', '.env'), 'SECRET_SENTINEL');
  process.chdir(checkout);
  process.env.NODE_ENV = 'production';
  let service: Awaited<ReturnType<typeof createCoCreateServer>> | undefined;
  try {
    service = await createCoCreateServer({ port: 0, host: '127.0.0.1', dataDir: path.join(temporary, 'data') });
    const { port } = await service.start();
    for (const route of ['/app', '/login', '/r/test', '/.env']) {
      const response = await fetch(`http://127.0.0.1:${port}${route}`);
      assert.equal(response.status, 200, route);
      assert.equal(await response.text(), '<main>Historical application</main>');
    }
    const unknown = await fetch(`http://127.0.0.1:${port}/api/unknown`);
    assert.equal(unknown.status, 404);
    assert.deepEqual(await unknown.json(), { error: 'API route not found.' });
  } finally {
    await service?.stop();
    process.chdir(previousDirectory);
    if (previousMode === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = previousMode;
    assert.equal(path.dirname(temporary), path.resolve(os.tmpdir()));
    fs.rmSync(temporary, { recursive: true, force: true });
  }
});
