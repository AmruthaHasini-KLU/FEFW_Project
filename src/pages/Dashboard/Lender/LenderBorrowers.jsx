import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';

function DocsList() {
  const [docs, setDocs] = useState([]);

  const idbOpen = () => new Promise((res, rej) => {
    const req = window.indexedDB.open('fynvia_files', 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains('files')) db.createObjectStore('files', { keyPath: 'key' });
    };
    req.onsuccess = () => res(req.result);
    req.onerror = () => rej(req.error);
  });

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

  useEffect(() => {
    try {
      const all = JSON.parse(localStorage.getItem('fynvia_documents_v1') || '{}');
      const rows = [];
      Object.keys(all).forEach((uid) => {
        const userDocs = all[uid] || {};
        Object.keys(userDocs).forEach((type) => {
          const d = userDocs[type];
          rows.push({ uid, type, name: d.name, size: d.size, data: d.data, idb: d.idb || false, idbKey: d.idbKey || null, uploadedAt: d.uploadedAt });
        });
      });
      setDocs(rows);
    } catch (err) {
      setDocs([]);
    }
  }, []);

  if (!docs.length) return <div style={{ color: 'var(--muted)' }}>No documents uploaded yet.</div>;

  return (
    <div style={{ display: 'grid', gap: 8 }}>
      {docs.map((r, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, padding: '8px 12px', borderRadius: 8, background: 'var(--panel)', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ fontWeight: 700 }}>{r.name}</div>
            <div style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>{r.type}</div>
            <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{new Date(r.uploadedAt).toLocaleString()}</div>
          </div>
          <div>
            {(r.data || r.idb) ? (
              <>
                <button className="btn btn-primary" onClick={async () => {
                  if (r.data) return window.open(r.data, '_blank', 'noopener');
                  try {
                    const rec = await idbGet(r.idbKey);
                    if (!rec || !rec.blob) { alert('File missing'); return; }
                    const url = URL.createObjectURL(rec.blob);
                    const w = window.open();
                    if (w) {
                      w.document.open();
                      w.document.write(`<!doctype html><title>${r.name}</title><meta charset="utf-8"><body style="margin:0"><iframe src="${url}" style="border:0;width:100vw;height:100vh"></iframe></body>`);
                      w.document.close();
                      setTimeout(() => URL.revokeObjectURL(url), 60 * 1000);
                    } else {
                      window.open(url, '_blank', 'noopener');
                    }
                  } catch (err) { console.error(err); alert('Failed to read file'); }
                }}>View</button>
                {r.data && <a style={{ marginLeft: 8 }} href={r.data} download={r.name} className="btn btn-outline">Download</a>}
                {r.idb && <a style={{ marginLeft: 8 }} className="btn btn-outline" onClick={async (e) => {
                  e.preventDefault();
                  try {
                    const rec = await idbGet(r.idbKey);
                    if (!rec || !rec.blob) { alert('File missing'); return; }
                    const url = URL.createObjectURL(rec.blob);
                    const a = document.createElement('a');
                    a.href = url; a.download = r.name; document.body.appendChild(a); a.click(); a.remove();
                    setTimeout(() => URL.revokeObjectURL(url), 60 * 1000);
                  } catch (err) { console.error(err); alert('Download failed'); }
                }}>Download</a>}
              </>
            ) : <span style={{ color: 'var(--muted)' }}>—</span>}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function LenderBorrowers() {
  return (
    <DashboardLayout role="lender">
      <div className="page-header">
        <h1>Borrowers</h1>
        <p className="muted">Manage and review borrower profiles and risk</p>
      </div>

      <div className="large-cards" style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: '1rem', marginTop: '1rem' }}>
        <div className="card" style={{ padding: '1.5rem', borderRadius: 12, border: '1px solid var(--border)' }}>
          <h3>Top Risk Segments</h3>
          <p className="muted">Identify high-risk borrower groups</p>
          <div style={{ height: 120, display: 'grid', placeItems: 'center', color: 'var(--muted)' }}>Visualization placeholder</div>
        </div>
        <div className="card" style={{ padding: '1.5rem', borderRadius: 12, border: '1px solid var(--border)' }}>
          <h3>Recent Documents</h3>
          <p className="muted">Files uploaded by borrowers</p>
          <div style={{ marginTop: 12 }}><DocsList /></div>
        </div>
      </div>

      <section className="table-block" style={{ marginTop: '1.25rem' }}>
        <div className="table-header"><h3>Borrower List</h3></div>
        <table className="table">
          <thead>
            <tr><th>Borrower</th><th>Score</th><th>Active Loans</th><th>Outstanding</th></tr>
          </thead>
          <tbody>
            <tr><td>John D.</td><td>710</td><td>1</td><td>4,200</td></tr>
            <tr><td>Mia P.</td><td>680</td><td>2</td><td>11,500</td></tr>
          </tbody>
        </table>
      </section>
    </DashboardLayout>
  );
}
