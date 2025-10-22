import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';

export default function LenderReports() {
  return (
    <DashboardLayout role="lender">
      <div className="page-header">
        <h1>Reports</h1>
        <p className="muted">Export and review detailed reports</p>
      </div>

      <div className="large-cards" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
        <div className="card" style={{ padding: '1.5rem', borderRadius: 12, border: '1px solid var(--border)' }}>
          <h3>Monthly Summary</h3>
          <p className="muted">Overview of monthly metrics</p>
          <div style={{ height: 120, display: 'grid', placeItems: 'center', color: 'var(--muted)' }}>Summary placeholder</div>
        </div>
        <div className="card" style={{ padding: '1.5rem', borderRadius: 12, border: '1px solid var(--border)' }}>
          <h3>Custom Reports</h3>
          <p className="muted">Generate CSV or PDF exports</p>
          <div style={{ height: 120, display: 'grid', placeItems: 'center', color: 'var(--muted)' }}>Export options placeholder</div>
        </div>
      </div>

      <section className="table-block" style={{ marginTop: '1.25rem' }}>
        <div className="table-header"><h3>Available Reports</h3></div>
        <table className="table">
          <thead>
            <tr><th>Name</th><th>Type</th><th>Last Generated</th></tr>
          </thead>
          <tbody>
            <tr><td>Monthly Revenue</td><td>CSV</td><td>2025-10-19</td></tr>
            <tr><td>Performance Snapshot</td><td>PDF</td><td>2025-10-12</td></tr>
          </tbody>
        </table>
      </section>
    </DashboardLayout>
  );
}
