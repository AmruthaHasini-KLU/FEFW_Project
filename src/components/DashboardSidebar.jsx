import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export default function DashboardSidebar({ basePath = '/dashboard', compact = false, role: roleProp }) {
  const { user } = useAuth();
  const role = roleProp || (user && user.role) || 'borrower';
  // ensure basePath if not passed follows role
  if (!basePath || basePath === '/dashboard') basePath = `/dashboard/${role}`;

  // role-aware items
  const borrowerItems = [
    { to: `${basePath}`, label: 'Dashboard', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="7" height="7" rx="2" stroke="currentColor" fill="none"/><rect x="14" y="3" width="7" height="7" rx="2" stroke="currentColor" fill="none"/><rect x="14" y="14" width="7" height="7" rx="2" stroke="currentColor" fill="none"/><rect x="3" y="14" width="7" height="7" rx="2" stroke="currentColor" fill="none"/></svg>
    ) },
    { to: `${basePath}/offers`, label: 'Loan Offers', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="7" width="20" height="10" rx="2" stroke="currentColor" fill="none"/><path d="M2 7l10 7 10-7" stroke="currentColor" fill="none"/></svg>
    ) },
    { to: `${basePath}/payments`, label: 'Payments', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="7" width="18" height="10" rx="2" stroke="currentColor" fill="none"/><path d="M7 11h10" stroke="currentColor" fill="none"/></svg>
    ) },
    { to: `${basePath}/documents`, label: 'Documents', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" fill="none"/><path d="M14 2v6h6" stroke="currentColor" fill="none"/></svg>
    ) },
    { to: `${basePath}/loan-calculator`, label: 'Loan Calculator', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 12h18" stroke="currentColor" fill="none"/><path d="M7 16h10" stroke="currentColor" fill="none"/><path d="M7 8h10" stroke="currentColor" fill="none"/></svg>
    ) },
  ];

  const lenderItems = [
    { to: `${basePath}`, label: 'Dashboard', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="7" height="7" rx="2" stroke="currentColor" fill="none"/><rect x="14" y="3" width="7" height="7" rx="2" stroke="currentColor" fill="none"/><rect x="14" y="14" width="7" height="7" rx="2" stroke="currentColor" fill="none"/><rect x="3" y="14" width="7" height="7" rx="2" stroke="currentColor" fill="none"/></svg>
    ) },
    { to: `${basePath}/offers`, label: 'Loan Offers', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="7" width="20" height="10" rx="2" stroke="currentColor" fill="none"/><path d="M2 7l10 7 10-7" stroke="currentColor" fill="none"/></svg>
    ) },
    { to: `${basePath}/borrowers`, label: 'Borrowers', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="3" stroke="currentColor" fill="none"/><circle cx="16" cy="8" r="3" stroke="currentColor" fill="none"/><path d="M2 20c2-4 6-6 10-6s8 2 10 6" stroke="currentColor" fill="none"/></svg>
    ) },
    { to: `${basePath}/payments`, label: 'Payments', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="7" width="18" height="10" rx="2" stroke="currentColor" fill="none"/><path d="M7 11h10" stroke="currentColor" fill="none"/></svg>
    ) },
    { to: `${basePath}/reports`, label: 'Reports', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 19V7a2 2 0 012-2h12a2 2 0 012 2v12" stroke="currentColor" fill="none"/><path d="M9 17v-6" stroke="currentColor" fill="none"/><path d="M15 17v-2" stroke="currentColor" fill="none"/></svg>
    ) },
    { to: `${basePath}/loan-calculator`, label: 'Loan Calculator', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 12h18" stroke="currentColor" fill="none"/><path d="M7 16h10" stroke="currentColor" fill="none"/><path d="M7 8h10" stroke="currentColor" fill="none"/></svg>
    ) },
  ];

  const analystItems = [
    { to: `${basePath}`, label: 'Dashboard', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="7" height="7" rx="2" stroke="currentColor" fill="none"/><rect x="14" y="3" width="7" height="7" rx="2" stroke="currentColor" fill="none"/><rect x="14" y="14" width="7" height="7" rx="2" stroke="currentColor" fill="none"/><rect x="3" y="14" width="7" height="7" rx="2" stroke="currentColor" fill="none"/></svg>
    ) },
    { to: `${basePath}/reports`, label: 'Reports', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 19V7a2 2 0 012-2h12a2 2 0 012 2v12" stroke="currentColor" fill="none"/><path d="M9 17v-6" stroke="currentColor" fill="none"/><path d="M15 17v-2" stroke="currentColor" fill="none"/></svg>
    ) },
    { to: `${basePath}/data-analysis`, label: 'Data Analysis', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 3v18h18" stroke="currentColor" fill="none"/><path d="M7 13l3-3 3 3 3-6" stroke="currentColor" fill="none"/></svg>
    ) },
    { to: `${basePath}/settings`, label: 'Settings', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 15.5A3.5 3.5 0 1112 8.5a3.5 3.5 0 010 7z" stroke="currentColor" fill="none"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06A2 2 0 013.2 17.88l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82L3.2 3.2A2 2 0 015 0.37l.06.06a1.65 1.65 0 001.82.33h.09A1.65 1.65 0 009.72 1v.09a1.65 1.65 0 001 1.51H11a2 2 0 012 0h.09a1.65 1.65 0 001-1.51V1a1.65 1.65 0 00-1.51-1.82h.06A2 2 0 0119.4 1.2z" stroke="currentColor" fill="none"/></svg>
    ) },
    { to: `${basePath}/loan-calculator`, label: 'Loan Calculator', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 12h18" stroke="currentColor" fill="none"/><path d="M7 16h10" stroke="currentColor" fill="none"/><path d="M7 8h10" stroke="currentColor" fill="none"/></svg>
    ) },
  ];

  const adminItems = [
    { to: `${basePath}`, label: 'Dashboard', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="7" height="7" rx="2" stroke="currentColor" fill="none"/><rect x="14" y="3" width="7" height="7" rx="2" stroke="currentColor" fill="none"/><rect x="14" y="14" width="7" height="7" rx="2" stroke="currentColor" fill="none"/><rect x="3" y="14" width="7" height="7" rx="2" stroke="currentColor" fill="none"/></svg>
    ) },
    { to: `${basePath}/users`, label: 'Users', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="9" cy="7" r="3" stroke="currentColor" fill="none"/><path d="M2 21v-2a4 4 0 014-4h4" stroke="currentColor" fill="none"/></svg>
    ) },
    { to: `${basePath}/reports`, label: 'Reports', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 19V7a2 2 0 012-2h12a2 2 0 012 2v12" stroke="currentColor" fill="none"/><path d="M9 17v-6" stroke="currentColor" fill="none"/><path d="M15 17v-2" stroke="currentColor" fill="none"/></svg>
    ) },
    { to: `${basePath}/activity`, label: 'Activity', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 3v18h18" stroke="currentColor" fill="none"/><path d="M7 13l3-3 3 3 3-6" stroke="currentColor" fill="none"/></svg>
    ) },
    { to: `${basePath}/settings`, label: 'Settings', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 15.5A3.5 3.5 0 1112 8.5a3.5 3.5 0 010 7z" stroke="currentColor" fill="none"/></svg>
    ) },
    { to: `${basePath}/roles`, label: 'Roles', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z" stroke="currentColor" fill="none"/></svg>
    ) },
    { to: `${basePath}/loan-calculator`, label: 'Loan Calculator', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 12h18" stroke="currentColor" fill="none"/><path d="M7 16h10" stroke="currentColor" fill="none"/><path d="M7 8h10" stroke="currentColor" fill="none"/></svg>
    ) },
  ];

  let items = borrowerItems;
  if (role === 'lender') items = lenderItems;
  if (role === 'analyst') items = analystItems;
  if (role === 'admin') items = adminItems;

  return (
    <aside className={`dashboard-sidebar common-sidebar ${compact ? 'compact' : ''}`}>
      <div className="brand-small">Fynvia</div>
      <nav className="sidebar-nav">
        {items.map(i => (
          <NavLink key={i.to} to={i.to} className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`} end>
            <span className="icon" aria-hidden>{i.icon}</span>
            <span className="label">{i.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
