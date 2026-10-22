import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSession, SESSION_KEY } from '../../src/session.js';
test('absence differs from an intentional empty document; only source is saved', () => {
  const data = new Map();
  const session = createSession(() => ({ getItem: (key) => data.get(key) ?? null, setItem: (key, value) => data.set(key, value) }), () => assert.fail('unexpected warning'));
  assert.equal(session.restore('initial'), 'initial');
  for (const value of ['def f():\n    return "你好🙂"\n', '']) {
    session.save(value); assert.equal(session.restore('initial'), value);
  }
  assert.deepEqual([...data.keys()], [SESSION_KEY]);
});
test('storage access/read/write failures warn and preserve editable fallback', () => {
  for (const storage of [() => { throw Error('blocked'); }, () => ({ getItem() { throw Error('read'); }, setItem() { throw Error('quota'); } })]) {
    const warnings = []; const session = createSession(storage, (text) => warnings.push(text));
    assert.equal(session.restore('initial'), 'initial'); session.save('edited');
    assert.equal(warnings.length, 2); assert.match(warnings[0], /recovery is unavailable/);
  }
});
