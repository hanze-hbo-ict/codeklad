import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createExecutionControl, STOP_REVEAL_MS } from '../../src/execution.js';

function harness() {
  let view;
  const jobs = [], cleared = [], actions = [];
  const control = createExecutionControl((next) => { view = next; },
    Object.fromEntries(['run', 'stop', 'retry'].map((action) => [action, () => actions.push(action)])), {
      set(callback, delay) { jobs.push({ callback, delay }); return jobs.length - 1; },
      clear(id) { cleared.push(id); },
    });
  return { control, jobs, cleared, actions, view: () => view };
}

test('short completion and rapid rerun invalidate even queued old callbacks', () => {
  const h = harness();
  h.control.state('ready'); h.control.activate();
  assert.deepEqual(h.actions, ['run']);
  h.control.state('running');
  assert.deepEqual(h.view(), { label: 'Run code', disabled: true });
  h.control.activate(); assert.deepEqual(h.actions, ['run']);
  assert.equal(h.jobs[0].delay, STOP_REVEAL_MS);
  h.control.state('ready');
  h.jobs[0].callback();
  assert.deepEqual(h.view(), { label: 'Run code', disabled: false });
  h.control.state('running');
  h.jobs[0].callback();
  assert.deepEqual(h.view(), { label: 'Run code', disabled: true });
  h.jobs[1].callback();
  assert.deepEqual(h.view(), { label: 'Stop', disabled: false });
  h.control.activate(); assert.deepEqual(h.actions, ['run', 'stop']);
  assert.ok(h.cleared.includes(0));
});

test('input wait bypasses delay and accepted/repeated input retains Stop', () => {
  const h = harness();
  h.control.state('ready'); h.control.state('running');
  h.control.state('waiting-for-input');
  assert.deepEqual(h.view(), { label: 'Stop', disabled: false });
  h.control.state('running'); h.control.state('waiting-for-input'); h.control.state('running');
  assert.equal(h.jobs.length, 1);
  assert.deepEqual(h.view(), { label: 'Stop', disabled: false });
  h.jobs[0].callback();
  h.control.activate(); assert.deepEqual(h.actions, ['stop']);
  h.control.state('ready'); h.control.state('running');
  assert.equal(h.jobs.length, 2);
  assert.deepEqual(h.view(), { label: 'Run code', disabled: true });
});

test('loading, stopping and failure cancel delayed Stop; Retry dispatches startup only', () => {
  for (const state of ['loading', 'stopping', 'failed']) {
    const h = harness();
    h.control.state('ready'); h.control.state('running'); h.control.state(state);
    const expected = state === 'loading' ? 'Loading…' : state === 'stopping' ? 'Stopping…' : 'Retry';
    h.jobs[0].callback();
    assert.deepEqual(h.view(), { label: expected, disabled: state !== 'failed' });
    h.control.activate();
    assert.deepEqual(h.actions, state === 'failed' ? ['retry'] : []);
    h.control.state('loading'); h.control.state('ready');
    assert.deepEqual(h.view(), { label: 'Run code', disabled: false });
  }
});

test('duplicate running signals keep one timer and ordinary completion restores Run', () => {
  const h = harness();
  h.control.state('ready'); h.control.state('running'); h.control.state('running');
  assert.equal(h.jobs.length, 1);
  h.jobs[0].callback(); h.control.state('running');
  assert.equal(h.jobs.length, 1);
  h.control.state('ready'); h.control.activate();
  assert.deepEqual(h.actions, ['run']);
});
