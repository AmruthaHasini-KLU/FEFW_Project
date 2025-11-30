import React from "react";
import DashboardSidebar from "@/components/DashboardSidebar";

export default function AnalystDashboard() {
  const portfolioData = [
    { segment: "Personal Loans", volume: "$1.2M", risk: "Low", roi: "6.5%" },
    { segment: "Business Loans", volume: "$3.5M", risk: "Medium", roi: "7.2%" },
    { segment: "Micro Loans", volume: "$580K", risk: "High", roi: "5.8%" }
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
        /* ================= RESET & STABILITY ================= */
        html, body {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
          overflow-y: scroll;
          background: #f8fafc;
        }

        * {
          box-sizing: border-box;
          font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
        }

        /* ================= LAYOUT ================= */
        .app-root {
          min-height: 100vh;
          color: #0f172a;
        }

        .layout {
          display: flex;
          min-height: 100vh;
        }

        .sidebar {
          width: 260px;
          min-width: 260px;
          max-width: 260px;
        }

        main {
          flex: 1;
          padding: 28px 36px;
        }

        /* ================= HEADER ================= */
        .page-title {
          font-size: 28px;
          font-weight: 600;
          margin-bottom: 6px;
        }

        .page-subtitle {
          color: #64748b;
          font-size: 14px;
          margin-bottom: 28px;
        }

        /* ================= STATS ================= */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 18px;
          margin-bottom: 28px;
        }

        .stat-card {
          background: #ffffff;
          border-radius: 14px;
          padding: 22px;
          border: 1px solid #e5e7eb;
          transition: box-shadow 0.2s ease;
        }

        .stat-card:hover {
          box-shadow: 0 10px 22px rgba(15, 23, 42, 0.08);
        }

        .stat-label {
          font-size: 13px;
          color: #64748b;
        }

        .stat-value {
          font-size: 30px;
          font-weight: 600;
          margin-top: 8px;
        }

        /* ================= CHART ================= */
        .card {
          background: #ffffff;
          border-radius: 14px;
          padding: 22px;
          border: 1px solid #e5e7eb;
          margin-bottom: 28px;
        }

        .card-title {
          font-size: 15px;
          font-weight: 600;
          margin-bottom: 14px;
        }

        .chart {
          display: flex;
          align-items: flex-end;
          height: 220px;
          gap: 16px;
          padding-top: 10px;
        }

        .bar-block {
          flex: 1;
          text-align: center;
        }

        .bar {
          width: 100%;
          background: linear-gradient(180deg, #2563eb, #1e40af);
          border-radius: 8px 8px 0 0;
        }

        .month {
          margin-top: 6px;
          font-size: 12px;
          color: #64748b;
        }

        /* ================= TABLE ================= */
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 14px;
        }

        th {
          font-size: 12px;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 14px;
          border-bottom: 1px solid #e5e7eb;
        }

        td {
          padding: 16px 14px;
          font-size: 14px;
          border-bottom: 1px solid #f1f5f9;
        }

        tbody tr:hover {
          background: #f8fafc;
        }

        /* ================= BADGES ================= */
        .badge {
          padding: 6px 14px;
          font-size: 12px;
          border-radius: 999px;
          font-weight: 600;
          display: inline-block;
        }

        .low {
          background: #ecfeff;
          color: #0f766e;
        }

        .medium {
          background: #fff7ed;
          color: #9a3412;
        }

        .high {
          background: #fef2f2;
          color: #991b1b;
        }
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
              <div className="stat-value">$5.28M</div>
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
                    <td>{row.volume}</td>
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