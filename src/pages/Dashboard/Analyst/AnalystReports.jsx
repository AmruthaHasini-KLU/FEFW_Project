import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';

export default function AnalystReports() {
  return (
    <DashboardLayout role="analyst">
      <>
        <div className="page-header"><h1>Reports Overview</h1><p className="muted">Detailed reports and trend analysis</p></div>
        <div className="card" style={{ marginTop: '1rem', padding: '1.25rem' }}>
          <h3>Monthly Performance Trends</h3>
          <p className="muted">Loan applications, approvals, and volume trends</p>
          <div style={{ marginTop: '1rem' }}>
            <table className="table"><thead><tr><th>Month</th><th>Applications</th><th>Approvals</th><th>Approval Rate</th><th>Defaults</th><th>Volume</th></tr></thead>
              <tbody>
                <tr><td>Jan 2024</td><td>98</td><td>76</td><td>77.6%</td><td>3</td><td>₹45.0L</td></tr>
                <tr><td>Feb 2024</td><td>112</td><td>89</td><td>79.5%</td><td>2</td><td>₹52.0L</td></tr>
                <tr><td>Mar 2024</td><td>128</td><td>95</td><td>74.2%</td><td>4</td><td>₹61.0L</td></tr>
                <tr><td>Apr 2024</td><td>145</td><td>108</td><td>74.5%</td><td>5</td><td>₹73.0L</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </>
    </DashboardLayout>
  );
}
