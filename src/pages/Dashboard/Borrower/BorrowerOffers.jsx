import React from 'react';
import DashboardSidebar from '@/components/DashboardSidebar';

export default function BorrowerOffers() {
  return (
    <div className="borrower-dashboard dashboard">
      <div className="dashboard-layout">
        <DashboardSidebar basePath="/dashboard/borrower" role="borrower" />
        <section className="dashboard-content borrower-content">
          <header className="borrower-header header"><h1>Offers</h1><p className="muted">Available loan offers for you</p></header>
          <div className="card">
            <h3>Current Offers</h3>
            <ul>
              <li>12 months @10.5% — ₹5,000/month</li>
              <li>24 months @11.0% — ₹2,800/month</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
