import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright-core';
import { waitForPreview } from '../support/preview-ready.mjs';

const origin = 'http://127.0.0.1:4275';
const preview = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', '4275'], { stdio: 'pipe' });
let browser;
const passed = [];
try {
  await waitForPreview(preview, origin);
  browser = await chromium.launch({ executablePath: process.env.CHROME_BIN || '/opt/google/chrome/chrome', headless: true,
    args: process.getuid?.() === 0 ? ['--no-sandbox'] : [] });
  const context = await browser.newContext({ permissions: ['clipboard-read', 'clipboard-write'] });
  const page = await context.newPage();
  await page.goto(origin);
  const editor = page.locator('.cm-content');
  const keyboard = page.keyboard;
  async function setSource(text) {
    await editor.focus(); await keyboard.press('ControlOrMeta+a');
    if (text) await keyboard.insertText(text); else await keyboard.press('Backspace');
  }
  async function source() {
    await keyboard.press('ControlOrMeta+a'); await keyboard.press('ControlOrMeta+c');
    const text = await page.evaluate(() => navigator.clipboard.readText());
    await keyboard.press('ArrowRight');
    return text;
  }
  for (const [open, close] of [['(', ')'], ['[', ']'], ['{', '}']]) {
    await setSource(''); await keyboard.type(open);
    // Type content before inspecting the document: proves the caret was inside.
    await keyboard.type('x'); await keyboard.type(close);
    assert.equal(await source(), `${open}x${close}`);
    await setSource(''); await keyboard.type(open); await keyboard.press('Backspace');
    assert.equal(await source(), '');
  }
  passed.push('three bracket types: real typing, inner caret, closer skip and empty-pair Backspace');
  await setSource(''); await keyboard.type('([{x}])');
  assert.equal(await source(), '([{x}])');
  passed.push('nested pairs and exact native copy');
  await setSource(''); await page.waitForTimeout(600);
  await keyboard.type('('); await keyboard.press('ControlOrMeta+z');
  assert.equal(await source(), '');
  await keyboard.press('ControlOrMeta+y'); assert.equal(await source(), '()');
  passed.push('undo and redo treat bracket insertion as one edit');
  for (const prefix of ['# comment ', 'text = "inside ', "text = 'inside ", 'text = """inside ', 'text = f"inside ']) {
    for (const open of ['(', '[', '{']) {
      await setSource(prefix); await keyboard.type(open);
      assert.equal(await source(), prefix + open);
    }
  }
  for (const quote of ["'", '"']) {
    await setSource(''); await keyboard.type(quote + 'text' + quote);
    assert.equal(await source(), quote + 'text' + quote);
    await setSource(''); await keyboard.type(quote); await keyboard.press('Backspace');
    assert.equal(await source(), '');
    await setSource(''); // CodeMirror skips the entire generated triple closer on one quote key.
    await keyboard.type(quote.repeat(3) + 'text' + quote);
    assert.equal(await source(), quote.repeat(3) + 'text' + quote.repeat(3));
    await setSource('# comment '); await keyboard.type(quote); assert.equal(await source(), '# comment ' + quote);
  }
  for (const prefix of ['f', 'r', 'b', 'fr']) {
    await setSource(prefix); await keyboard.type('"text"'); assert.equal(await source(), prefix + '"text"');
  }
  await setSource(''); await keyboard.type(`"don't"`); assert.equal(await source(), `"don't"`);
  await setSource(''); await keyboard.type("'say \"hello\"'"); assert.equal(await source(), "'say \"hello\"'");
  await setSource(''); await keyboard.type("\"say \\\"hello\\\"\"");
  assert.equal(await source(), "\"say \\\"hello\\\"\"");
  await setSource('text = "inside "'); await keyboard.press('ArrowLeft');
  await keyboard.type('('); assert.equal(await source(), 'text = "inside ("');
  await setSource('text = f"{value}"'); await keyboard.press('ArrowLeft'); await keyboard.press('ArrowLeft');
  await keyboard.type('('); assert.equal(await source(), 'text = f"{value()}"');
  await setSource('value = "done"'); await keyboard.type('(');
  assert.equal(await source(), 'value = "done"()');
  passed.push('comments/string text remain literal; quotes/prefixes/triple quotes close, skip and delete; code after string still pairs');
  for (const mode of ['light', 'dark']) {
    await page.evaluate((mode) => { document.documentElement.dataset.theme = mode; }, mode);
    await setSource('(x)'); await keyboard.press('ArrowLeft');
    await page.waitForFunction(() => document.querySelectorAll('.cm-matchingBracket').length === 2);
    assert.deepEqual(await page.locator('.cm-matchingBracket').allTextContents(), ['(', ')']);
    const match = await page.locator('.cm-matchingBracket').first().evaluate((node) => {
      const css = getComputedStyle(node); return { outline: css.outlineStyle, width: css.outlineWidth, background: css.backgroundColor, text: css.color };
    });
    assert.equal(match.outline, 'solid'); assert.equal(match.width, '1px'); assert.notEqual(match.background, match.text);
    await setSource('(x]'); await keyboard.press('ArrowLeft');
    await page.waitForFunction(() => document.querySelectorAll('.cm-nonmatchingBracket').length > 0);
    const mismatch = await page.locator('.cm-nonmatchingBracket').first().evaluate((node) => {
      const css = getComputedStyle(node); return { outline: css.outlineStyle, decoration: css.textDecorationStyle, background: css.backgroundColor, text: css.color };
    });
    assert.equal(mismatch.outline, 'solid'); assert.equal(mismatch.decoration, 'wavy'); assert.notEqual(mismatch.background, mismatch.text);
  }
  passed.push('matching and mismatching indications in both themes, with visible outline and mismatch underline');
  await setSource('pri'); await keyboard.type('n'); await keyboard.press('Control+Space');
  assert.equal(await page.locator('.cm-tooltip-autocomplete').count(), 0);
  await keyboard.press('Tab'); assert.equal(await editor.evaluate((node) => node === document.activeElement), false);
  assert.equal(await page.getByText('No code completion or AI assistance', { exact: true }).count(), 1);
  passed.push('no completion popup; Tab navigates focus; footer retained');
  console.log(JSON.stringify({ result: 'pass', browser: browser.version(), cases: passed }, null, 2));
} finally {
  await browser?.close(); preview.kill();
}
