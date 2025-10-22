import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';

export default function LenderBorrowers() {
  return (
    <DashboardLayout role="lender">
      <div className="page-header">
        <h1>Borrowers</h1>
        <p className="muted">Manage and review borrower profiles and risk</p>
      </div>

      <div className="large-cards" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
        <div className="card" style={{ padding: '1.5rem', borderRadius: 12, border: '1px solid var(--border)' }}>
          <h3>Top Risk Segments</h3>
          <p className="muted">Identify high-risk borrower groups</p>
          <div style={{ height: 120, display: 'grid', placeItems: 'center', color: 'var(--muted)' }}>Visualization placeholder</div>
        </div>
        <div className="card" style={{ padding: '1.5rem', borderRadius: 12, border: '1px solid var(--border)' }}>
          <h3>New Applicants</h3>
          <p className="muted">Recent borrowers needing review</p>
          <div style={{ height: 120, display: 'grid', placeItems: 'center', color: 'var(--muted)' }}>List placeholder</div>
        </div>
      </div>

      <section className="table-block" style={{ marginTop: '1.25rem' }}>
        <div className="table-header"><h3>Borrower List</h3></div>
        <table className="table">
          <thead>
            <tr><th>Borrower</th><th>Score</th><th>Active Loans</th><th>Outstanding</th></tr>
          </thead>
          <tbody>
            <tr><td>John D.</td><td>710</td><td>1</td><td>₹4,200</td></tr>
            <tr><td>Mia P.</td><td>680</td><td>2</td><td>₹11,500</td></tr>
          </tbody>
        </table>
      </section>
    </DashboardLayout>
  );
}
