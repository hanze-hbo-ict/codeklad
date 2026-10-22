import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { chromium } from 'playwright-core';
const port = 4273;
const origin = `http://127.0.0.1:${port}`;
const preview = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', String(port)], { stdio: 'pipe' });
let browser, negative;
try {
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Preview startup timed out')), 15000);
    preview.stdout.on('data', (chunk) => { if (String(chunk).includes(origin)) { clearTimeout(timeout); resolve(); } });
    preview.once('exit', (code) => { clearTimeout(timeout); reject(new Error(`Preview exited ${code}`)); });
  });
  browser = await chromium.launch({ executablePath: process.env.CHROME_BIN || '/opt/google/chrome/chrome', headless: true,
    args: process.getuid?.() === 0 ? ['--no-sandbox'] : [] });
  const context = await browser.newContext({ serviceWorkers: 'block' });
  const requests = [];
  const blocked = [];
  context.on('request', (request) => requests.push(request.url()));
  await context.route('**/*', async (route) => {
    const url = route.request().url();
    if (new URL(url).origin !== origin) { blocked.push(url); await route.abort(); return; }
    await route.continue();
  });
  const page = await context.newPage();
  const errors = []; page.on('pageerror', (error) => errors.push(String(error)));
  await page.goto(`${origin}/experiments/input-spike/index.html`);
  const state = (value) => page.waitForFunction((v) => document.querySelector('#status').textContent === v, value, { timeout: 30000 });
  await state('ready');
  assert.equal(await page.evaluate(() => crossOriginIsolated), true);
  const source = async (text) => { await page.locator('#source').fill(text); await page.locator('#run').click(); };
  const answer = async (text) => { await state('waiting-for-input'); await page.locator('#answer').fill(text); await page.locator('#submit').click(); };
  await source('a=input("First: ")\nb=input("Second: ")\nprint(repr(a), repr(b))');
  await state('waiting-for-input');
  assert.equal(await page.locator('#output').textContent(), 'First: ');
  await answer(''); await answer('你好 🙂 café'); await state('ready');
  assert.equal(await page.locator('#output').textContent(), "First: Second: '' '你好 🙂 café'\n");
  await source('print("No newline", end="")\nx=input()\nprint(len(x))');
  await state('waiting-for-input');
  assert.equal(await page.locator('#output').textContent(), 'No newline');
  await answer('a'.repeat(65537));
  assert.match(await page.locator('#error').textContent(), /65536/);
  await state('waiting-for-input'); await answer('ok'); await state('ready');
  assert.equal(await page.locator('#output').textContent(), 'No newline2\n');
  for (const code of ['input("Wait: ")', 'while True:\n    pass']) {
    await source(code); await state(code.startsWith('input') ? 'waiting-for-input' : 'running');
    const retained = await page.locator('#source').inputValue();
    await page.locator('#stop').click(); await state('ready');
    assert.equal(await page.locator('#source').inputValue(), retained);
    // A submitted event from an obsolete form must not enter a new execution.
    await page.locator('#input-form').evaluate((form) => form.dispatchEvent(new Event('submit', { cancelable: true })));
    await source('print(5)'); await state('ready');
    assert.equal(await page.locator('#output').textContent(), '5\n');
  }
  await source('import math\nprint(math.sqrt(25))\nimport definitely_unavailable_klode_module');
  await state('ready'); assert.match(await page.locator('#error').textContent(), /ModuleNotFoundError/);
  assert.equal(await page.locator('#output').textContent(), '5.0\n');
  assert.deepEqual(errors, []);
  assert.deepEqual(blocked, [], 'No external network request should be attempted');
  for (const file of ['pyodide.mjs', 'pyodide.asm.mjs', 'pyodide.asm.wasm', 'python_stdlib.zip', 'pyodide-lock.json']) {
    assert.ok(requests.some((url) => url === `${origin}/runtime/314.0.7/${file}`), `Missing observed runtime request ${file}`);
  }
  // Serve exactly the built HTML without COOP/COEP; script asset URLs still point
  // to the production preview. Startup must refuse unavailable shared memory.
  const html = (await readFile('dist/experiments/input-spike/index.html', 'utf8')).replaceAll('src="/assets/', `src="${origin}/assets/`);
  negative = createServer((request, response) => { response.setHeader('Content-Type', 'text/html'); response.end(html); });
  await new Promise((resolve) => negative.listen(4274, '127.0.0.1', resolve));
  const negativePage = await browser.newPage();
  await negativePage.goto('http://127.0.0.1:4274/');
  await negativePage.waitForFunction(() => document.querySelector('#status').textContent === 'failed');
  assert.match(await negativePage.locator('#error').textContent(), /COOP/);
  assert.equal(await negativePage.locator('#run').isDisabled(), true);
  console.log(JSON.stringify({ result: 'pass', browser: browser.version(), requests: [...new Set(requests)], cases: ['empty/Unicode', 'no-newline prompt', 'oversize', 'Stop wait/loop and rerun', 'stale form', 'stdlib/unavailable import', 'capability failure'] }, null, 2));
} finally {
  await browser?.close();
  if (negative) await new Promise((resolve) => negative.close(resolve));
  preview.kill();
}
