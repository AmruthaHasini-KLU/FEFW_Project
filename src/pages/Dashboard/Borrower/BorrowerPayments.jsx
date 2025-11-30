import React, { useState } from 'react';
import DashboardSidebar from '@/components/DashboardSidebar';

export default function BorrowerPayments() {
  const [payments] = useState([
    { id: 1, date: '2025-10-20', amount: '4,500', status: 'Due' },
    { id: 2, date: '2025-09-20', amount: '4,500', status: 'Paid' },
  ]);

  return (
    <div className="borrower-dashboard dashboard">
      <div className="dashboard-layout">
        <DashboardSidebar basePath="/dashboard/borrower" role="borrower" />
        <section className="dashboard-content borrower-content">
          <header className="borrower-header header"><h1>Payments</h1><p className="muted">Manage and review payments</p></header>
          <div className="card">
            <table className="table"><thead><tr><th>Date</th><th>Amount</th><th>Status</th></tr></thead>
              <tbody>
                {payments.map(p => (
                  <tr key={p.id}><td>{p.date}</td><td>{p.amount}</td><td>{p.status}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}