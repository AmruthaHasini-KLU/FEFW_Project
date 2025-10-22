import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const DRAFT_KEY = 'fynvia_apply_draft_v1';

export default function Apply() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [term, setTerm] = useState('');
  const [purpose, setPurpose] = useState('');
  const [details, setDetails] = useState('');
  const [incomeFile, setIncomeFile] = useState(null);
  const [idFile, setIdFile] = useState(null);
  const [businessFile, setBusinessFile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const d = JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null');
    if (d) {
      setAmount(d.amount || ''); setTerm(d.term || ''); setPurpose(d.purpose || ''); setDetails(d.details || '');
    }
  }, []);

  const saveDraft = () => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ amount, term, purpose, details }));
    alert('Saved as draft');
  };

  const submit = (e) => {
    e?.preventDefault();
    setError('');
    if (!amount || !term || !purpose) { setError('Please fill required fields.'); return; }
    // For demo, just save an application object in localStorage
    const apps = JSON.parse(localStorage.getItem('fynvia_apps_v1') || '[]');
    apps.push({ id: Date.now(), user: user?.id || 'guest', amount, term, purpose, details, created: Date.now() });
    localStorage.setItem('fynvia_apps_v1', JSON.stringify(apps));
    localStorage.removeItem(DRAFT_KEY);
    alert('Application submitted');
    navigate('/dashboard/borrower');
  };

  return (
    <div className="apply-page">
      <div className="page-header">
        <h1>Apply for Loan</h1>
        <p className="muted">Submit a new loan application</p>
      </div>

      <form className="apply-form" onSubmit={submit}>
        {error && <div className="auth-error">{error}</div>}

        <div className="form-grid">
          <label>
            <div className="label">Loan Amount (₹)</div>
            <input placeholder="e.g., 50000" value={amount} onChange={(e)=>setAmount(e.target.value)} />
          </label>
          <label>
            <div className="label">Loan Term (months)</div>
            <select value={term} onChange={(e)=>setTerm(e.target.value)}>
              <option value="">Select term</option>
              <option value="12">12</option>
              <option value="24">24</option>
              <option value="36">36</option>
            </select>
          </label>
        </div>

        <label>
          <div className="label">Loan Purpose</div>
          <select value={purpose} onChange={(e)=>setPurpose(e.target.value)}>
            <option value="">Select purpose</option>
            <option value="personal">Personal</option>
            <option value="business">Business</option>
          </select>
        </label>

        <label>
          <div className="label">Additional Details</div>
          <textarea placeholder="Provide more details about your loan requirement..." value={details} onChange={(e)=>setDetails(e.target.value)} />
        </label>

        <h3>Required Documents</h3>
        <div className="doc-row">
          <div className="doc-box">
            <div className="doc-title">Income Proof</div>
            <input type="file" onChange={(e)=>setIncomeFile(e.target.files[0])} />
            <button type="button" className="btn">Upload</button>
          </div>
          <div className="doc-box">
            <div className="doc-title">Identity Proof</div>
            <input type="file" onChange={(e)=>setIdFile(e.target.files[0])} />
            <button type="button" className="btn">Upload</button>
          </div>
          <div className="doc-box">
            <div className="doc-title">Business Proof</div>
            <input type="file" onChange={(e)=>setBusinessFile(e.target.files[0])} />
            <button type="button" className="btn">Upload</button>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-outline" onClick={saveDraft}>Save as Draft</button>
          <button type="submit" className="btn btn-dark">Submit Application</button>
        </div>
      </form>
    </div>
  );
}
