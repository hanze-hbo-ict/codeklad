export const SESSION_KEY = 'klode.source.v1';
export function createSession(storage, warn) {
  const warning = 'Code recovery is unavailable. Keep a copy before reloading or closing this tab.';
  return {
    restore(fallback) {
      try { return storage().getItem(SESSION_KEY) ?? fallback; }
      catch { warn(warning); return fallback; }
    },
    save(source) {
      try { storage().setItem(SESSION_KEY, source); }
      catch { warn(warning); }
    },
  };
}
