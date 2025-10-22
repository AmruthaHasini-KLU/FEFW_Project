import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';
import SlidingPanel from '@/components/SlidingPanel';
import DashboardLayout from '@/components/DashboardLayout';
import LineChart from '@/components/charts/LineChart';
import DoughnutChart from '@/components/charts/DoughnutChart';

export default function AdminDashboard() {
  const { user } = useAuth();
  const users = [
    { id: 'U-1001', name: 'Alice', role: 'borrower', status: 'active' },
    { id: 'U-1002', name: 'Ben', role: 'lender', status: 'suspended' },
    { id: 'U-1003', name: 'Cara', role: 'analyst', status: 'active' },
  ];

  // realistic sample data for charts
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const userGrowth = [120, 150, 200, 260, 320, 400, 470, 530, 610, 700, 780, 860]; // monthly new users
  const activeLoansTrend = [60, 62, 65, 68, 72, 75, 78, 80, 82, 85, 87, 89];
  const pendingApprovals = [20, 18, 21, 19, 22, 17, 15, 14, 13, 12, 12, 12];
  const alertBreakdown = ['Security','Payments','System','Other'];
  const alertCounts = [3, 14, 6, 2];

  return (
    <DashboardLayout role="admin">
      <>
        <section className="dashboard-content">
          <header className="admin-header header">
            <div className="header-left">
              <h1>Admin Dashboard</h1>
              <p className="muted">Overview of platform activity and management tools</p>
            </div>
            <div className="header-right">
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <div className="user-info"><div className="user-name">{user?.name || 'Admin'}</div><div className="muted">{user?.role}</div></div>
                <button className="btn btn-outline">Logout</button>
              </div>
            </div>
          </header>

          <section className="kpi-row" style={{ marginBottom: 16 }}>
            <div className="kpi-card card"><div className="kpi-sub muted">Total Users</div><div className="kpi-value" style={{ fontSize: 28, fontWeight: 800 }}>1,247</div><div className="muted">+12% from last month</div></div>
            <div className="kpi-card card"><div className="kpi-sub muted">Active Loans</div><div className="kpi-value" style={{ fontSize: 28, fontWeight: 800 }}>89</div><div className="muted">+5% from last month</div></div>
            <div className="kpi-card card"><div className="kpi-sub muted">Pending Approvals</div><div className="kpi-value" style={{ fontSize: 28, fontWeight: 800 }}>12</div><div className="muted">Requires attention</div></div>
            <div className="kpi-card card"><div className="kpi-sub muted">Security Alerts</div><div className="kpi-value" style={{ fontSize: 28, fontWeight: 800 }}>3</div><div className="muted">Low risk level</div></div>
          </section>

          <section className="card recent-activity" style={{ padding: '1.25rem', marginBottom: 18 }}>
            <h3>Recent Activity</h3>
            <p className="muted">Latest platform activities and user actions</p>
            <ul className="reminder-list" style={{ marginTop: 12 }}>
              <li><span className="dot" style={{ background: 'var(--green)' }} /> New user registration: John Smith <div className="muted">2 minutes ago</div></li>
              <li><span className="dot" style={{ background: 'var(--accent)' }} /> Loan approved: ₹50,000 for Mike Johnson <div className="muted">15 minutes ago</div></li>
              <li><span className="dot" style={{ background: 'var(--orange)' }} /> Payment reminder sent to 25 borrowers <div className="muted">1 hour ago</div></li>
            </ul>
          </section>

          <section style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '1rem', marginBottom: 16 }}>
            <div className="card" style={{ padding: '1.25rem' }}>
              <h3>User growth (monthly)</h3>
              <p className="muted">New registrations per month</p>
              <div style={{ marginTop: 12 }}>
                <LineChart labels={months} data={userGrowth} label="New users" color="rgba(99,102,241,0.95)" />
              </div>
            </div>
            <div className="card" style={{ padding: '1.25rem' }}>
              <h3>Alert breakdown</h3>
              <p className="muted">Types of alerts this month</p>
              <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <DoughnutChart labels={alertBreakdown} values={alertCounts} colors={[ 'var(--danger)', 'var(--accent)', 'var(--orange)', 'var(--muted)' ]} />
              </div>
            </div>
          </section>

          <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: 16 }}>
            <div className="card" style={{ padding: '1.25rem' }}>
              <h3>Active loans trend</h3>
              <p className="muted">Active loans over time</p>
              <div style={{ marginTop: 12 }}>
                <LineChart labels={months} data={activeLoansTrend} label="Active loans" color="rgba(16,185,129,0.9)" />
              </div>
            </div>
            <div className="card" style={{ padding: '1.25rem' }}>
              <h3>Pending approvals</h3>
              <p className="muted">Pending loan approvals over time</p>
              <div style={{ marginTop: 12 }}>
                <LineChart labels={months} data={pendingApprovals} label="Pending" color="rgba(249,115,22,0.95)" />
              </div>
            </div>
          </section>

          <section className="card table-block" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div>
                <h3>User Management</h3>
                <p className="muted">Manage user accounts and permissions</p>
              </div>
              <div>
                <input className="lang-select" placeholder="Search users..." />
                <button className="btn btn-primary" style={{ marginLeft: 12 }}>Add New User</button>
              </div>
            </div>

            <table className="table">
              <thead>
                <tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Join Date</th><th>Actions</th></tr>
              </thead>
              <tbody>
                <tr><td>John Doe</td><td>john@example.com</td><td><span className="status-badge">Borrower</span></td><td><span className="status-badge approved">active</span></td><td>2024-01-15</td><td>✎ 🗑</td></tr>
                <tr><td>Jane Smith</td><td>jane@example.com</td><td><span className="status-badge">Lender</span></td><td><span className="status-badge approved">active</span></td><td>2024-01-20</td><td>✎ 🗑</td></tr>
                <tr><td>Mike Johnson</td><td>mike@example.com</td><td><span className="status-badge">Borrower</span></td><td><span className="status-badge pending">pending</span></td><td>2024-01-25</td><td>✎ 🗑</td></tr>
                <tr><td>Sarah Wilson</td><td>sarah@example.com</td><td><span className="status-badge">Analyst</span></td><td><span className="status-badge approved">active</span></td><td>2024-02-01</td><td>✎ 🗑</td></tr>
              </tbody>
            </table>
          </section>

          <SlidingPanel side="right" />
        </section>
      </>
    </DashboardLayout>
  );
}
