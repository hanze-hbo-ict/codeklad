import { test } from 'node:test';
import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import { PassThrough } from 'node:stream';
import { createServer } from 'node:http';
import { waitForPreview } from './preview-ready.mjs';
function child() { return Object.assign(new EventEmitter(), { stdout: new PassThrough(), stderr: new PassThrough(), exitCode: null, signalCode: null }); }
async function server(status, run) {
  const http = createServer((request, response) => { response.writeHead(status); response.end('fixture'); });
  await new Promise((resolve) => http.listen(0, '127.0.0.1', resolve));
  try { await run(`http://127.0.0.1:${http.address().port}/`); }
  finally { await new Promise((resolve) => http.close(resolve)); }
}
test('readiness uses HTTP despite arbitrary ANSI/split startup logs', async () => {
  await server(200, async (url) => {
    const process = child();
    const ready = waitForPreview(process, url, { timeoutMs: 1000 });
    process.stdout.write('\u001b[32mhttp://'); process.stdout.write('\u001b[0m unrelated output');
    await ready;
  });
});
test('early child exit and spawn errors fail with captured diagnostics', async () => {
  for (const event of ['exit', 'error']) {
    const process = child();
    const ready = waitForPreview(process, 'http://127.0.0.1:1/', { timeoutMs: 1000 });
    process.stdout.write('starting'); process.stderr.write('diagnostic text');
    if (event === 'exit') process.emit('exit', 3, null); else process.emit('error', new Error('spawn failed'));
    await assert.rejects(ready, /Preview (exited before readiness|could not start)[\s\S]*starting[\s\S]*diagnostic text/);
  }
});
test('non-successful HTTP responses time out with status and logs', async () => {
  await server(503, async (url) => {
    const process = child();
    const ready = waitForPreview(process, url, { timeoutMs: 100 });
    process.stderr.write('not ready yet');
    await assert.rejects(ready, /timed out after 100ms[\s\S]*HTTP 503[\s\S]*not ready yet/);
  });
});
