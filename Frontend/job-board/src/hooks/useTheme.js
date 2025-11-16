import { useCallback, useEffect, useState } from 'react';
import { getTheme, setTheme as persistTheme, subscribeToTheme } from '../utils/theme';

const THEME_STORAGE_KEY = 'dashboardTheme';
const isBrowser = () => typeof window !== 'undefined';

export const useTheme = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => getTheme());

  useEffect(() => {
    persistTheme(isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    const unsubscribe = subscribeToTheme((value) => {
      setIsDarkMode((prev) => (prev === value ? prev : value));
    });

    if (!isBrowser()) {
      return unsubscribe;
    }

    const handleStorage = (event) => {
      if (event.key === THEME_STORAGE_KEY) {
        const next = event.newValue === 'dark';
        setIsDarkMode((prev) => (prev === next ? prev : next));
      }
    };

    window.addEventListener('storage', handleStorage);

    return () => {
      unsubscribe();
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const setTheme = useCallback((value) => {
    setIsDarkMode((prev) => {
      const nextValue = typeof value === 'function' ? value(prev) : value;
      return !!nextValue;
    });
  }, []);

  const toggleTheme = useCallback(() => {
    setIsDarkMode((prev) => !prev);
  }, []);

  return { isDarkMode, setTheme, toggleTheme };
};
