import React, { createContext, useState, useEffect, useContext } from 'react';

const SettingsContext = createContext(null);

const LS_KEY = 'fynvia_settings_v1';

const translations = {
  en: {
    home: 'Home',
    features: 'Features',
    howItWorks: 'How It Works',
    support: 'Support',
    login: 'Login',
    logout: 'Logout'
  },
  es: {
    home: 'Inicio',
    features: 'Características',
    howItWorks: 'Cómo funciona',
    support: 'Soporte',
    login: 'Iniciar sesión',
    logout: 'Cerrar sesión'
  }
};

export function SettingsProvider({ children }) {
  const [theme, setTheme] = useState('dark');
  const [locale, setLocale] = useState('en');

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.theme) setTheme(parsed.theme);
        if (parsed.locale) setLocale(parsed.locale);
      }
    } catch {}
    // ensure the document theme attribute reflects the initial value
    try {
      if (typeof document !== 'undefined') {
        document.documentElement.dataset.theme = theme;
      }
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem(LS_KEY, JSON.stringify({ theme, locale })); } catch {}
    try {
      if (typeof document !== 'undefined') {
        // Set a data attribute for theme so CSS selectors using [data-theme]
        // apply deterministically (we added CSS for [data-theme="light"]/"dark").
        document.documentElement.dataset.theme = theme;
      }
    } catch {}
  }, [theme, locale]);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  const t = (key) => (translations[locale] && translations[locale][key]) || translations.en[key] || key;

  return (
    <SettingsContext.Provider value={{ theme, locale, setLocale, toggleTheme, t }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);
