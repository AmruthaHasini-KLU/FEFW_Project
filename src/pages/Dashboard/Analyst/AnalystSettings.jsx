import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import DashboardSettings from '@/components/DashboardSettings';

export default function AnalystSettings() {
  return (
    <DashboardLayout role="analyst">
      <div className="dashboard-content">
        <div className="page-header"><h1>Analytics Settings</h1><p className="muted">Configure reporting parameters and data sources</p></div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 16 }}>
          <div>
            <DashboardSettings>
              {/* no extra children here; DashboardSettings renders shared sections */}
            </DashboardSettings>
          </div>
          <aside className="card" style={{ padding: 16 }}>
            <h3>Report Configuration</h3>
            <p className="muted">Customize your dashboard and reports</p>
            <div style={{ marginTop: 12 }}>
              <label className="muted">Default Time Period</label>
              <select className="input-block"><option>Monthly</option></select>
              <label className="muted" style={{ marginTop: 8 }}>Auto-refresh Interval</label>
              <select className="input-block"><option>Hourly</option></select>
              <div style={{ marginTop: 12 }}>
                <button className="btn btn-outline">Export as CSV</button>
                <button className="btn btn-outline" style={{ marginLeft: 8 }}>Export as PDF</button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </DashboardLayout>
  );
}
