import React from "react";
import DashboardLayout from "@/components/DashboardLayout";

export default function AnalystReports() {
  return (
    <DashboardLayout role="analyst">
      <>
        <style>{`
          /* ===== Base & Stability ===== */
          html, body {
            margin: 0;
            padding: 0;
            overflow-x: hidden;
            overflow-y: scroll;
            background: #f8fafc;
          }

          * {
            box-sizing: border-box;
            font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
          }

          /* ===== Page Header ===== */
          .reports-header {
            margin-bottom: 24px;
          }

          .reports-header h1 {
            font-size: 40px;
            font-weight: 700;
            letter-spacing: -0.02em;
            color: #0f172a;
            margin-bottom: 6px;
          }

          .reports-header p {
            font-size: 15px;
            color: #64748b;
          }

          /* ===== Card ===== */
          .card {
            background: #ffffff;
            border-radius: 16px;
            padding: 24px 26px;
            border: 1px solid #e5e7eb;
            box-shadow: 0 6px 20px rgba(15, 23, 42, 0.05);
          }

          .card h3 {
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 6px;
            color: #0f172a;
          }

          .card .subtitle {
            font-size: 14px;
            color: #64748b;
            margin-bottom: 18px;
          }

          /* ===== Table ===== */
          .table-container {
            width: 100%;
            overflow-x: auto;
          }

          table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
          }

          thead th {
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            color: #64748b;
            text-align: left;
            padding: 14px 16px;
            border-bottom: 1px solid #e5e7eb;
            background: #f8fafc;
          }

          tbody td {
            padding: 16px;
            font-size: 14px;
            color: #0f172a;
            border-bottom: 1px solid #f1f5f9;
          }

          tbody tr:hover {
            background: #f8fafc;
          }

          /* ===== Cell Styling ===== */
          .badge {
            padding: 6px 14px;
            border-radius: 999px;
            font-size: 12px;
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

          .volume {
            font-weight: 600;
          }
        `}</style>

        {/* Header */}
        <div className="reports-header">
          <h1>Reports Overview</h1>
          <p>Detailed reports and trend analysis</p>
        </div>

        {/* Card */}
        <div className="card">
          <h3>Monthly Performance Trends</h3>
          <p className="subtitle">
            Loan applications, approvals, and volume trends
          </p>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Applications</th>
                  <th>Approvals</th>
                  <th>Approval Rate</th>
                  <th>Defaults</th>
                  <th>Volume</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Jan 2024</td>
                  <td>98</td>
                  <td>76</td>
                  <td>77.6%</td>
                  <td><span className="badge low">3</span></td>
                  <td className="volume">45.0L</td>
                </tr>
                <tr>
                  <td>Feb 2024</td>
                  <td>112</td>
                  <td>89</td>
                  <td>79.5%</td>
                  <td><span className="badge low">2</span></td>
                  <td className="volume">52.0L</td>
                </tr>
                <tr>
                  <td>Mar 2024</td>
                  <td>128</td>
                  <td>95</td>
                  <td>74.2%</td>
                  <td><span className="badge medium">4</span></td>
                  <td className="volume">61.0L</td>
                </tr>
                <tr>
                  <td>Apr 2024</td>
                  <td>145</td>
                  <td>108</td>
                  <td>74.5%</td>
                  <td><span className="badge high">5</span></td>
                  <td className="volume">73.0L</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </>
    </DashboardLayout>
  );
}