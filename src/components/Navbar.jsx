import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useSettings } from '@/context/SettingsContext';
import { roleDashboardPath } from '@/utils/helpers';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme, locale, setLocale, t } = useSettings();

  return (
    <header className="site-nav">
      <div className="brand">Fynvia</div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/features">Features</Link>
        <Link to="/how-it-works">How It Works</Link>
        {user && <Link to={roleDashboardPath(user.role)}>Dashboard</Link>}
        <Link to="/support">Support</Link>
      </nav>
      <div className="actions">
        <select value={locale} onChange={(e) => setLocale(e.target.value)} style={{ marginRight: 8 }}>
          <option value="en">EN</option>
          <option value="es">ES</option>
        </select>
        <button className="btn btn-outline" onClick={toggleTheme} title="Toggle theme" style={{ marginRight: 8 }}>
          {theme === 'dark' ? '🌙' : '☀️'}
        </button>
        {user ? (
          <>
            <span style={{ marginRight: '1rem', opacity: 0.8 }}>Hi, {user.name}</span>
            <button className="btn btn-outline" onClick={logout}>{t('logout')}</button>
          </>
        ) : (
          <Link to="/login">{t('login')}</Link>
        )}
      </div>
    </header>
  );
}
