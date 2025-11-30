import React from 'react';
import DashboardSidebar from '@/components/DashboardSidebar';

export default function BorrowerOffers() {
  return (
    <div className="borrower-dashboard dashboard">
      <div className="dashboard-layout">
        <DashboardSidebar basePath="/dashboard/borrower" role="borrower" />

        <section className="dashboard-content borrower-content">
          <header className="borrower-header header">
            <h1>Offers</h1>
            <p className="muted">Available loan offers for you</p>
          </header>

          <div className="card" style={{ padding: '1.25rem' }}>
            <h3>Current Offers</h3>

            <ul style={{ marginTop: '1rem', lineHeight: 2 }}>
              <li>
                <strong>12 months</strong> @ <strong>10.5%</strong> —
                5,000/month
                <span className="muted"> (Best for short-term needs)</span>
              </li>

              <li>
                <strong>18 months</strong> @ <strong>10.8%</strong> —
                3,600/month
                <span className="muted"> (Balanced option)</span>
              </li>

              <li>
                <strong>24 months</strong> @ <strong>11.0%</strong> —
                2,800/month
                <span className="muted"> (Lower monthly EMI)</span>
              </li>

              <li>
                <strong>36 months</strong> @ <strong>11.75%</strong> —
                2,050/month
                <span className="muted"> (Long-term flexibility)</span>
              </li>

              <li>
                <strong>Exclusive Eligible Offer</strong> — 
                <span style={{ color: 'var(--green)' }}> 9.9%</span> for
                <strong> 12 months </strong>
                <span className="muted"> (Limited-time pre-approved)</span>
              </li>
            </ul>
          </div>

        </section>
      </div>
    </div>
  );
}