import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';

export default function AnalystSettings() {
  return (
    <DashboardLayout role="analyst">
      <div>
      <div className="page-header"><h1>Analytics Settings</h1><p className="muted">Configure reporting parameters and data sources</p></div>
      <div className="two-col" style={{ marginTop: '1rem' }}>
        <div className="card" style={{ padding: '1.25rem' }}>
          <h3>Report Configuration</h3>
          <p className="muted">Customize your dashboard and reports</p>
          <div style={{ marginTop: '1rem' }}>
            <label className="muted">Default Time Period</label>
            <select className="input-block"><option>Monthly</option></select>
            <label className="muted" style={{ marginTop: '0.75rem' }}>Auto-refresh Interval</label>
            <select className="input-block"><option>Hourly</option></select>
            <button className="btn btn-dark" style={{ marginTop: '1rem' }}>Save Settings</button>
          </div>
        </div>
        <div className="card" style={{ padding: '1.25rem' }}>
          <h3>Export Options</h3>
          <p className="muted">Download reports in various formats</p>
          <div style={{ marginTop: '1rem', display: 'grid', gap: '0.75rem' }}>
            <button className="btn btn-outline">Export as CSV</button>
            <button className="btn btn-outline">Export as PDF</button>
            <button className="btn btn-outline">Export as Excel</button>
          </div>
        </div>
      </div>
      </div>
    </DashboardLayout>
  );
}
