import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { chromium } from 'playwright-core';
const port = 4275, origin = `http://127.0.0.1:${port}`;
const preview = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', String(port)], { stdio: 'pipe' });
let browser, negative;
const passed = [];
try {
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Preview startup timed out')), 15000);
    preview.stdout.on('data', (chunk) => { if (String(chunk).includes(origin)) { clearTimeout(timeout); resolve(); } });
    preview.once('exit', (code) => { clearTimeout(timeout); reject(new Error(`Preview exited ${code}`)); });
  });
  browser = await chromium.launch({ executablePath: process.env.CHROME_BIN || '/opt/google/chrome/chrome', headless: true,
    args: process.getuid?.() === 0 ? ['--no-sandbox'] : [] });
  const context = await browser.newContext({ serviceWorkers: 'block', permissions: ['clipboard-read', 'clipboard-write'], viewport: { width: 1280, height: 900 } });
  const requests = [], blocked = [], errors = [];
  context.on('request', (request) => requests.push(request.url()));
  await context.route('**/*', async (route) => {
    if (new URL(route.request().url()).origin !== origin) { blocked.push(route.request().url()); await route.abort(); return; }
    await route.continue();
  });
  const page = await context.newPage(); page.on('pageerror', (error) => errors.push(String(error)));
  const state = (value) => page.waitForFunction((v) => document.querySelector('#status').dataset.state === v, value, { timeout: 30000 });
  const editor = page.locator('.cm-content');
  async function edit(text) {
    await editor.click(); await page.keyboard.press('ControlOrMeta+a');
    if (text) await page.keyboard.insertText(text); else await page.keyboard.press('Backspace');
    await page.waitForFunction((expected) => sessionStorage.getItem('klode.source.v1') === expected, text);
  }
  async function run(text) { await edit(text); await page.locator('#run').click(); }
  async function answer(text) { await state('waiting-for-input'); await page.locator('#answer').fill(text); await page.locator('#submit').click(); }
  await page.goto(origin); await state('ready');
  assert.equal(await page.evaluate(() => crossOriginIsolated), true);
  await run('print(2 + 3)'); await state('ready');
  assert.equal(await page.locator('#output').textContent(), '5\n'); passed.push('run/edit');
  for (const [code, expected] of [['if :', /SyntaxError/], ['1 / 0', /ZeroDivisionError/]]) {
    await run(code); await state('ready'); assert.match(await page.locator('#error').textContent(), expected);
  }
  await run('print("corrected")'); await state('ready'); assert.equal(await page.locator('#error').isVisible(), false); passed.push('syntax/runtime error recovery');
  await run('first=input("First: ")\nsecond=input("Second: ")\nprint(repr(first), repr(second))');
  await state('waiting-for-input'); assert.equal(await page.locator('#output').textContent(), 'First: ');
  assert.equal(await page.locator('#run').isDisabled(), true);
  await page.locator('#theme').selectOption('dark');
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
  await answer(''); await answer('你好 🙂 café'); await state('ready');
  assert.equal(await page.locator('#output').textContent(), "First: Second: '' '你好 🙂 café'\n"); passed.push('ordered empty/Unicode input; responsive waiting UI');
  await run('print("Prompt", end="")\nx=input()\nprint(len(x))'); await state('waiting-for-input');
  assert.equal(await page.locator('#output').textContent(), 'Prompt');
  await answer('🙂'.repeat(16385)); assert.match(await page.locator('#error').textContent(), /65536/);
  await answer('ok'); await state('ready'); assert.equal(await page.locator('#output').textContent(), 'Prompt2\n'); passed.push('no-newline prompt; oversize retry');
  for (const code of ['input("Wait: ")', 'while True:\n    pass', 'while True:\n    print("x")']) {
    await run(code); await state(code.startsWith('input') ? 'waiting-for-input' : 'running');
    if (code.includes('print')) await page.waitForTimeout(200);
    await page.locator('#stop').click({ timeout: 5000 }); await state('ready');
    assert.equal(await page.evaluate(() => sessionStorage.getItem('klode.source.v1')), code);
    await page.locator('#input-form').evaluate((form) => form.dispatchEvent(new Event('submit', { cancelable: true })));
    await run('print(5)'); await state('ready'); assert.equal(await page.locator('#output').textContent(), '5\n');
  }
  passed.push('Stop wait/loop/output flood, stale form and rerun preserves source');
  await run('for i in range(1000):\n    print(i)'); await state('ready');
  assert.equal(await page.locator('#output').textContent(), Array.from({ length: 1000 }, (_, i) => `${i}\n`).join(''));
  await run('import sys\nfor i in range(100):\n    print("out", end="", flush=True)\n    print("err", end="", file=sys.stderr, flush=True)'); await state('ready');
  assert.equal(await page.locator('#output').textContent(), 'outerr'.repeat(100));
  await run('print("tail", end="")'); await state('ready');
  assert.equal(await page.locator('#output').textContent(), 'tail');
  await run('for i in range(1000):\n    print(i)\ninput("Last prompt: ")'); await state('waiting-for-input');
  assert.equal(await page.locator('#output').evaluate((output) => output.scrollHeight - output.scrollTop - output.clientHeight <= 2), true);
  assert.ok((await page.locator('#output').textContent()).endsWith('Last prompt: '));
  await answer(''); await state('ready');
  passed.push('batched finite output preserves every line, flushed stream order, final tail and visible prompt after long output');
  await run('x=42'); await state('ready'); await run('print(x)'); await state('ready');
  assert.match(await page.locator('#error').textContent(), /NameError/); passed.push('fresh namespaces');
  await run('import math\nprint(math.sqrt(25))\nimport definitely_unavailable_klode_module'); await state('ready');
  assert.equal(await page.locator('#output').textContent(), '5.0\n'); assert.match(await page.locator('#error').textContent(), /ModuleNotFoundError/);
  await run('print("<img src=x onerror=alert(1)>")'); await state('ready');
  assert.equal(await page.locator('#output img').count(), 0); passed.push('supported/unavailable imports; safe output');
  const multiline = 'def greet():\n    print("你好🙂")\n\ngreet()\n';
  await edit(multiline); await page.keyboard.press('ControlOrMeta+a'); await page.keyboard.press('ControlOrMeta+c');
  assert.equal(await page.evaluate(() => navigator.clipboard.readText()), multiline); passed.push('native multiline clipboard');
  await page.reload(); await state('ready');
  assert.equal(await page.evaluate(() => sessionStorage.getItem('klode.source.v1')), multiline);
  assert.equal((await page.locator('.cm-line').allTextContents()).join('\n'), multiline);
  await edit(''); await page.reload(); await state('ready');
  assert.equal(await editor.textContent(), ''); passed.push('reload exact nonempty/empty source');
  await edit('if True:'); await page.keyboard.press('End'); await page.keyboard.press('Enter');
  await page.waitForFunction(() => sessionStorage.getItem('klode.source.v1') === 'if True:\n    ');
  assert.ok(await page.locator('.cm-line span').count() > 0);
  await page.keyboard.insertText('pri'); await page.waitForTimeout(300);
  await page.keyboard.press('Control+Space');
  assert.equal(await page.locator('.cm-tooltip-autocomplete').count(), 0); passed.push('syntax, automatic indentation, no completion');
  const retained = await page.evaluate(() => sessionStorage.getItem('klode.source.v1'));
  for (const width of [360, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    for (const mode of ['system', 'light', 'dark']) {
      await page.locator('#theme').selectOption(mode);
      if (mode !== 'system') assert.equal(await page.locator('html').getAttribute('data-theme'), mode);
    }
    for (const id of ['run', 'stop', 'console-title']) await page.locator(`#${id}`).scrollIntoViewIfNeeded();
  }
  await page.locator('#theme').selectOption('system'); await page.emulateMedia({ colorScheme: 'dark' });
  await page.waitForFunction(() => document.documentElement.dataset.theme === 'dark');
  await page.emulateMedia({ colorScheme: 'light' }); await page.waitForFunction(() => document.documentElement.dataset.theme === 'light');
  assert.equal(await page.evaluate(() => sessionStorage.getItem('klode.source.v1')), retained); passed.push('360/1280 layout and live system/manual themes preserve source');
  const storagePage = await context.newPage();
  await storagePage.addInitScript(() => { Object.defineProperty(window, 'sessionStorage', { get() { throw new DOMException('Blocked', 'SecurityError'); } }); });
  await storagePage.goto(origin); await storagePage.waitForFunction(() => document.querySelector('#status').dataset.state === 'ready');
  assert.equal(await storagePage.locator('#storage-warning').isVisible(), true);
  await storagePage.locator('.cm-content').click(); await storagePage.keyboard.press('ControlOrMeta+a'); await storagePage.keyboard.insertText('print(8)');
  await storagePage.locator('#run').click(); await storagePage.waitForFunction(() => document.querySelector('#output').textContent === '8\n');
  passed.push('blocked storage warns with editing/execution retained');
  assert.deepEqual(errors, []); assert.deepEqual(blocked, []);
  for (const file of ['pyodide.mjs', 'pyodide.asm.mjs', 'pyodide.asm.wasm', 'python_stdlib.zip', 'pyodide-lock.json']) {
    assert.ok(requests.includes(`${origin}/runtime/314.0.7/${file}`), `Missing runtime request ${file}`);
  }
  passed.push('cold context same-origin worker/runtime audit');
  const html = (await readFile('dist/index.html', 'utf8')).replaceAll('src="/assets/', `src="${origin}/assets/`).replaceAll('href="/assets/', `href="${origin}/assets/`);
  negative = createServer((req, res) => { res.setHeader('Content-Type', 'text/html'); res.end(html); });
  await new Promise((resolve) => negative.listen(4276, '127.0.0.1', resolve));
  const negativePage = await browser.newPage(); await negativePage.goto('http://127.0.0.1:4276');
  await negativePage.waitForFunction(() => document.querySelector('#status').dataset.state === 'failed');
  assert.match(await negativePage.locator('#error').textContent(), /provided secure link/); assert.equal(await negativePage.locator('#run').isDisabled(), true); passed.push('missing isolation capability failure');
  console.log(JSON.stringify({ result: 'pass', browser: browser.version(), cases: passed, requests: [...new Set(requests)] }, null, 2));
} finally {
  await browser?.close(); if (negative) await new Promise((resolve) => negative.close(resolve)); preview.kill();
}
