export function createOutput(output, error, placeholder) {
  let chunks = [], frame = null;
  function flush() {
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null;
    if (!chunks.length) return;
    const text = chunks.join(''); chunks = [];
    placeholder.hidden = true;
    output.append(document.createTextNode(text));
  }
  function showError(text) { flush(); error.textContent = text; error.hidden = !text; }
  return {
    clear() { chunks = []; if (frame !== null) cancelAnimationFrame(frame); frame = null; output.textContent = ''; showError(''); placeholder.hidden = false; },
    append(text) { chunks.push(text); if (frame === null) frame = requestAnimationFrame(flush); },
    flush,
    reveal() { flush(); output.scrollTop = output.scrollHeight; },
    error: showError,
  };
}
