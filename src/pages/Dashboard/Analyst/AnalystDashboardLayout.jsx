import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', path: '/dashboard/analyst', icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/></svg>
  )},
  { label: 'Reports', path: '/dashboard/analyst/reports', icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19V7a2 2 0 012-2h12a2 2 0 012 2v12"/><path d="M9 17v-6"/><path d="M15 17v-2"/></svg>
  )},
  { label: 'Data Analysis', path: '/dashboard/analyst/data-analysis', icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18"/><path d="M7 13l4-4 4 4 4-8"/></svg>
  )},
  { label: 'Settings', path: '/dashboard/analyst/settings', icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06A2 2 0 013.27 17.9l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82L4.21 6.6A2 2 0 016.9 3.27l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09c.12.7.67 1.22 1.36 1.36h.09a1.65 1.65 0 001.51 1 1.65 1.65 0 001.82-.33l.06-.06A2 2 0 0120.73 6.1l-.06.06a1.65 1.65 0 00-.33 1.82V9c.7.12 1.22.67 1.36 1.36V10a2 2 0 010 4v-.09c-.12.7-.67 1.22-1.36 1.36z"/></svg>
  )}
];

export default function AnalystDashboardLayout({ children }) {
  const { pathname } = useLocation();
  return (
    <div className="analyst-dashboard-layout" style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <aside className="analyst-sidebar" style={{ width: 240, background: 'var(--panel)', borderRight: '1px solid var(--border)', padding: '2rem 1rem 1rem 1rem', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--primary)', marginBottom: 32 }}>Fynvia</div>
        {navItems.map(item => (
          <Link key={item.path} to={item.path} className={`sidebar-link${pathname === item.path ? ' active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0.7rem 1rem', borderRadius: 8, background: pathname === item.path ? 'var(--accent)' : 'transparent', color: pathname === item.path ? '#fff' : 'var(--text)', fontWeight: pathname === item.path ? 700 : 500, textDecoration: 'none', marginBottom: 4, transition: 'background 0.2s, color 0.2s' }}>
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, color: pathname === item.path ? '#fff' : 'var(--accent)' }}>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </aside>
      <main className="analyst-main" style={{ flex: 1, padding: '2.5rem 2rem' }}>{children}</main>
    </div>
  );
}
