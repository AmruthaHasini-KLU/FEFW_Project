import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';

export default function LenderPayments() {
  return (
    <DashboardLayout role="lender">
      <div className="page-header">
        <h1>Payments</h1>
        <p className="muted">Track incoming repayments and failures</p>
      </div>

      <div className="large-cards" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
        <div className="card" style={{ padding: '1.5rem', borderRadius: 12, border: '1px solid var(--border)' }}>
          <h3>Recent Receipts</h3>
          <p className="muted">Latest successful repayments</p>
          <div style={{ height: 120, display: 'grid', placeItems: 'center', color: 'var(--muted)' }}>List placeholder</div>
        </div>
        <div className="card" style={{ padding: '1.5rem', borderRadius: 12, border: '1px solid var(--border)' }}>
          <h3>Failed Payments</h3>
          <p className="muted">Payments requiring attention</p>
          <div style={{ height: 120, display: 'grid', placeItems: 'center', color: 'var(--muted)' }}>List placeholder</div>
        </div>
      </div>

      <section className="table-block" style={{ marginTop: '1.25rem' }}>
        <div className="table-header"><h3>Payments</h3></div>
        <table className="table">
          <thead>
            <tr><th>Date</th><th>Borrower</th><th>Amount</th><th>Status</th></tr>
          </thead>
          <tbody>
            <tr><td>2025-10-20</td><td>John D.</td><td>₹450</td><td>Success</td></tr>
            <tr><td>2025-10-19</td><td>Mia P.</td><td>₹650</td><td>Failed</td></tr>
          </tbody>
        </table>
      </section>
    </DashboardLayout>
  );
}
