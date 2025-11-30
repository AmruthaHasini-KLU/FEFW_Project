// AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import LineChart from '@/components/charts/LineChart';
import DoughnutChart from '@/components/charts/DoughnutChart';
import adminUsersService from '@/services/adminUsers';

const defaultUsers = [
  { id: 'U-1001', name: 'Alice', email: 'alice@example.com', role: 'Borrower', status: 'active', joinDate: '2024-01-15' },
  { id: 'U-1002', name: 'Ben',   email: 'ben@example.com',   role: 'Lender',   status: 'active', joinDate: '2024-01-20' },
  { id: 'U-1003', name: 'Cara',  email: 'cara@example.com',  role: 'Analyst',  status: 'pending',joinDate: '2024-01-25' },
];

export default function AdminDashboard() {
  // 1. initialize users from localStorage (or default)
  const [users, setUsers] = useState(() => {
    const saved = adminUsersService.get();
    return (saved && saved.length) ? saved : defaultUsers;
  });

  // subscribe to external changes (same-tab or other tabs)
  useEffect(() => {
    const unsub = adminUsersService.subscribe((next) => setUsers(Array.isArray(next) ? next : []));
    return unsub;
  }, []);

  // persist on local changes
  useEffect(() => {
    adminUsersService.save(users);
  }, [users]);

  // form state
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', role: 'Borrower', status: 'active' });

  // add new user
  const addNewUser = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      alert('Please provide name and email');
      return;
    }
    const id = `U-${Date.now()}`; // unique-ish id
    const joinDate = new Date().toISOString().split('T')[0];
    const newUser = { id, name: form.name.trim(), email: form.email.trim(), role: form.role, status: form.status, joinDate };
    setUsers(prev => [...prev, newUser]);
    setForm({ name: '', email: '', role: 'Borrower', status: 'active' });
    setShowForm(false);
  };

  // optional delete (demo)
  const deleteUser = (id) => {
    if (!confirm('Delete user?')) return;
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  // sample charts data (unchanged)
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const userGrowth = [120,150,200,260,320,400,470,530,610,700,780,860];
  const alertBreakdown = ['Security','Payments','System','Other'];
  const alertCounts = [3,14,6,2];

  return (
    <DashboardLayout role="admin">
      <section className="dashboard-content">
        <header className="admin-header header">
          <div className="header-left">
            <h1>Admin Dashboard</h1>
            <p className="muted">Overview of platform activity and management tools</p>
          </div>
        </header>

        {/* User management inline add (writes to localStorage via state effect) */}
        <section className="card table-block" style={{ padding: '1.25rem', marginTop: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div>
              <h3>User Management</h3>
              <p className="muted">Manage user accounts and permissions</p>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn btn-primary" onClick={() => setShowForm(s => !s)}>{showForm ? 'Cancel' : 'Add New User'}</button>
            </div>
          </div>

          {showForm && (
            <form onSubmit={addNewUser} style={{ marginBottom: 12, display: 'grid', gridTemplateColumns: '1fr 1fr 160px 120px 80px', gap: 8 }}>
              <input placeholder="Full name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
              <input placeholder="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
              <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                <option>Borrower</option><option>Lender</option><option>Analyst</option><option>Admin</option>
              </select>
              <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                <option value="active">active</option><option value="pending">pending</option><option value="suspended">suspended</option>
              </select>
              <div><button className="btn btn-primary" type="submit">Save</button></div>
            </form>
          )}

          <table className="table">
            <thead>
              <tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Join Date</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td><span className="status-badge">{u.role}</span></td>
                  <td><span className={`status-badge ${u.status === 'active' ? 'approved' : 'pending'}`}>{u.status}</span></td>
                  <td>{u.joinDate}</td>
                  <td>
                    <button onClick={() => deleteUser(u.id)} className="btn btn-outline btn-sm">Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Charts (unchanged) */}
        <section style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '1rem', marginTop: 18 }}>
          <div className="card" style={{ padding: '1.25rem' }}>
            <h3>User growth (monthly)</h3>
            <LineChart labels={months} data={userGrowth} label="New users" />
          </div>
          <div className="card" style={{ padding: '1.25rem' }}>
            <h3>Alert breakdown</h3>
            <DoughnutChart labels={alertBreakdown} values={alertCounts} colors={['#ef4444','#3b82f6','#f59e0b','#10b981']} />
          </div>
        </section>
      </section>
    </DashboardLayout>
  );
}