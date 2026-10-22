import { setTimeout as delay } from 'node:timers/promises';

// Vite's human-readable startup output may contain ANSI codes or arrive in
// arbitrary chunks. Probe the served HTTP resource instead of parsing logs.
export async function waitForPreview(child, url, { timeoutMs = 15000 } = {}) {
  let stdout = '', stderr = '';
  const limit = 65536;
  child.stdout.on('data', (chunk) => { stdout = (stdout + chunk).slice(-limit); });
  child.stderr.on('data', (chunk) => { stderr = (stderr + chunk).slice(-limit); });
  const diagnostics = (message) => new Error(`${message}\nPreview stdout:\n${stdout}\nPreview stderr:\n${stderr}`);
  const exited = new Promise((resolve, reject) => {
    child.once('error', (error) => reject(diagnostics(`Preview could not start: ${error.message}`)));
    child.once('exit', (code, signal) => reject(diagnostics(`Preview exited before readiness (code=${code}, signal=${signal})`)));
    if (child.exitCode !== null || child.signalCode !== null) reject(diagnostics('Preview already exited'));
  });
  const shutdown = new AbortController();
  const deadline = Date.now() + timeoutMs;
  const poll = async () => {
    let lastFailure = 'No response', lastResponse = null;
    while (!shutdown.signal.aborted && Date.now() < deadline) {
      try {
        const response = await fetch(url, { signal: AbortSignal.any([shutdown.signal, AbortSignal.timeout(Math.min(1000, Math.max(1, deadline - Date.now())))]) });
        await response.arrayBuffer();
        if (response.ok) return;
        lastResponse = `HTTP ${response.status}`;
        lastFailure = lastResponse;
      } catch (error) { lastFailure = error.message; }
      if (shutdown.signal.aborted) return;
      try { await delay(Math.min(100, Math.max(1, deadline - Date.now())), undefined, { signal: shutdown.signal }); }
      catch { return; }
    }
    const responseDetail = lastResponse && lastResponse !== lastFailure ? ` (last response: ${lastResponse})` : '';
    throw diagnostics(`Preview HTTP readiness timed out after ${timeoutMs}ms at ${url}: ${lastFailure}${responseDetail}`);
  };
  try { await Promise.race([poll(), exited]); }
  finally { shutdown.abort(); }
}
