import React, { useRef, useState, useEffect } from 'react';
import DashboardSidebar from '@/components/DashboardSidebar';
import { useAuth } from '@/context/AuthContext';

const DOC_TYPES = [
  { id: 'id', name: 'ID Proof' },
  { id: 'income', name: 'Income Proof' },
  { id: 'business', name: 'Business Proof' },
];

export default function BorrowerDocuments() {
  const { user } = useAuth();
  const [docs, setDocs] = useState([]);
  const fileInputRef = useRef(null);
  const [activeDocId, setActiveDocId] = useState(null);

  useEffect(() => {
    loadDocs();
  }, [user]);

  // IndexedDB helper to read blob records when files are stored in IDB
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

  const loadDocs = () => {
    const all = JSON.parse(localStorage.getItem('fynvia_documents_v1') || '{}');
    const uid = user?.id || 'guest';
    const userDocs = all[uid] || {};
    const rows = DOC_TYPES.map(t => ({ id: t.id, name: t.name, status: userDocs[t.id] ? 'uploaded' : 'missing', fileName: userDocs[t.id]?.name || null }));
    setDocs(rows);
  };

  const fileToDataUrl = (file) => new Promise((res, rej) => {
    if (!file) return res(null);
    const reader = new FileReader();
    reader.onload = () => res(reader.result);
    reader.onerror = (e) => rej(e);
    reader.readAsDataURL(file);
  });

  const handleChooseFile = (docId) => {
    setActiveDocId(docId);
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !activeDocId) return;
    try {
      const dataUrl = await fileToDataUrl(file);
      const docsKey = 'fynvia_documents_v1';
      const all = JSON.parse(localStorage.getItem(docsKey) || '{}');
      const uid = user?.id || 'guest';
      all[uid] = all[uid] || {};
      all[uid][activeDocId] = { name: file.name, size: file.size, type: file.type, data: dataUrl, uploadedAt: Date.now() };
      localStorage.setItem(docsKey, JSON.stringify(all));
      // update UI
      setDocs(prev => prev.map(d => d.id === activeDocId ? { ...d, status: 'uploaded', fileName: file.name } : d));
    } catch (err) {
      console.error('upload failed', err);
      alert('Upload failed: ' + (err?.message || err));
    } finally {
      e.target.value = '';
      setActiveDocId(null);
    }
  };

  const handleView = (doc) => {
    if (!doc) { alert('Document not found'); return; }
    try {
      // If doc is stored in IndexedDB, retrieve blob and open as object URL
      if (doc.idb && doc.idbKey) {
        idbGet(doc.idbKey).then(rec => {
          if (!rec || !rec.blob) { alert('Document missing from storage'); return; }
          const url = URL.createObjectURL(rec.blob);
          const w = window.open();
          if (w) {
            w.document.open();
            w.document.write(`<!doctype html><title>${doc.name}</title><meta charset="utf-8"><body style="margin:0"><iframe src="${url}" style="border:0;width:100vw;height:100vh"></iframe></body>`);
            w.document.close();
            // revoke after 1 minute
            setTimeout(() => URL.revokeObjectURL(url), 60 * 1000);
          } else {
            window.open(url, '_blank', 'noopener');
          }
        }).catch(e => { console.error(e); alert('Failed to read file from storage'); });
        return;
      }

      if (!doc.data) { alert('Document data not available'); return; }
      const w = window.open();
      if (w) {
        w.document.open();
        w.document.write(`<!doctype html><title>${doc.name}</title><meta charset="utf-8"><body style="margin:0"><iframe src="${doc.data}" style="border:0;width:100vw;height:100vh"></iframe></body>`);
        w.document.close();
      } else {
        window.open(doc.data, '_blank', 'noopener');
      }
    } catch (err) {
      window.open(doc.data || '', '_blank', 'noopener');
    }
  };

  return (
    <div className="borrower-dashboard dashboard">
      <div className="dashboard-layout">
        <DashboardSidebar basePath="/dashboard/borrower" role="borrower" />
        <section className="dashboard-content borrower-content">
          <header className="borrower-header header"><h1>Documents</h1><p className="muted">Upload or view your documents</p></header>
          <div className="card">
            <input ref={fileInputRef} type="file" style={{ display: 'none' }} onChange={handleFileChange} />
            <div className="doc-row">
              {docs.map(d => (
                <div key={d.id} className="doc-box">
                  <div className="doc-title">{d.name}</div>
                  <div className="muted">{d.status}{d.fileName ? ` — ${d.fileName}` : ''}</div>
                  <div style={{ marginTop: 8 }}>
                    <button className="btn btn-outline btn-sm" onClick={() => handleChooseFile(d.id)}>{d.status === 'uploaded' ? 'Replace' : 'Upload'}</button>
                    {d.status === 'uploaded' && (
                      <>
                        <button style={{ marginLeft: 8 }} className="btn btn-primary btn-sm" onClick={() => {
                          const all = JSON.parse(localStorage.getItem('fynvia_documents_v1') || '{}');
                          const uid = user?.id || 'guest';
                          const doc = (all[uid] && all[uid][d.id]) || null;
                          handleView(doc);
                        }}>View</button>
                        <a style={{ marginLeft: 8 }} className="btn btn-outline btn-sm" href={(() => {
                          const all = JSON.parse(localStorage.getItem('fynvia_documents_v1') || '{}');
                          const uid = user?.id || 'guest';
                          return (all[uid] && all[uid][d.id] && all[uid][d.id].data) || '#';
                        })()} target="_blank" rel="noopener noreferrer" download={d.fileName}>Download</a>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
