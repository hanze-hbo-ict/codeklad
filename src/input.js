export function createInput(form, answer, onSubmit) {
  let pending = null;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!pending) return;
    // Capture the request identity before submission, never reuse a stale form.
    if (onSubmit(pending, answer.value)) { pending = null; form.hidden = true; }
  });
  return {
    request(identity) { pending = identity; answer.value = ''; form.hidden = false; answer.focus(); },
    clear() { pending = null; answer.value = ''; form.hidden = true; },
  };
}
