import React, { useMemo, useState } from 'react';
import DashboardSidebar from '@/components/DashboardSidebar';

const sampleUsers = [
  { id: 'U-1001', name: 'Alice Johnson', email: 'alice@demo.com', role: 'borrower', status: 'active', joined: '2024-01-10' },
  { id: 'U-1002', name: 'Ben Rogers', email: 'ben@demo.com', role: 'lender', status: 'suspended', joined: '2024-01-15' },
  { id: 'U-1003', name: 'Cara Miles', email: 'cara@demo.com', role: 'analyst', status: 'active', joined: '2024-02-01' },
  { id: 'U-1004', name: 'David Park', email: 'david@demo.com', role: 'borrower', status: 'active', joined: '2024-02-20' },
];

export default function AdminUsers() {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState(sampleUsers);

  const filtered = useMemo(() => users.filter(u => (
    u.name.toLowerCase().includes(query.toLowerCase()) || u.email.toLowerCase().includes(query.toLowerCase()) || u.id.toLowerCase().includes(query.toLowerCase())
  )), [users, query]);

  const suspend = (id) => setUsers(prev => prev.map(u => u.id === id ? { ...u, status: 'suspended' } : u));
  const activate = (id) => setUsers(prev => prev.map(u => u.id === id ? { ...u, status: 'active' } : u));
  const remove = (id) => setUsers(prev => prev.filter(u => u.id !== id));

  return (
    <div className="admin-dashboard dashboard">
      <div className="dashboard-layout">
        <DashboardSidebar basePath="/dashboard/admin" role="admin" />
        <section className="dashboard-content admin-content">
          <header className="admin-header header">
            <div>
              <h1>Users</h1>
              <p className="muted">Manage platform users and permissions</p>
            </div>
            <div>
              <button className="btn btn-primary">Invite user</button>
            </div>
          </header>

          <div className="card table-block" style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
              <input className="lang-select" placeholder="Search users by name, email or id" value={query} onChange={(e) => setQuery(e.target.value)} />
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-outline">Export CSV</button>
              </div>
            </div>

            <table className="table" style={{ marginTop: 12 }}>
              <thead>
                <tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Joined</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filtered.map(u => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td><span className="status-badge">{u.role}</span></td>
                    <td><span className={`status-badge ${u.status === 'active' ? 'approved' : 'pending'}`}>{u.status}</span></td>
                    <td>{u.joined}</td>
                    <td>
                      {u.status !== 'active' ? <button className="btn btn-primary btn-sm" onClick={() => activate(u.id)}>Activate</button> : <button className="btn btn-outline btn-sm" onClick={() => suspend(u.id)}>Suspend</button>}
                      <button className="btn btn-outline btn-sm" style={{ marginLeft: 8 }} onClick={() => remove(u.id)}>Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
