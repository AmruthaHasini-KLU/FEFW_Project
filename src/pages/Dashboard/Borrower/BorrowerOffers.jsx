import React, { useState, useEffect } from 'react';

import DashboardSidebar from '@/components/DashboardSidebar';
import { useAuth } from '@/context/AuthContext';


export default function BorrowerOffers() {
  const { user } = useAuth();
  const [offers, setOffers] = useState([]);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', amount: '' });
  const [savedApplications, setSavedApplications] = useState([]);

  useEffect(() => {
    // load offers from localStorage (created by lender)
    const stored = JSON.parse(localStorage.getItem('fynvia_offers_v1') || '[]');
    // fallback sample offers if none exist
    const fallback = [
      { id: 'sample-1', term: '12 months', rate: '10.5%', amount: 5000, status: 'available', assignedTo: null },
      { id: 'sample-2', term: '18 months', rate: '10.8%', amount: 3600, status: 'available', assignedTo: null },
    ];
    const list = (stored && stored.length) ? stored : fallback;
    // show offers that are either assigned to this user or are available
    const uid = user?.id || 'guest';
    const visible = list.filter(o => !o.assignedTo || o.assignedTo === uid);
    setOffers(visible);

    // load saved applications from localStorage
    const apps = JSON.parse(localStorage.getItem('fynvia_applications_v1') || '[]');
    const myApps = apps.filter(a => a.userId === uid);
    setSavedApplications(myApps);

    const onStorage = (e) => {
      if (e.key === 'fynvia_applications_v1') {
        try {
          const newApps = JSON.parse(e.newValue || '[]');
          const mine = newApps.filter(a => a.userId === uid);
          setSavedApplications(mine);
        } catch (err) {
          // ignore
        }
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [user]);

  const persistApplications = (next) => {
    // load existing all apps, replace or append
    const uid = user?.id || 'guest';
    const all = JSON.parse(localStorage.getItem('fynvia_applications_v1') || '[]');
    // remove existing apps by same id if any and belonging to this user
    const filtered = all.filter(a => a.userId !== uid);
    const merged = [...filtered, ...next];
    localStorage.setItem('fynvia_applications_v1', JSON.stringify(merged));
  };

  const handleApply = (offer) => {
    setSelectedOffer(offer); // show form for this offer
    setFormData({ name: '', email: '', amount: '' }); // reset form
  };

  const handleNotInterested = (offer) => {
    // persist response so lender can see interest status (demo)
    const uid = user?.id || 'guest';
    const key = 'fynvia_offer_responses_v1';
    const all = JSON.parse(localStorage.getItem(key) || '{}');
    all[uid] = all[uid] || {};
    all[uid][offer.id || offer.label || offer] = { response: 'not_interested', at: Date.now() };
    localStorage.setItem(key, JSON.stringify(all));
    alert('Marked as Not Interested');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const uid = user?.id || 'guest';
    const newApplication = { ...formData, offer: selectedOffer, userId: uid, createdAt: Date.now() };
    const next = [...savedApplications, newApplication];
    setSavedApplications(next);
    persistApplications(next.map(a => ({ ...a, userId: uid })));
    setSelectedOffer(null); // hide form after saving
    alert(`Application saved for ${selectedOffer.id || selectedOffer.label || selectedOffer}`);
  };

  // Button styles
  const buttonStyle = {
    padding: '0.4rem 0.8rem',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.9rem',
    marginRight: '0.5rem',
  };
  const applyStyle = { ...buttonStyle, backgroundColor: 'var(--green, #28a745)', color: '#fff' };
  const notInterestedStyle = { ...buttonStyle, backgroundColor: 'var(--gray, #6c757d)', color: '#fff' };

  // note: `offers` state now populated from localStorage

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
              {offers.map((offer, idx) => (
                <li key={offer.id || idx}>
                  <strong>{offer.term || offer.label || `${offer.id}`}{offer.rate ? ` @ ${offer.rate}` : ''}</strong>
                  {' '}— <span className="muted">{offer.amount ? `₹${offer.amount}` : ''} {offer.desc || ''}</span>
                  <div style={{ marginTop: '0.5rem' }}>
                    <button style={applyStyle} onClick={() => handleApply(offer)}>Apply</button>
                    <button style={notInterestedStyle} onClick={() => handleNotInterested(offer)}>Not Interested</button>
                  </div>

                  {/* Show form only for the selected offer */}
                  {selectedOffer && (selectedOffer.id || selectedOffer.label) === (offer.id || offer.label) && (
                    <div className="card" style={{ padding: '1rem', marginTop: '0.75rem' }}>
                      <h4>Application Form for {offer.term || offer.label}</h4>
                      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <input
                          type="text"
                          name="name"
                          placeholder="Your Name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                        <input
                          type="email"
                          name="email"
                          placeholder="Your Email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                        <input
                          type="number"
                          name="amount"
                          placeholder="Loan Amount"
                          value={formData.amount}
                          onChange={handleChange}
                          required
                        />
                        <button type="submit" style={{ backgroundColor: 'var(--green)', color: '#fff', padding: '0.5rem' }}>
                          Save Application
                        </button>
                      </form>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Show saved applications */}
          {savedApplications.length > 0 && (
            <div className="card" style={{ padding: '1.25rem', marginTop: '1rem' }}>
              <h3>Saved Applications</h3>
              <ul>
                {savedApplications.map((app, idx) => (
                  <li key={idx} style={{ marginBottom: 8 }}>
                    <div style={{ fontWeight: 700 }}>{app.name} — {app.email}</div>
                    <div style={{ color: 'var(--muted)' }}>
                      Applied for: {app.offer?.term || app.offer || ''} — Amount: ₹{app.amount}
                    </div>
                    <div style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
                      Status: {app.status || 'pending'}{app.status === 'approved' && app.decidedBy ? ` • Approved by ${app.decidedBy}` : ''}{app.status === 'rejected' && app.decidedBy ? ` • Rejected by ${app.decidedBy}` : ''}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}