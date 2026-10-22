import { CAPACITY, HEADER_BYTES, submit } from './mailbox.js';
const $ = (id) => document.getElementById(id);
const examples = {
  input: 'first = input("First: ")\nsecond = input("Second: ")\nprint("Answers:", repr(first), repr(second))',
  loop: 'while True:\n    pass',
  modules: 'import math\nprint(math.sqrt(25))\nimport definitely_unavailable_klode_module',
};
let worker, buffer, generation = 0, nextRun = 0, activeRun = null, pending = null, state = 'loading';
function setState(value) {
  state = value;
  $('status').textContent = value;
  $('run').disabled = value !== 'ready';
  $('stop').disabled = value === 'failed';
  $('input-form').hidden = value !== 'waiting-for-input';
}
function initialise() {
  worker?.terminate();
  generation += 1;
  const currentGeneration = generation;
  activeRun = null; pending = null;
  buffer = new SharedArrayBuffer(HEADER_BYTES + CAPACITY);
  setState('loading');
  worker = new Worker(new URL('./worker.js', import.meta.url), { type: 'module' });
  worker.onmessage = ({ data }) => {
    if (currentGeneration !== generation) return;
    if (data.type === 'ready') { setState('ready'); return; }
    if (data.runId !== activeRun) {
      if (data.type === 'failed' && state === 'loading') { $('error').textContent = data.error; setState('failed'); }
      return;
    }
    if (data.type === 'output') $('output').textContent += data.text;
    if (data.type === 'input-request') {
      pending = { runId: data.runId, requestId: data.requestId };
      $('answer').value = ''; setState('waiting-for-input'); $('answer').focus();
    }
    if (data.type === 'completed' || data.type === 'failed') {
      if (data.type === 'failed') $('error').textContent = data.error;
      activeRun = null; pending = null; setState('ready');
    }
  };
  worker.onerror = (event) => {
    if (currentGeneration !== generation) return;
    $('error').textContent = event.message; activeRun = null; pending = null; setState('failed');
  };
  worker.postMessage({ type: 'initialise', mailbox: buffer, runtimeURL: new URL('/runtime/314.0.7/', location.origin).href });
}
$('source').value = examples.input;
$('example').onchange = () => { $('source').value = examples[$('example').value]; };
$('run').onclick = () => {
  if (state !== 'ready') return;
  activeRun = ++nextRun;
  $('output').textContent = ''; $('error').textContent = ''; pending = null;
  setState('running'); worker.postMessage({ type: 'run', runId: activeRun, source: $('source').value });
};
$('stop').onclick = () => { $('error').textContent = ''; initialise(); };
$('input-form').onsubmit = (event) => {
  event.preventDefault();
  if (!pending || state !== 'waiting-for-input') return;
  const result = submit(buffer, pending.runId, pending.requestId, $('answer').value);
  $('error').textContent = result.error ?? '';
  if (result.ok) { pending = null; setState('running'); }
};
if (!crossOriginIsolated || typeof SharedArrayBuffer === 'undefined') {
  $('error').textContent = 'Interactive input requires a secure origin with COOP same-origin and COEP require-corp.';
  setState('failed');
} else initialise();
