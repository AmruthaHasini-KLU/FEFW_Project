import React, { useState } from 'react';
import DashboardSidebar from '@/components/DashboardSidebar';

const sampleRoles = [
  { id: 'r1', name: 'borrower', desc: 'Borrower users', permissions: { viewLoans: true, pay: true } },
  { id: 'r2', name: 'lender', desc: 'Lender users', permissions: { viewLoans: true, fund: true } },
  { id: 'r3', name: 'analyst', desc: 'Data analysts', permissions: { viewReports: true } },
];

export default function AdminRoles() {
  const [roles, setRoles] = useState(sampleRoles);

  const toggle = (roleId, perm) => setRoles(prev => prev.map(r => r.id === roleId ? { ...r, permissions: { ...r.permissions, [perm]: !r.permissions[perm] } } : r));

  return (
    <div className="admin-dashboard dashboard">
      <div className="dashboard-layout">
        <DashboardSidebar basePath="/dashboard/admin" role="admin" />
        <section className="dashboard-content admin-content">
          <header className="admin-header header">
            <div>
              <h1>Roles</h1>
              <p className="muted">Manage roles and permissions</p>
            </div>
          </header>

          <div className="card" style={{ padding: '1rem' }}>
            {roles.map(r => (
              <div key={r.id} style={{ padding: 12, borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{r.name}</div>
                  <div className="muted">{r.desc}</div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {Object.keys(r.permissions).map(p => (
                    <label key={p} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <input type="checkbox" checked={!!r.permissions[p]} onChange={() => toggle(r.id, p)} />
                      <small className="muted">{p}</small>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}