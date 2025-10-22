import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';

export default function AnalystDataAnalysis() {
  return (
    <DashboardLayout role="analyst">
      <>
        <div className="page-header"><h1>Advanced Data Analysis</h1><p className="muted">Deep dive into loan performance and customer behavior</p></div>
        <div className="two-col" style={{ marginTop: '1rem' }}>
          <div className="card" style={{ padding: '1.25rem' }}>
            <h3>Customer Segmentation</h3>
            <p className="muted">Analysis by customer demographics and behavior</p>
            <div style={{ marginTop: '1rem' }}>
              <div className="progress-row"><div>First-time Borrowers</div><div className="progress"><div className="bar" style={{ width: '45%' }} /></div><div className="progress-label">45%</div></div>
              <div className="progress-row"><div>Repeat Customers</div><div className="progress"><div className="bar" style={{ width: '35%' }} /></div><div className="progress-label">35%</div></div>
              <div className="progress-row"><div>High-value Customers</div><div className="progress"><div className="bar" style={{ width: '20%' }} /></div><div className="progress-label">20%</div></div>
            </div>
          </div>
          <div className="card" style={{ padding: '1.25rem' }}>
            <h3>Seasonal Trends</h3>
            <p className="muted">Loan demand patterns throughout the year</p>
            <div style={{ height: 140, display: 'grid', placeItems: 'center', color: 'var(--muted)' }}>Seasonal analysis would be displayed here</div>
          </div>
        </div>
        <div className="card" style={{ marginTop: '1rem', padding: '1.25rem' }}>
          <h3>Predictive Analytics</h3>
          <p className="muted">ML-powered insights and forecasting</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
            <div style={{ textAlign: 'center' }}><div style={{ fontSize: 28, color: 'var(--accent)' }}>92%</div><div className="muted">Predicted approval accuracy</div></div>
            <div style={{ textAlign: 'center' }}><div style={{ fontSize: 28, color: 'var(--green)' }}>15%</div><div className="muted">Expected growth next quarter</div></div>
            <div style={{ textAlign: 'center' }}><div style={{ fontSize: 28, color: 'var(--orange)' }}>2.8%</div><div className="muted">Forecasted default rate</div></div>
          </div>
        </div>
      </>
    </DashboardLayout>
  );
}
