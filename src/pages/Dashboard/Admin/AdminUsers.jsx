// AdminUsers.jsx
import React, { useMemo, useState, useEffect } from 'react';
import DashboardSidebar from '@/components/DashboardSidebar';

const sampleUsers = [
  { id: 'U-1001', name: 'Alice Johnson', email: 'alice@demo.com', role: 'Borrower', status: 'active', joinDate: '2024-01-10' },
  { id: 'U-1002', name: 'Ben Rogers', email: 'ben@demo.com', role: 'Lender', status: 'suspended', joinDate: '2024-01-15' },
  { id: 'U-1003', name: 'Cara Miles', email: 'cara@demo.com', role: 'Analyst', status: 'active', joinDate: '2024-02-01' },
  { id: 'U-1004', name: 'David Park', email: 'david@demo.com', role: 'Borrower', status: 'active', joinDate: '2024-02-20' },
];

import adminUsersService from '@/services/adminUsers';

export default function AdminUsers() {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);

  // load from localStorage on mount (or initialize it)
  useEffect(() => {
    const loaded = adminUsersService.get();
    if (loaded && loaded.length) setUsers(loaded);
    else {
      setUsers(sampleUsers);
      adminUsersService.save(sampleUsers);
    }
    const unsub = adminUsersService.subscribe((next) => setUsers(Array.isArray(next) ? next : []));
    return unsub;
  }, []);

  // keep local storage in sync when users change here too
  useEffect(() => {
    // keep localStorage in sync whenever users changes (persist even when empty)
    adminUsersService.save(users);
  }, [users]);

  const filtered = useMemo(() => users.filter(u =>
    u.name.toLowerCase().includes(query.toLowerCase()) ||
    u.email.toLowerCase().includes(query.toLowerCase()) ||
    u.id.toLowerCase().includes(query.toLowerCase())
  ), [users, query]);

  const suspend = (id) => {
    const updated = users.map(u => u.id === id ? { ...u, status: 'suspended' } : u);
    setUsers(updated);
    adminUsersService.save(updated);
  };

  const activate = (id) => {
    const updated = users.map(u => u.id === id ? { ...u, status: 'active' } : u);
    setUsers(updated);
    adminUsersService.save(updated);
  };

  const remove = (id) => {
    if (!confirm('Remove user?')) return;
    const updated = users.filter(u => u.id !== id);
    setUsers(updated);
    adminUsersService.save(updated);
  };

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
                    <td>{u.joinDate}</td>
                    <td>
                      {u.status !== 'active' ? <button className="btn btn-primary btn-sm" onClick={() => activate(u.id)}>Activate</button> : <button className="btn btn-outline btn-sm" onClick={() => suspend(u.id)}>Suspend</button>}
                      <button className="btn btn-outline btn-sm" style={{ marginLeft: 8 }} onClick={() => remove(u.id)}>Remove</button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan="7" style={{ textAlign: 'center', padding: '1rem' }}>No users found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}