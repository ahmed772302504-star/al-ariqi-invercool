import React, { createContext, useContext, useState, useEffect } from 'react';

export type AppTheme = 'navy' | 'light';

interface ThemeContextType {
  theme: AppTheme;
  isLight: boolean;
  isNavy: boolean;
  setTheme: (theme: AppTheme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'al_arriqi_theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<AppTheme>(() => {
    // Check saved preference in localStorage
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'light' || saved === 'navy') {
        return saved;
      }
    } catch {
      // Fallback if localStorage is inaccessible
    }
    // Default to the signature professional navy theme
    return 'navy';
  });

  const isLight = theme === 'light';
  const isNavy = theme === 'navy';

  useEffect(() => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // ignore
    }

    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    
    if (theme === 'light') {
      root.classList.add('theme-light');
      root.classList.remove('theme-navy');
    } else {
      root.classList.add('theme-navy');
      root.classList.remove('theme-light');
    }

    // Update meta theme-color for browser tab / mobile status bar
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.setAttribute('name', 'theme-color');
      document.head.appendChild(metaThemeColor);
    }
    metaThemeColor.setAttribute('content', theme === 'light' ? '#FFFFFF' : '#0B192C');

    // Update color-scheme
    root.style.colorScheme = theme === 'light' ? 'light' : 'dark';
  }, [theme]);

  const setTheme = (newTheme: AppTheme) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'navy' ? 'light' : 'navy'));
  };

  return (
    <ThemeContext.Provider value={{ theme, isLight, isNavy, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
