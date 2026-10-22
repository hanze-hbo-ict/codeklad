import { views, STATE, RUN, REQUEST, LENGTH, WAITING, ANSWER, CAPACITY, stdinLine } from './mailbox.js';
let python, mailbox, runId = 0, requestId = 0;
const send = (type, fields = {}) => postMessage({ type, runId, ...fields });
function readLine() {
  const { control } = views(mailbox);
  requestId += 1;
  Atomics.store(control, RUN, runId);
  Atomics.store(control, REQUEST, requestId);
  Atomics.store(control, LENGTH, 0);
  Atomics.store(control, STATE, WAITING);
  send('input-request', { requestId });
  while (Atomics.load(control, STATE) === WAITING) Atomics.wait(control, STATE, WAITING);
  const length = Atomics.load(control, LENGTH);
  if (Atomics.load(control, STATE) !== ANSWER || Atomics.load(control, RUN) !== runId ||
      Atomics.load(control, REQUEST) !== requestId || length < 0 || length > CAPACITY) throw new Error('Invalid input mailbox');
  // Return an explicit newline even for empty answers.
  return stdinLine(mailbox);
}
function output(channel) {
  const decoder = new TextDecoder();
  return { write(bytes) { send('output', { channel, text: decoder.decode(bytes, { stream: true }) }); return bytes.length; } };
}
onmessage = async ({ data }) => {
  try {
    if (data.type === 'initialise') {
      if (!self.crossOriginIsolated || typeof SharedArrayBuffer === 'undefined') throw new Error('Worker is not cross-origin isolated');
      mailbox = data.mailbox;
      const { loadPyodide } = await import(/* @vite-ignore */ `${data.runtimeURL}pyodide.mjs`);
      python = await loadPyodide({ indexURL: data.runtimeURL, packages: [], stdout: () => {}, stderr: () => {} });
      python.setStdout(output('stdout'));
      python.setStderr(output('stderr'));
      python.setStdin({ stdin: readLine, isatty: false });
      send('ready', { isolated: self.crossOriginIsolated, version: python.version });
    } else if (data.type === 'run') {
      runId = data.runId;
      requestId = 0;
      const globals = python.toPy({ __name__: '__main__' });
      try {
        // No loadPackagesFromImports, micropip or automatic import downloads.
        const result = python.runPython(data.source, { globals, filename: 'main.py' });
        result?.destroy?.();
        send('completed');
      } finally { globals.destroy(); }
    }
  } catch (error) { send('failed', { error: String(error) }); }
};
