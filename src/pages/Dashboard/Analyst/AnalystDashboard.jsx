import React from 'react';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';

export default function AnalystDashboard() {
  const { user } = useAuth();
  const portfolioData = [
    { segment: 'Personal Loans', volume: '$1.2M', risk: 'Low', roi: '6.5%' },
    { segment: 'Business Loans', volume: '$3.5M', risk: 'Medium', roi: '7.2%' },
    { segment: 'Micro Loans', volume: '$580K', risk: 'High', roi: '5.8%' },
  ];

  return (
    <DashboardLayout role="analyst">
      <>
        <section className="dashboard-content">
          <header className="analyst-header header">
            <div className="header-left">
              <h2>Analyst Dashboard</h2>
              <p>Welcome{user?.name ? `, ${user.name}` : ''}. Explore portfolio performance.</p>
            </div>
            <div className="header-right">
              <span className="role-badge">Analyst</span>
              <select className="quick-search">
                <option>All Workspaces</option>
                <option>Portfolio A</option>
                <option>Portfolio B</option>
              </select>
              <button className="btn btn-primary">View Reports</button>
            </div>
          </header>

          <section className="stats-grid">
            <div className="card analyst-card"><h3>Default Rate</h3><p className="stat">2.3%</p></div>
            <div className="card analyst-card"><h3>Loan Volume</h3><p className="stat">$5.28M</p></div>
            <div className="card analyst-card"><h3>Risk Exposure</h3><p className="stat">Medium</p></div>
          </section>

          <section className="filters">
            <select>
              <option>Segment: All</option>
              <option>Personal</option>
              <option>Business</option>
              <option>Micro</option>
            </select>
            <select>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
              <option>Year to Date</option>
            </select>
            <button className="btn btn-outline">Export Data</button>
          </section>

          <section className="chart-placeholder analyst-chart">Interactive Chart (Bar/Line/Pie)</section>

          <section className="table-block">
            <div className="table-header"><h3>Portfolio Segments</h3></div>
            <table className="table">
              <thead>
                <tr>
                  <th>Segment</th><th>Volume</th><th>Risk</th><th>ROI</th>
                </tr>
              </thead>
              <tbody>
                {portfolioData.map((row, i) => (
                  <tr key={i}>
                    <td>{row.segment}</td>
                    <td>{row.volume}</td>
                    <td>{row.risk}</td>
                    <td>{row.roi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </section>
      </>
    </DashboardLayout>
  );
}
