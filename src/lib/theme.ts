/**
 * Visitor theme choice. No stored choice = the hybrid design (no
 * data-theme attribute); "light" / "dark" set data-theme on <html>.
 * Stored in localStorage only: a strictly necessary preference, never sent.
 */

export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "neex-theme";

/**
 * Inline <head> script: applies the stored theme before first paint so the
 * page never flashes the wrong palette. Keep it tiny and dependency-free.
 */
export const themeInitScript = `try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

export function getTheme(): Theme | null {
  const theme = document.documentElement.dataset.theme;
  return theme === "light" || theme === "dark" ? theme : null;
}

const listeners = new Set<() => void>();

export function subscribeTheme(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function setTheme(theme: Theme) {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduceMotion) root.classList.add("theme-transition");
  root.dataset.theme = theme;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Storage blocked (private mode): the choice lasts for this page only.
  }
  listeners.forEach((listener) => listener());
  if (!reduceMotion) window.setTimeout(() => root.classList.remove("theme-transition"), 350);
}
