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
  const [loanType, setLoanType] = useState('personal');
  // dynamic fields
  const [businessType, setBusinessType] = useState('');
  const [monthlyRevenue, setMonthlyRevenue] = useState('');
  const [courseName, setCourseName] = useState('');
  const [institution, setInstitution] = useState('');
  const [durationMonths, setDurationMonths] = useState('');
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
    // minimal validation for dynamic fields
    if (loanType === 'business' && (!businessType || !monthlyRevenue)) { setError('Please provide business details.'); return; }
    if (loanType === 'education' && (!courseName || !institution || !durationMonths)) { setError('Please provide education details.'); return; }
    // For demo, just save an application object in localStorage
    const apps = JSON.parse(localStorage.getItem('fynvia_apps_v1') || '[]');
    apps.push({ id: Date.now(), user: user?.id || 'guest', amount, term, purpose, details, created: Date.now() });
    localStorage.setItem('fynvia_apps_v1', JSON.stringify(apps));
    localStorage.removeItem(DRAFT_KEY);
    alert('Application submitted');
    navigate('/dashboard/borrower');
  };

  // EMI calculation (simple)
  const calcEMI = (P, n, annualRate = 12) => {
    const p = Number(P);
    const months = Number(n);
    if (!p || !months) return { emi: 0, totalInterest: 0 };
    const r = annualRate / 100 / 12;
    const emi = (p * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
    const total = emi * months;
    return { emi: Math.round(emi), totalInterest: Math.round(total - p) };
  };

  const { emi, totalInterest } = calcEMI(amount || 0, term || 0, 12);

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

        <div style={{ marginTop: 12 }}>
          <div className="label">Loan Type</div>
          <div className="loan-type-pills">
            {['personal','education','business','home','vehicle'].map((t)=> (
              <button key={t} type="button" className={`pill ${loanType===t? 'active':''}`} onClick={()=>setLoanType(t)}>{t.charAt(0).toUpperCase()+t.slice(1)}</button>
            ))}
          </div>
        </div>

        <label style={{ marginTop: 12 }}>
          <div className="label">Loan Purpose</div>
          <input value={purpose} onChange={(e)=>setPurpose(e.target.value)} placeholder={loanType==='education' ? 'Tuition, Course fee...' : 'e.g., consolidate debt'} />
        </label>

        {/* dynamic fields */}
        {loanType === 'business' && (
          <div className="form-grid">
            <label>
              <div className="label">Business type</div>
              <input value={businessType} onChange={(e)=>setBusinessType(e.target.value)} placeholder="e.g., Retail, Services" />
            </label>
            <label>
              <div className="label">Monthly revenue (₹)</div>
              <input value={monthlyRevenue} onChange={(e)=>setMonthlyRevenue(e.target.value)} placeholder="e.g., 150000" />
            </label>
          </div>
        )}
        {loanType === 'education' && (
          <div className="form-grid">
            <label>
              <div className="label">Course name</div>
              <input value={courseName} onChange={(e)=>setCourseName(e.target.value)} placeholder="e.g., MSc Computer Science" />
            </label>
            <label>
              <div className="label">Institution</div>
              <input value={institution} onChange={(e)=>setInstitution(e.target.value)} placeholder="e.g., University" />
            </label>
          </div>
        )}
        {loanType === 'education' && (
          <label>
            <div className="label">Duration (months)</div>
            <input value={durationMonths} onChange={(e)=>setDurationMonths(e.target.value)} placeholder="e.g., 24" />
          </label>
        )}

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
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="emi-preview" style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.95rem', color: 'var(--muted)' }}>Estimated EMI</div>
              <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>₹{emi.toLocaleString()}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Total interest ₹{totalInterest.toLocaleString()}</div>
            </div>
            <button type="submit" className="btn btn-dark">Submit Application</button>
          </div>
        </div>
      </form>
    </div>
  );
}
