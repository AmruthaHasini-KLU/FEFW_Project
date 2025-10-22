import React from 'react';
import DashboardSidebar from './DashboardSidebar';

export default function DashboardLayout({ role = 'borrower', children, compact = false }) {
  const basePath = `/dashboard/${role}`;
  return (
    <div className={`${role}-dashboard dashboard`}>
      <div className="dashboard-layout">
        <DashboardSidebar basePath={basePath} role={role} compact={compact} />
        <section className={`dashboard-content ${role}-content`}>
          {children}
        </section>
      </div>
    </div>
  );
}
