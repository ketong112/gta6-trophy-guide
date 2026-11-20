// Saved progress: one localStorage key holding a JSON array of earned trophy ids.
// Nothing is sent anywhere; export and import are plain files the reader owns.
export const STORAGE_KEY = 'leonida-trophy-atlas-v1';
export const EXPORT_FILENAME = 'gta6-trophy-progress.json';

export function loadEarned() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((n) => Number.isInteger(n) && n >= 1 && n <= 55));
  } catch {
    return new Set();
  }
}

export function saveEarned(earned) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...earned].sort((a, b) => a - b)));
}

export function toggleEarned(earned, id) {
  const next = new Set(earned);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  saveEarned(next);
  return next;
}

export function exportProgress(earned) {
  const payload = {
    app: 'leonida-trophy-atlas',
    game: 'Grand Theft Auto VI',
    exportedAt: new Date().toISOString(),
    earned: [...earned].sort((a, b) => a - b),
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const anchor = document.createElement('a');
  anchor.href = URL.createObjectURL(blob);
  anchor.download = EXPORT_FILENAME;
  anchor.click();
  URL.revokeObjectURL(anchor.href);
}

// Reads an exported progress file back. Accepts the atlas's own export shape
// ({earned: [...]}) and a bare array of ids. Throws on anything else.
export function parseProgressFile(text) {
  const parsed = JSON.parse(text);
  const ids = Array.isArray(parsed) ? parsed : parsed.earned;
  if (!Array.isArray(ids)) throw new Error('That file holds no earned list.');
  const earned = new Set();
  for (const n of ids) {
    if (Number.isInteger(n) && n >= 1 && n <= 55) earned.add(n);
  }
  return earned;
}
