import React from 'react';
import DashboardSidebar from '@/components/DashboardSidebar';

const sampleSummary = { totalUsers: 1247, totalLoans: 892, monthlyRevenue: 125000 };

function toCSV(data) {
  const rows = [Object.keys(data[0])].concat(data.map(r => Object.values(r)));
  return rows.map(r => r.join(',')).join('\n');
}

export default function AdminReports() {
  const exportSample = () => {
    const data = [
      { month: 'Jan', newUsers: 120, revenue: 10000 },
      { month: 'Feb', newUsers: 150, revenue: 12000 },
    ];
    const csv = toCSV(data);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'sample-report.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="admin-dashboard dashboard">
      <div className="dashboard-layout">
        <DashboardSidebar basePath="/dashboard/admin" role="admin" />
        <section className="dashboard-content admin-content">
          <header className="admin-header header">
            <div>
              <h1>Reports</h1>
              <p className="muted">View and export operational reports</p>
            </div>
            <div>
              <button className="btn btn-primary" onClick={exportSample}>Export sample CSV</button>
            </div>
          </header>
          <div className="card" style={{ padding: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <div className="kpi-card card"><div className="kpi-sub muted">Total Users</div><div className="kpi-value">{sampleSummary.totalUsers}</div></div>
              <div className="kpi-card card"><div className="kpi-sub muted">Total Loans</div><div className="kpi-value">{sampleSummary.totalLoans}</div></div>
              <div className="kpi-card card"><div className="kpi-sub muted">Monthly Revenue</div><div className="kpi-value">₹{sampleSummary.monthlyRevenue.toLocaleString()}</div></div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}