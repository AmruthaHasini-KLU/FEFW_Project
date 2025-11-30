import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { getCurrentUser } from '@/services/auth';

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
  const [offers, setOffers] = useState([]);
  const [term, setTerm] = useState('12');
  const [rate, setRate] = useState('10.5');
  const [amount, setAmount] = useState('5000');
  const [borrowers, setBorrowers] = useState([]);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const load = () => {
      const o = JSON.parse(localStorage.getItem('fynvia_offers_v1') || '[]');
      setOffers(o);
      const users = JSON.parse(localStorage.getItem('fynvia_users_v1') || '[]');
      setBorrowers(users.filter(u => u.role === 'borrower'));
      // load applications for lender to review
      const apps = JSON.parse(localStorage.getItem('fynvia_applications_v1') || '[]');
      setApplications(apps);
    };
    load();
  }, []);

  const saveOffers = (next) => {
    setOffers(next);
    localStorage.setItem('fynvia_offers_v1', JSON.stringify(next));
  };

  const createOffer = () => {
    const id = `OF-${Date.now()}`;
    const newOffer = { id, term: `${term} months`, rate: `${rate}%`, amount: Number(amount), createdBy: getCurrentUser()?.id || 'lender', status: 'available', assignedTo: null, createdAt: Date.now() };
    const next = [newOffer, ...offers];
    saveOffers(next);
    setAmount('');
  };

  const offerToBorrower = (offerId, borrowerId) => {
    const next = offers.map(o => o.id === offerId ? { ...o, assignedTo: borrowerId, status: 'offered' } : o);
    saveOffers(next);
    alert('Offer sent to borrower');
  };

  const saveApplications = (next) => {
    setApplications(next);
    localStorage.setItem('fynvia_applications_v1', JSON.stringify(next));
  };

  const decideApplication = (appId, decision) => {
    const userId = getCurrentUser()?.id || 'lender';
    const next = applications.map(a => a.createdAt === appId ? { ...a, status: decision, decidedBy: userId, decidedAt: Date.now() } : a);
    saveApplications(next);
    // If approved, optionally mark offer as accepted
    if (decision === 'approved') {
      const app = applications.find(a => a.createdAt === appId);
      if (app && app.offer && app.offer.id) {
        const nextOffers = offers.map(o => o.id === app.offer.id ? { ...o, status: 'accepted' } : o);
        saveOffers(nextOffers);
      }
    }
  };

  return (
    <DashboardLayout role="lender">
      <div className="page-header">
        <h1>Loan Offers</h1>
        <p className="muted">Create and assign loan offers to borrowers</p>
      </div>

      <div className="large-cards" style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: '1rem', marginTop: '1rem' }}>
        <div className="card" style={{ padding: '1.25rem' }}>
          <h3>Create Offer</h3>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <input value={term} onChange={(e) => setTerm(e.target.value)} placeholder="Term (months)" />
            <input value={rate} onChange={(e) => setRate(e.target.value)} placeholder="Rate (%)" />
            <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" />
            <button className="btn btn-primary" onClick={createOffer}>Create</button>
          </div>

          <h3 style={{ marginTop: 18 }}>Existing Offers</h3>
          <div style={{ marginTop: 8 }}>
            {offers.length === 0 && <div style={{ color: 'var(--muted)' }}>No offers yet.</div>}
            {offers.map((o) => (
              <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px dashed var(--border)' }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{o.id} • {o.term} • {o.rate}</div>
                  <div style={{ color: 'var(--muted)' }}>Amount: ₹{o.amount} • Status: {o.status}</div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <select onChange={(e) => offerToBorrower(o.id, e.target.value)} value={o.assignedTo || ''}>
                    <option value="">Assign to borrower</option>
                    {borrowers.map(b => <option key={b.id} value={b.id}>{b.name || b.email}</option>)}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <h3>Recent Activity</h3>
          <p className="muted">Offers created and their current status</p>
          <div style={{ marginTop: 12 }}>
            {offers.slice(0,6).map(o => (
              <div key={o.id} style={{ padding: 8, borderRadius: 8, border: '1px solid var(--border)', marginBottom: 8 }}>
                <div style={{ fontWeight: 700 }}>{o.id}</div>
                <div style={{ color: 'var(--muted)' }}>{o.term} • {o.rate} • ₹{o.amount}</div>
                <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Status: {o.status}{o.assignedTo ? ` • Assigned to ${o.assignedTo}` : ''}</div>
              </div>
            ))}
            <h4 style={{ marginTop: 12 }}>Applications</h4>
            {applications.length === 0 && <div style={{ color: 'var(--muted)', marginTop: 8 }}>No applications yet.</div>}
            {applications.slice(0,6).map(app => (
              <div key={app.createdAt} style={{ padding: 8, borderRadius: 8, border: '1px solid var(--border)', marginTop: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{app.name} — {app.email}</div>
                    <div style={{ color: 'var(--muted)' }}>Applied for: {app.offer?.term || app.offer || ''} • Amount: ₹{app.amount}</div>
                    <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Status: {app.status || 'pending'}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-primary" onClick={() => decideApplication(app.createdAt, 'approved')}>Approve</button>
                    <button className="btn btn-outline" onClick={() => decideApplication(app.createdAt, 'rejected')}>Reject</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
