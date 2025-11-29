import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';
import SlidingPanel from '@/components/SlidingPanel';
import DashboardLayout from '@/components/DashboardLayout';
import LineChart from '@/components/charts/LineChart';
import DoughnutChart from '@/components/charts/DoughnutChart';

export default function BorrowerDashboard() {
  const { user } = useAuth();

  const notifications = [
    { id: 1, text: 'Payment due in 3 days' },
    { id: 2, text: 'Update income proof document' },
    { id: 3, text: 'New loan offer available' },
  ];

  // Sample KPIs and loan data (replace with real data later)
  const kpis = [
    { id: 1, title: 'Total Borrowed', value: '₹150K', sub: 'Current outstanding', trend: [5,6,7,6,8,7,9] },
    { id: 2, title: 'Active Loans', value: '2', sub: 'In good standing', trend: [2,2,3,2,2,1,2] },
    { id: 3, title: 'Next Payment', value: '₹8,500', sub: 'Due in 3 days', trend: [4,5,3,4,5,4,6] },
    { id: 4, title: 'Credit Score', value: '750', sub: 'Excellent rating', trend: [6,6,7,7,8,7,8] },
  ];

  const activeLoan = { amount: '₹50,000', balance: '₹35,000', rate: '12.5% p.a.', monthly: '₹4,500' };

  // Interactive state for demo purposes
  const [payments, setPayments] = useState([
    { id: 1, date: '2025-10-20', amount: '₹4,500', status: 'Due' },
    { id: 2, date: '2025-09-20', amount: '₹4,500', status: 'Paid' },
    { id: 3, date: '2025-08-20', amount: '₹4,500', status: 'Paid' },
  ]);

  const [documents, setDocuments] = useState([
    { id: 'id', name: 'ID Proof', status: 'uploaded' },
    { id: 'income', name: 'Income Proof', status: 'missing' },
  ]);

  const totalPayments = 12; // demo total scheduled payments
  const paymentsMade = payments.filter(p => p.status === 'Paid').length;
  const progress = Math.round((paymentsMade / totalPayments) * 100);

  // small reusable inline sparkline (dependency free)
  const Sparkline = ({ data = [], color = 'currentColor', width = 80, height = 28 }) => {
    if (!data || data.length === 0) return null;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const step = width / (data.length - 1);
    const points = data.map((d, i) => `${i * step},${height - ((d - min) / range) * height}`).join(' ');
    return (
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="sparkline">
        <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  };

  const handlePayNow = (paymentId) => {
    // mock payment flow: mark as Paid
    setPayments(prev => prev.map(p => p.id === paymentId ? { ...p, status: 'Paid' } : p));
  };

  const handleUpload = (docId) => {
    // mock upload: toggle to uploaded
    setDocuments(prev => prev.map(d => d.id === docId ? { ...d, status: 'uploaded' } : d));
  };

  const { logout } = useAuth();

  return (
    <DashboardLayout role="borrower">
      <>
        <section className="dashboard-content borrower-content">
          <header className="borrower-header header">
            <div className="header-left">
              <h1>Borrower Dashboard</h1>
              <p className="muted">Track your loans and manage payments</p>
            </div>
            <div className="header-right">
              <div className="lang"></div>
              <div className="user-info">
                <div className="user-name"></div>
                <div className="user-role"></div>
              </div>
              <button className="btn btn-outline" onClick={() => logout()}></button>
            </div>
          </header>

          <section className="kpi-row">
            {kpis.map(k => (
              <div key={k.id} className="kpi-card card">
                <div className="kpi-top">
                  <div className="kpi-title">{k.title}</div>
                  <div className="spark-wrap" aria-hidden>
                    <Sparkline data={k.trend} color="var(--accent-600)" />
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="kpi-value">{k.value}</div>
                </div>
                <div className="kpi-sub muted">{k.sub}</div>
              </div>
            ))}
          </section>

          <section className="two-col">
            <div className="card" style={{ padding: '1.25rem' }}>
              <h3>Payments Overview</h3>
              <p className="muted">Upcoming payments and history</p>
              <div style={{ marginTop: 12 }}>
                <h4 style={{ margin: '0 0 8px' }}>Repayment trend</h4>
                <LineChart labels={[ 'Jan','Feb','Mar','Apr','May','Jun','Jul' ]} data={[4500,4600,4300,4400,4700,4800,4500]} label="Monthly Payment" />
              </div>
                <div style={{ marginTop: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><div>Next payment</div><div className="muted">{kpis[2].value}</div></div>
                <div style={{ marginTop: 12 }}>
                  <table className="table"><thead><tr><th>Date</th><th>Amount</th><th>Status</th><th></th></tr></thead>
                    <tbody>
                      {payments.map(p => (
                        <tr key={p.id}>
                          <td>{p.date}</td>
                          <td>{p.amount}</td>
                          <td><span className={`status-badge ${String(p.status).toLowerCase()}`}>{p.status}</span></td>
                          <td>
                            {p.status === 'Due' && <button className="btn btn-primary btn-sm" onClick={() => handlePayNow(p.id)}>Pay Now</button>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: '1.25rem' }}>
              <h3>Offers & Documents</h3>
              <p className="muted">Active offers and required documents</p>
                <div style={{ marginTop: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div><strong>Available Offer:</strong> 12 months @ 10.5% (₹5,000)</div>
                  <div>
                    <Link to="/dashboard/borrower/apply" className="btn btn-outline btn-sm" style={{ marginRight: 8 }}>Apply</Link>
                    <button className="btn btn-primary btn-sm">View Offers</button>
                  </div>
                </div>
                <div style={{ marginTop: 8 }}>
                  <strong>Documents:</strong>
                  <ul style={{ marginTop: 6 }}>
                    {documents.map(d => (
                      <li key={d.id} style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 8 }} aria-hidden>
                          {d.status === 'uploaded' ? <span style={{ color: 'var(--green)' }}>✓</span> : <span style={{ color: 'var(--orange)' }}>•</span>}
                        </div>
                        <div style={{ flex: 1 }}>{d.name} <span className="muted">({d.status})</span></div>
                        {d.status !== 'uploaded' && <button className="btn btn-outline btn-sm" onClick={() => handleUpload(d.id)}>Upload</button>}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section style={{ marginTop: '1rem' }}>
            <div className="card" style={{ padding: '1.25rem' }}>
              <h3>Loan Details</h3>
              <p className="muted">Your active loan summary</p>
              <div style={{ marginTop: 12 }}>
                <div className="loan-row"><span>Loan Amount:</span><strong>{activeLoan.amount}</strong></div>
                <div className="loan-row"><span>Remaining Balance:</span><strong>{activeLoan.balance}</strong></div>
                <div className="loan-row"><span>Interest Rate:</span><strong>{activeLoan.rate}</strong></div>
                <div className="loan-row"><span>Monthly Payment:</span><strong>{activeLoan.monthly}</strong></div>
                <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ flex: 1, marginRight: 12 }}>
                    <div className="loan-progress" aria-hidden>
                      <div className="loan-progress-bar" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                  <div className="muted">{paymentsMade}/{totalPayments} payments</div>
                </div>
              </div>
            </div>
          </section>

          <section style={{ marginTop: '1rem' }}>
            <div className="card" style={{ padding: '1.25rem' }}>
              <h3>Loan Application History</h3>
              <p className="muted">Track your loan application status</p>
              <div style={{ marginTop: 12 }}>
                <table className="table">
                  <thead>
                    <tr><th>Amount</th><th>Purpose</th><th>Applied Date</th><th>Interest Rate</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    <tr><td>₹50,000</td><td>Business Expansion</td><td>2024-02-01</td><td>12.5%</td><td><span className="status-badge approved">approved</span></td></tr>
                    <tr><td>₹75,000</td><td>Equipment Purchase</td><td>2024-02-15</td><td>-</td><td><span className="status-badge pending">pending</span></td></tr>
                    <tr><td>₹25,000</td><td>Working Capital</td><td>2024-01-20</td><td>-</td><td><span className="status-badge rejected">rejected</span></td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section style={{ marginTop: '1rem' }}>
            <div className="card" style={{ padding: '1.25rem' }}>
              <h3>Predictive Insights</h3>
              <p className="muted">Estimated payment behavior and offers</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 180px', gap: '1rem', marginTop: 12 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                  <div style={{ textAlign: 'center' }}><div style={{ fontSize: 22, color: 'var(--accent)' }}>On-time Score</div><div className="muted">85%</div></div>
                  <div style={{ textAlign: 'center' }}><div style={{ fontSize: 22, color: 'var(--green)' }}>Eligible Offer</div><div className="muted">₹10K</div></div>
                  <div style={{ textAlign: 'center' }}><div style={{ fontSize: 22, color: 'var(--orange)' }}>Risk Flag</div><div className="muted">Low</div></div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <DoughnutChart labels={[ 'Paid', 'Due', 'Late' ]} values={[paymentsMade, totalPayments - paymentsMade, Math.max(0, 2)]} colors={[
  '#ef4444', // bright red
  '#3b82f6', // bright blue
  '#f59e0b', // bright yellow
  '#10b981', // bright green
]} />
                </div>
              </div>
            </div>
          </section>

        </section>

        <SlidingPanel side="right" />
      </>
    </DashboardLayout>
  );
}