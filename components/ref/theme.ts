export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'yj-portfolio-theme';
const listeners = new Set<(theme: Theme) => void>();

export function applyTheme(theme: Theme) {
  if (typeof document === 'undefined') return;
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* storage may be blocked; the theme still applies for this visit */
  }
  listeners.forEach((listener) => listener(theme));
}

export function currentTheme(): Theme {
  if (typeof document === 'undefined') return 'light';
  const saved = document.documentElement.dataset.theme || localStorage.getItem(STORAGE_KEY);
  return saved === 'dark' ? 'dark' : 'light';
}

export function toggleTheme(): Theme {
  const next: Theme = currentTheme() === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  return next;
}

/** External store so React can read the persisted theme without a setState effect. */
export function subscribeTheme(listener: (theme: Theme) => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getThemeSnapshot(): Theme {
  return currentTheme();
}

export function getServerThemeSnapshot(): Theme {
  return 'light';
}
