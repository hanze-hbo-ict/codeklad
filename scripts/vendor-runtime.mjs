import { readFile, mkdir, copyFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

// npm ci verifies the release archive against package-lock.json integrity;
// independently pin every deployed runtime file to prevent accidental drift.
const version = '314.0.7';
const hashes = {
  'pyodide.mjs': '6f1d60f7bf529beb300f0f47983c921d3982363640ba20af0e38efdddbc66109',
  'pyodide.asm.mjs': 'f7cdc8ece80678ceb712f8e65ebe6d3a83203a180c399865f49612a051693635',
  'pyodide.asm.wasm': 'cc36e3cab04fdfc9a63ff13eb52eae2b911bf46c025cc7b281f394bd3de1d5e6',
  'python_stdlib.zip': 'fa1957e5777068fc4f7437f96d860ae2fbe9c19732ba06c84e004ec16dd7dd7a',
  'pyodide-lock.json': '5dc2fc119108bc148c7457dc86e7675b5c87e1cafd420b9c34c1eaef7b36c010',
};
const root = new URL('../', import.meta.url);
const pkg = JSON.parse(await readFile(new URL('node_modules/pyodide/package.json', root)));
if (pkg.version !== version) throw new Error(`Expected Pyodide ${version}`);
const target = new URL(`public/runtime/${version}/`, root);
await mkdir(target, { recursive: true });
let total = 0;
for (const [file, expected] of Object.entries(hashes)) {
  const source = new URL(`node_modules/pyodide/${file}`, root);
  const bytes = await readFile(source);
  if (createHash('sha256').update(bytes).digest('hex') !== expected) {
    throw new Error(`Runtime checksum mismatch: ${file}`);
  }
  await copyFile(source, new URL(file, target));
  total += bytes.length;
}
console.log(`Verified and packaged Pyodide ${version}: ${total} bytes; no network downloads.`);
