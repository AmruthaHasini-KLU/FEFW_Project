import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  {
    label: 'Dashboard',
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/></svg>
    ),
    path: '/dashboard/lender'
  },
  {
    label: 'Loan Offers',
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="10" rx="2"/><path d="M2 7l10 7 10-7"/></svg>
    ),
    path: '/dashboard/lender/offers'
  },
  {
    label: 'Borrowers',
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="8" cy="8" r="4"/><circle cx="16" cy="8" r="4"/><rect x="2" y="16" width="20" height="6" rx="3"/></svg>
    ),
    path: '/dashboard/lender/borrowers'
  },
  {
    label: 'Payments',
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="10" rx="2"/><path d="M7 11h10"/></svg>
    ),
    path: '/dashboard/lender/payments'
  },
  {
    label: 'Reports',
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 19V7a2 2 0 012-2h12a2 2 0 012 2v12"/><path d="M9 17v-6"/><path d="M15 17v-2"/></svg>
    ),
    path: '/dashboard/lender/reports'
  },
];

export default function LenderDashboardLayout({ children }) {
  const { pathname } = useLocation();
  return (
    <div className="lender-dashboard-layout" style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <aside className="lender-sidebar" style={{ width: 240, background: 'var(--panel)', borderRight: '1px solid var(--border)', padding: '2rem 1rem 1rem 1rem', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--primary)', marginBottom: 32 }}>Fynvia</div>
        {navItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`sidebar-link${pathname === item.path ? ' active' : ''}`}
            style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '0.7rem 1rem', borderRadius: 8,
              background: pathname === item.path ? 'var(--accent)' : 'transparent',
              color: pathname === item.path ? '#fff' : 'var(--text)',
              fontWeight: pathname === item.path ? 700 : 500,
              textDecoration: 'none',
              marginBottom: 4,
              transition: 'background 0.2s, color 0.2s',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, color: pathname === item.path ? '#fff' : 'var(--accent)' }}>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </aside>
      <main className="lender-main" style={{ flex: 1, padding: '2.5rem 2rem' }}>
        {children}
      </main>
    </div>
  );
}
