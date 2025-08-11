import { useState, useEffect } from 'react';

interface Theme {
  name: string;
  description: string;
  preview: {
    primary: string;
    accent: string;
    background: string;
  };
}

interface ThemeConfig {
  [key: string]: Theme;
}

const THEMES: ThemeConfig = {
  'dark': {
    name: 'تاریک کلاسیک',
    description: 'تم تاریک مدرن با آبی روشن',
    preview: {
      primary: '#60A5FA',
      accent: '#FBBF24',
      background: '#1E293B'
    }
  },
  'theme-ocean': {
    name: 'اقیانوس آبی',
    description: 'الهام از عمق اقیانوس',
    preview: {
      primary: '#3B82F6',
      accent: '#06B6D4',
      background: '#0F172A'
    }
  },
  'theme-sunset': {
    name: 'غروب طلایی',
    description: 'گرمی غروب آفتاب',
    preview: {
      primary: '#F97316',
      accent: '#EC4899',
      background: '#1C1917'
    }
  },
  'theme-forest': {
    name: 'جنگل سبز',
    description: 'آرامش طبیعت سبز',
    preview: {
      primary: '#10B981',
      accent: '#84CC16',
      background: '#1F2937'
    }
  }
};

const STORAGE_KEY = 'alarm-theme';

export const useTheme = () => {
  const [currentTheme, setCurrentTheme] = useState('dark');

  // Load theme from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && THEMES[stored]) {
      setCurrentTheme(stored);
      applyThemeToDocument(stored);
    }
  }, []);

  const applyThemeToDocument = (themeKey: string) => {
    // Remove all theme classes
    document.body.classList.remove('theme-ocean', 'theme-sunset', 'theme-forest');
    
    // Apply new theme class if not default
    if (themeKey !== 'dark') {
      document.body.classList.add(themeKey);
    }
  };

  const setTheme = (themeKey: string) => {
    if (THEMES[themeKey]) {
      setCurrentTheme(themeKey);
      localStorage.setItem(STORAGE_KEY, themeKey);
      applyThemeToDocument(themeKey);
    }
  };

  return {
    currentTheme,
    themes: THEMES,
    setTheme
  };
};