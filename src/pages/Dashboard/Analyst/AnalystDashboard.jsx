import React from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import formatCurrency from "@/utils/formatCurrency";

export default function AnalystDashboard() {
  const portfolioData = [
    { segment: "Personal Loans", volume: 1200000, risk: "Low", roi: "6.5%" },
    { segment: "Business Loans", volume: 3500000, risk: "Medium", roi: "7.2%" },
    { segment: "Micro Loans", volume: 580000, risk: "High", roi: "5.8%" }
  ];

  const chartData = [
    { month: "Jan", value: 40 },
    { month: "Feb", value: 30 },
    { month: "Mar", value: 50 },
    { month: "Apr", value: 45 },
    { month: "May", value: 60 }
  ];

  return (
    <div className="app-root">
      <style>{`
        /* Use CSS variables so dark mode follows app theme */
        html, body { margin: 0; padding: 0; overflow-x: hidden; overflow-y: scroll; }
        * { box-sizing: border-box; font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont, sans-serif; }

        .app-root { min-height: 100vh; color: var(--text); background: var(--bg); }
        .layout { display: flex; min-height: 100vh; }
        .sidebar { width: 260px; min-width: 260px; max-width: 260px; }
        main { flex: 1; padding: 28px 36px; }

        .page-title { font-size: 28px; font-weight: 600; margin-bottom: 6px; }
        .page-subtitle { color: var(--muted); font-size: 14px; margin-bottom: 28px; }

        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 18px; margin-bottom: 28px; }
        .stat-card { background: var(--panel); border-radius: 14px; padding: 22px; border: 1px solid var(--border); transition: box-shadow 0.2s ease; }
        .stat-card:hover { box-shadow: var(--shadow); }
        .stat-label { font-size: 13px; color: var(--muted); }
        .stat-value { font-size: 30px; font-weight: 600; margin-top: 8px; }

        .card { background: var(--panel); border-radius: 14px; padding: 22px; border: 1px solid var(--border); margin-bottom: 28px; }
        .card-title { font-size: 15px; font-weight: 600; margin-bottom: 14px; color: var(--text); }
        .chart { display: flex; align-items: flex-end; height: 220px; gap: 16px; padding-top: 10px; }
        .bar-block { flex: 1; text-align: center; }
        .bar { width: 100%; background: linear-gradient(180deg, var(--accent), var(--accent-600)); border-radius: 8px 8px 0 0; }
        .month { margin-top: 6px; font-size: 12px; color: var(--muted); }

        table { width: 100%; border-collapse: collapse; margin-top: 14px; }
        th { font-size: 12px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.05em; padding: 14px; border-bottom: 1px solid var(--border); }
        td { padding: 16px 14px; font-size: 14px; border-bottom: 1px solid var(--border); color: var(--text); }
        tbody tr:hover { background: var(--surface); }

        .badge { padding: 6px 14px; font-size: 12px; border-radius: 999px; font-weight: 600; display: inline-block; }
        .low { background: rgba(16,185,129,0.08); color: #065f46; }
        .medium { background: rgba(249,115,22,0.08); color: #7c2d12; }
        .high { background: rgba(239,68,68,0.08); color: #7f1d1d; }
      `}</style>

      <div className="layout">
        <DashboardSidebar
          className="sidebar"
          basePath="/dashboard/analyst"
          role="analyst"
        />

        <main>
          <div className="page-title">Analyst Dashboard</div>
          <div className="page-subtitle">
            Portfolio insights and risk performance overview
          </div>

          {/* KPI Cards */}
          <section className="stats-grid">
            <div className="stat-card">
              <div className="stat-label">Default Rate</div>
              <div className="stat-value">2.3%</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Total Loan Volume</div>
              <div className="stat-value">{formatCurrency(5280000)}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Risk Exposure</div>
              <div className="stat-value">Medium</div>
            </div>
          </section>

          {/* Chart */}
          <section className="card">
            <div className="card-title">Loan Growth Trend</div>
              <div className="chart">
              {chartData.map((item, i) => (
                <div key={i} className="bar-block">
                  <div
                    className="bar"
                    style={{ height: (item.value * 3) + 'px' }}
                  />
                  <div className="month">{item.month}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Table */}
          <section className="card">
            <div className="card-title">Portfolio Segments</div>
           <table>
              <thead>
                <tr>
                  <th>Segment</th>
                  <th>Volume</th>
                  <th>Risk</th>
                  <th>ROI</th>
                </tr>
              </thead>
              <tbody>
                {portfolioData.map((row, i) => (
                  <tr key={i}>
                    <td>{row.segment}</td>
                    <td>{formatCurrency(row.volume)}</td>
                    <td>
                      <span className={`badge ${row.risk.toLowerCase()}`}>
                        {row.risk}
                      </span>
                    </td>
                    <td>{row.roi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </main>
      </div>
    </div>
  );
}