const STORAGE_KEY = 'dashboardTheme';
const EVENT_NAME = 'themeChange';

const isBrowser = () => typeof window !== 'undefined' && typeof document !== 'undefined';

export const getTheme = () => {
  if (!isBrowser()) return false;
  return localStorage.getItem(STORAGE_KEY) === 'dark';
};

export const dispatchThemeEvent = (isDarkMode) => {
  if (!isBrowser()) return;
  const detail = { isDarkMode };
  const event = new CustomEvent(EVENT_NAME, { detail });
  window.dispatchEvent(event);
};

export const setTheme = (isDark) => {
  if (!isBrowser()) return isDark;
  const enableDark = !!isDark;
  localStorage.setItem(STORAGE_KEY, enableDark ? 'dark' : 'light');
  document.documentElement.classList.toggle('dark', enableDark);
  dispatchThemeEvent(enableDark);
  return enableDark;
};

export const toggleTheme = () => {
  const nextTheme = !getTheme();
  setTheme(nextTheme);
  return nextTheme;
};

export const initializeTheme = () => {
  const current = getTheme();
  if (isBrowser()) {
    document.documentElement.classList.toggle('dark', current);
  }
  return current;
};

export const subscribeToTheme = (listener) => {
  if (!isBrowser()) return () => {};
  const handler = (event) => {
    const value = event?.detail?.isDarkMode;
    if (typeof value === 'boolean') {
      listener(value);
    } else {
      listener(getTheme());
    }
  };
  window.addEventListener(EVENT_NAME, handler);
  return () => window.removeEventListener(EVENT_NAME, handler);
};
