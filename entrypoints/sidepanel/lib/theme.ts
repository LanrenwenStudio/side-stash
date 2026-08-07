import type { ThemeMode } from '../types';

export function applyTheme(themeMode: ThemeMode) {
  if (typeof document === 'undefined') {
    return;
  }
  const root = document.documentElement;
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  const isDark =
    themeMode === 'dark' || (themeMode === 'system' && mediaQuery.matches);

  if (isDark) {
    root.classList.add('dark');
    root.style.colorScheme = 'dark';
  } else {
    root.classList.remove('dark');
    root.style.colorScheme = 'light';
  }
}

export function setupThemeListener(getThemeMode: () => ThemeMode) {
  if (typeof window === 'undefined') {
    return () => undefined;
  }
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const handleChange = () => {
    applyTheme(getThemeMode());
  };

  mediaQuery.addEventListener('change', handleChange);
  return () => {
    mediaQuery.removeEventListener('change', handleChange);
  };
}
