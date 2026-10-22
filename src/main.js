import './styles.css';
import { createEditor } from './editor.js';
import { createTheme } from './theme.js';
import { createOutput } from './output.js';
import { createInput } from './input.js';
import { createRuntime } from './runtime/client.js';
const $ = (id) => document.getElementById(id);
createTheme($('theme'));
const editor = createEditor($('editor'), '# Write your Python code here\nprint("Hello, world!")\n', () => {});
const output = createOutput($('output'), $('error'), $('output-placeholder'));
const labels = { loading: 'Loading Python…', ready: 'Ready', running: 'Running', 'waiting-for-input': 'Waiting for input', stopping: 'Stopping…', failed: 'Unavailable' };
const input = createInput($('input-form'), $('answer'), (identity, line) => {
  const result = runtime.answer(identity, line);
  if (result.ok) { output.append(line + '\n'); output.flush(); output.reveal(); }
  output.error(result.error ?? ''); return result.ok;
});
const runtime = createRuntime((event) => {
  if (event.type === 'state') {
    output.flush();
    if (event.state === 'ready' || event.state === 'waiting-for-input') output.reveal();
    $('status').textContent = labels[event.state]; $('status').dataset.state = event.state;
    $('run').disabled = event.state !== 'ready';
    $('stop').disabled = event.state === 'loading' || event.state === 'stopping';
    $('stop').textContent = event.state === 'failed' ? 'Retry' : 'Stop';
    if (event.state !== 'waiting-for-input') input.clear();
  }
  if (event.type === 'input') input.request(event.identity);
  if (event.type === 'output') output.append(event.text);
  if (event.type === 'error') output.error(event.text);
});
$('run').addEventListener('click', () => { if (!$('run').disabled) { output.clear(); runtime.run(editor.source()); } });
$('stop').addEventListener('click', () => { output.error(''); runtime.stop(); });
runtime.initialise();
