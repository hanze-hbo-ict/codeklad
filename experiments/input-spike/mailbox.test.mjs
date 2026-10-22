import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Worker } from 'node:worker_threads';
import { CAPACITY, HEADER_BYTES, views, submit, STATE, RUN, REQUEST, LENGTH, WAITING, ANSWER, stdinLine } from './mailbox.js';
function pending() {
  const buffer = new SharedArrayBuffer(HEADER_BYTES + CAPACITY);
  const { control } = views(buffer);
  Atomics.store(control, RUN, 42); Atomics.store(control, REQUEST, 7);
  return buffer;
}
test('empty, Unicode, exact capacity; no truncate or stale/duplicate delivery', () => {
  for (const line of ['', '你好 🙂 café', 'a'.repeat(CAPACITY)]) {
    const buffer = pending(); const { control, bytes } = views(buffer);
    assert.deepEqual(submit(buffer, 42, 7, line), { ok: true });
    assert.equal(Atomics.load(control, STATE), ANSWER);
    assert.equal(new TextDecoder().decode(bytes.subarray(0, Atomics.load(control, LENGTH))), line);
    assert.equal(submit(buffer, 42, 7, 'duplicate').ok, false);
  }
  const buffer = pending(); const { control } = views(buffer);
  for (const args of [[41, 7, 'old'], [42, 6, 'old'], [42, 7, '🙂'.repeat(CAPACITY / 4 + 1)], [42, 7, 'a\nb']]) {
    assert.equal(submit(buffer, ...args).ok, false);
    assert.equal(Atomics.load(control, STATE), WAITING);
    assert.equal(Atomics.load(control, LENGTH), 0);
  }
});
test('synchronous worker wait resumes for a delayed answer', async () => {
  const buffer = pending();
  const worker = new Worker(`const { parentPort, workerData } = require('node:worker_threads');
    const c = new Int32Array(workerData, 0, 4);
    parentPort.postMessage('waiting');
    while (Atomics.load(c, 0) === 0) Atomics.wait(c, 0, 0);
    parentPort.postMessage(new TextDecoder().decode(new Uint8Array(workerData, 16, Atomics.load(c, 3))));`,
    { eval: true, workerData: buffer });
  try {
    await new Promise((resolve, reject) => { worker.once('message', resolve); worker.once('error', reject); });
    const answer = new Promise((resolve, reject) => { worker.once('message', resolve); worker.once('error', reject); });
    assert.equal(submit(buffer, 42, 7, 'delayed 🙂').ok, true);
    assert.equal(await answer, 'delayed 🙂');
  } finally { await worker.terminate(); }
});

test('pinned Python runtime receives empty and Unicode input lines', async () => {
  const { loadPyodide } = await import('pyodide');
  const python = await loadPyodide({ stdout: () => {}, stderr: () => {} });
  const expected = ['', '你好 🙂 café'];
  let index = 0;
  python.setStdin({ stdin: () => {
    const buffer = pending();
    assert.equal(submit(buffer, 42, 7, expected[index++]).ok, true);
    return stdinLine(buffer);
  } });
  assert.equal(python.runPython('repr(input())'), "''");
  assert.equal(python.runPython('input()'), expected[1]);
  assert.equal(index, 2);
});
