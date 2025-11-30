import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';

function InlineLineChart({ data = [30, 45, 28, 60, 75, 62, 80], color = 'var(--accent)' }) {
  const w = 420;
  const h = 120;
  const padding = 12;
  const max = Math.max(...data);
  const points = data.map((v, i) => {
    const x = padding + (i * (w - padding * 2)) / (data.length - 1);
    const y = h - padding - (v / max) * (h - padding * 2);
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.16" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <polyline points={points} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      <polygon points={`${padding},${h - padding} ${points} ${w - padding},${h - padding}`} fill="url(#g)" opacity="0.9" />
    </svg>
  );
}

export default function LenderOffers() {
  return (
    <DashboardLayout role="lender">
      <div className="page-header">
        <h1>Analytics & Reports</h1>
        <p className="muted">Detailed insights into your lending performance</p>
      </div>

      <div className="large-cards" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
        <div className="card" style={{ padding: '2rem', borderRadius: 12, border: '1px solid var(--border)' }}>
          <h3>Monthly Revenue</h3>
          <p className="muted">Interest income over time</p>
          <div style={{ height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)' }}>
            <InlineLineChart data={[120, 150, 110, 180, 220, 200, 260]} color="var(--accent)" />
          </div>
        </div>

        <div className="card" style={{ padding: '2rem', borderRadius: 12, border: '1px solid var(--border)' }}>
          <h3>Loan Performance</h3>
          <p className="muted">Repayment rates and defaults</p>
          <div style={{ height: 140, display: 'grid', placeItems: 'center', color: 'var(--muted)' }}>
            <div style={{ fontSize: 32 }}>📊</div>
            <div style={{ marginTop: 8 }}>Performance chart visualization would go here</div>
          </div>
        </div>
      </div>

      <section className="table-block" style={{ marginTop: '1.25rem' }}>
        <div className="table-header"><h3>Offers</h3></div>
        <table className="table">
          <thead>
            <tr><th>Offer ID</th><th>Term</th><th>Rate</th><th>Amount</th></tr>
          </thead>
          <tbody>
            <tr><td>OF-1001</td><td>12 months</td><td>10.5%</td><td>5,000</td></tr>
            <tr><td>OF-1002</td><td>24 months</td><td>11.0%</td><td>12,000</td></tr>
          </tbody>
          </table>
        </section>
      </DashboardLayout>
  );
}
