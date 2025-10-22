import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';
import SlidingPanel from '@/components/SlidingPanel';
import DashboardLayout from '@/components/DashboardLayout';

export default function LenderDashboard() {
  const { user } = useAuth();

  const kpis = [
    { id: 1, title: 'Loans Pending Approval', value: '12', sub: 'Awaiting review' },
    { id: 2, title: 'Active Loans', value: '87', sub: 'Currently managed' },
  { id: 3, title: 'Total Disbursed', value: '₹2.3M', sub: 'All-time' },
    { id: 4, title: 'Avg. Interest Rate', value: '11.2%', sub: 'Portfolio average' },
  ];
  const recent = [
  { id: 'RQ-1021', borrower: 'John D.', amount: '₹12,000', status: 'Pending' },
  { id: 'RQ-1020', borrower: 'Mia P.', amount: '₹5,500', status: 'Flagged' },
  { id: 'RQ-1019', borrower: 'Ishaan K.', amount: '₹20,000', status: 'New' },
  ];

  return (
    <DashboardLayout role="lender">
      <>
      <section className="dashboard-content lender-content">
        <header className="lender-header header">
          <div className="header-left">
            <h1>Lender Dashboard</h1>
            <p className="muted">Monitor, approve, and manage loans</p>
          </div>
          <div className="header-right">
            <span className="role-badge">Lender</span>
            <div className="user-info">
              <div className="user-name">{user?.name || 'Guest'}</div>
              <div className="user-role">{user?.role}</div>
            </div>
            <button className="btn btn-outline">Logout</button>
          </div>
        </header>

        <section className="kpi-row">
          {kpis.map(k => (
            <div key={k.id} className="kpi-card card">
                <div className="kpi-top">
                  <div className="kpi-title">{k.title}</div>
                  <div className="kpi-icon">₹</div>
                </div>
              <div className="kpi-value">{k.value}</div>
              <div className="kpi-sub muted">{k.sub}</div>
            </div>
          ))}
        </section>

        <section className="two-col">
          <div className="card loan-details">
            <h3>Portfolio Overview</h3>
            <p className="muted">Summary of your lending activity</p>
            <div className="loan-row"><span>Loans Pending Approval:</span><strong>12</strong></div>
            <div className="loan-row"><span>Active Loans:</span><strong>87</strong></div>
              <div className="loan-row"><span>Total Disbursed:</span><strong>₹2.3M</strong></div>
            <div className="loan-row"><span>Avg. Interest Rate:</span><strong>11.2%</strong></div>
          </div>

          <div className="card reminders">
            <h3>Recent Activity</h3>
            <p className="muted">Latest requests and updates</p>
            <ul className="reminder-list">
              {recent.map(r => (
                <li key={r.id}><span className="dot" /> {r.borrower} requested {r.amount} ({r.status})</li>
              ))}
            </ul>
          </div>
        </section>
        </section>
        <SlidingPanel side="right" />
      </>
    </DashboardLayout>
  );
}
