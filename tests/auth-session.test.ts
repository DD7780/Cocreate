import test from 'node:test';
import assert from 'node:assert/strict';
import { needsSessionRefresh } from '../src/auth-session.js';

test('session refresh boundary refreshes missing and near-expiry access tokens',()=>{
  const now=2_000_000;
  assert.equal(needsSessionRefresh(undefined,now),true);
  assert.equal(needsSessionRefresh((now+59_000)/1_000,now),true);
  assert.equal(needsSessionRefresh((now+61_000)/1_000,now),false);
});
