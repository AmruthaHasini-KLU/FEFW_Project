import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Input from '@/components/Form/Input';
import CustomSelect from '@/components/CustomSelect';

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
  const [incomeWarning, setIncomeWarning] = useState('');
  const [idWarning, setIdWarning] = useState('');
  const [businessWarning, setBusinessWarning] = useState('');
  const [error, setError] = useState('');

  const SIZE_LIMIT = 2 * 1024 * 1024; // 2MB

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

  const fileToDataUrl = (file) => new Promise((res, rej) => {
    if (!file) return res(null);
    const reader = new FileReader();
    reader.onload = () => res(reader.result);
    reader.onerror = (e) => rej(e);
    reader.readAsDataURL(file);
  });

  // Simple IndexedDB helper for storing large files when localStorage quota is exceeded
  const idbOpen = () => new Promise((res, rej) => {
    const req = window.indexedDB.open('fynvia_files', 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains('files')) db.createObjectStore('files', { keyPath: 'key' });
    };
    req.onsuccess = () => res(req.result);
    req.onerror = () => rej(req.error);
  });

  const idbPut = async (key, blob) => {
    const db = await idbOpen();
    return new Promise((res, rej) => {
      const tx = db.transaction('files', 'readwrite');
      const store = tx.objectStore('files');
      store.put({ key, blob, createdAt: Date.now() });
      tx.oncomplete = () => { db.close(); res(); };
      tx.onerror = () => { db.close(); rej(tx.error); };
    });
  };

  const idbGet = async (key) => {
    const db = await idbOpen();
    return new Promise((res, rej) => {
      const tx = db.transaction('files', 'readonly');
      const store = tx.objectStore('files');
      const r = store.get(key);
      r.onsuccess = () => { db.close(); res(r.result); };
      r.onerror = () => { db.close(); rej(r.error); };
    });
  };

  const handleUpload = async (type, file) => {
    if (!file) { alert('Please choose a file first'); return; }
    const docsKey = 'fynvia_documents_v1';
    const uid = user?.id || 'guest';
    const lsThreshold = 900000; // ~900KB threshold for safe localStorage storage
    try {
      // if file is small enough, try storing as data URL in localStorage
      if (file.size <= lsThreshold) {
        const dataUrl = await fileToDataUrl(file);
        const all = JSON.parse(localStorage.getItem(docsKey) || '{}');
        all[uid] = all[uid] || {};
        all[uid][type] = { name: file.name, size: file.size, type: file.type, data: dataUrl, uploadedAt: Date.now() };
        try {
          localStorage.setItem(docsKey, JSON.stringify(all));
          alert(`${file.name} uploaded as ${type}`);
          return;
        } catch (err) {
          // quota exceeded, fallthrough to IDB fallback
          console.warn('localStorage quota exceeded, will fallback to IndexedDB', err);
        }
      }

      // Fallback: store larger files (or when quota exceeded) into IndexedDB
      const key = `${uid}-${type}-${Date.now()}`;
      await idbPut(key, file);
      const all2 = JSON.parse(localStorage.getItem(docsKey) || '{}');
      all2[uid] = all2[uid] || {};
      all2[uid][type] = { name: file.name, size: file.size, type: file.type, idb: true, idbKey: key, uploadedAt: Date.now() };
      localStorage.setItem(docsKey, JSON.stringify(all2));
      alert(`${file.name} uploaded as ${type} (stored in browser file store)`);
    } catch (err) {
      console.error('upload failed', err);
      alert('Upload failed: ' + (err?.message || err));
    }
  };

  const handleFileSelect = (type, file) => {
    // set file state and file-size warnings (non-blocking)
    if (type === 'income') {
      setIncomeFile(file || null);
      setIncomeWarning(file && file.size > SIZE_LIMIT ? 'Large file: may be stored in browser file store (IndexedDB).' : '');
    }
    if (type === 'id') {
      setIdFile(file || null);
      setIdWarning(file && file.size > SIZE_LIMIT ? 'Large file: may be stored in browser file store (IndexedDB).' : '');
    }
    if (type === 'business') {
      setBusinessFile(file || null);
      setBusinessWarning(file && file.size > SIZE_LIMIT ? 'Large file: may be stored in browser file store (IndexedDB).' : '');
    }
  };

  const incomeRef = useRef(null);
  const idRef = useRef(null);
  const businessRef = useRef(null);

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
          <Input placeholder="e.g., 50000" label="Loan Amount" value={amount} onChange={(e)=>setAmount(e.target.value)} />
          <div>
            <div className="form-field">
              <label className="form-label">Loan Term (months)</label>
              <CustomSelect
                value={term}
                onChange={(v)=>setTerm(v)}
                options={[{ value: '', label: 'Select term' }, { value: '12', label: '12' }, { value: '24', label: '24' }, { value: '36', label: '36' }]}
              />
            </div>
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <div className="label">Loan Type</div>
          <div className="loan-type-pills">
            {['personal','education','business','home','vehicle'].map((t)=> (
              <button key={t} type="button" className={`pill ${loanType===t? 'active':''}`} onClick={()=>setLoanType(t)}>{t.charAt(0).toUpperCase()+t.slice(1)}</button>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <Input label="Loan Purpose" placeholder={loanType==='education' ? 'Tuition, Course fee...' : 'e.g., consolidate debt'} value={purpose} onChange={(e)=>setPurpose(e.target.value)} />
        </div>

        {/* dynamic fields */}
        {loanType === 'business' && (
          <div className="form-grid">
            <Input label="Business type" placeholder="e.g., Retail, Services" value={businessType} onChange={(e)=>setBusinessType(e.target.value)} />
            <Input label="Monthly revenue" placeholder="e.g., 150000" value={monthlyRevenue} onChange={(e)=>setMonthlyRevenue(e.target.value)} />
          </div>
        )}
        {loanType === 'education' && (
          <div className="form-grid">
            <Input label="Course name" placeholder="e.g., MSc Computer Science" value={courseName} onChange={(e)=>setCourseName(e.target.value)} />
            <Input label="Institution" placeholder="e.g., University" value={institution} onChange={(e)=>setInstitution(e.target.value)} />
          </div>
        )}
        {loanType === 'education' && (
          <Input label="Duration (months)" placeholder="e.g., 24" value={durationMonths} onChange={(e)=>setDurationMonths(e.target.value)} />
        )}

        <label>
          <div className="label">Additional Details</div>
          <textarea placeholder="Provide more details about your loan requirement..." value={details} onChange={(e)=>setDetails(e.target.value)} />
        </label>

        <h3>Required Documents</h3>
        <div className="doc-row">
          <div className="doc-box">
            <div className="doc-left">
              <div className="doc-title">Income Proof</div>
              <input ref={incomeRef} type="file" style={{ display: 'none' }} onChange={(e)=>handleFileSelect('income', e.target.files[0])} />
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <button type="button" className="btn btn-outline" onClick={() => incomeRef.current && incomeRef.current.click()}>Choose File</button>
                <div style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>{incomeFile ? incomeFile.name : 'No file chosen'}{incomeWarning && <div style={{ color: 'var(--danger)', fontSize: '0.85rem', marginTop: 4 }}>{incomeWarning}</div>}</div>
              </div>
            </div>
            <div className="doc-right">
              <button type="button" className="btn" onClick={async () => {
                await handleUpload('income', incomeFile);
                if (incomeRef.current) incomeRef.current.value = '';
              }} disabled={!incomeFile}>Upload</button>
            </div>
          </div>
          <div className="doc-box">
            <div className="doc-left">
              <div className="doc-title">Identity Proof</div>
              <input ref={idRef} type="file" style={{ display: 'none' }} onChange={(e)=>handleFileSelect('id', e.target.files[0])} />
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <button type="button" className="btn btn-outline" onClick={() => idRef.current && idRef.current.click()}>Choose File</button>
                <div style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>{idFile ? idFile.name : 'No file chosen'}{idWarning && <div style={{ color: 'var(--danger)', fontSize: '0.85rem', marginTop: 4 }}>{idWarning}</div>}</div>
              </div>
            </div>
            <div className="doc-right">
              <button type="button" className="btn" onClick={async () => {
                await handleUpload('id', idFile);
                if (idRef.current) idRef.current.value = '';
              }} disabled={!idFile}>Upload</button>
            </div>
          </div>
          <div className="doc-box">
            <div className="doc-left">
              <div className="doc-title">Business Proof</div>
              <input ref={businessRef} type="file" style={{ display: 'none' }} onChange={(e)=>handleFileSelect('business', e.target.files[0])} />
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <button type="button" className="btn btn-outline" onClick={() => businessRef.current && businessRef.current.click()}>Choose File</button>
                <div style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>{businessFile ? businessFile.name : 'No file chosen'}{businessWarning && <div style={{ color: 'var(--danger)', fontSize: '0.85rem', marginTop: 4 }}>{businessWarning}</div>}</div>
              </div>
            </div>
            <div className="doc-right">
              <button type="button" className="btn" onClick={async () => {
                await handleUpload('business', businessFile);
                if (businessRef.current) businessRef.current.value = '';
              }} disabled={!businessFile}>Upload</button>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-outline" onClick={saveDraft}>Save as Draft</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="emi-preview" style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.95rem', color: 'var(--muted)' }}>Estimated EMI</div>
              <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>{emi.toLocaleString()}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>{'Total interest ' + totalInterest.toLocaleString()}</div>
            </div>
            <button type="submit" className="btn btn-dark">Submit Application</button>
          </div>
        </div>
      </form>
    </div>
  );
}
