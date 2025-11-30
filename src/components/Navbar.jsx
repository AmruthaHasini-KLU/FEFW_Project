import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useSettings } from '@/context/SettingsContext';
import { roleDashboardPath } from '@/utils/helpers';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme, locale, setLocale, t } = useSettings();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    // update active section on scroll
    const sections = ['features', 'how-it-works', 'support'];
    const onScroll = () => {
      if (location.pathname !== '/') {
        setActiveSection('');
        return;
      }
      const y = window.scrollY + 120; // offset for header
      let found = 'home';
      for (const id of sections) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.offsetTop;
        if (y >= top) found = id;
      }
      setActiveSection(found);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [location]);

  const scrollToSection = (section, e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (location.pathname === '/') {
      const el = document.getElementById(section);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      // update hash without reloading
      try { history.replaceState(null, '', `#${section}`); } catch (err) {}
      return;
    }
    // navigate to home with hash
    navigate(`/#${section}`);
  };

  return (
    <header className="site-nav">
      <div className="brand">Fynvia</div>
      <nav>
        <Link to="/" className={location.pathname === '/' && activeSection === 'home' ? 'active' : ''}>Home</Link>
        <a href="/#features" onClick={(e) => scrollToSection('features', e)} className={activeSection === 'features' ? 'active' : ''}>Features</a>
        <a href="/#how-it-works" onClick={(e) => scrollToSection('how-it-works', e)} className={activeSection === 'how-it-works' ? 'active' : ''}>How It Works</a>
        {user && <Link to={roleDashboardPath(user.role)}>Dashboard</Link>}
        {user && <Link to="/dashboard/profile">Profile</Link>}
        <a href="/#support" onClick={(e) => scrollToSection('support', e)} className={activeSection === 'support' ? 'active' : ''}>Support</a>
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
