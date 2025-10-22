import React, { useRef, useState } from 'react';
import DashboardSidebar from '@/components/DashboardSidebar';

export default function BorrowerDocuments() {
  const [docs, setDocs] = useState([
    { id: 'id', name: 'ID Proof', status: 'uploaded', fileName: 'id-proof.pdf' },
    { id: 'income', name: 'Income Proof', status: 'missing', fileName: null },
  ]);

  const fileInputRef = useRef(null);
  const [activeDocId, setActiveDocId] = useState(null);

  const handleChooseFile = (docId) => {
    setActiveDocId(docId);
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file || !activeDocId) return;
    setDocs(prev => prev.map(d => d.id === activeDocId ? { ...d, status: 'uploaded', fileName: file.name } : d));
    // reset input so same file can be chosen again if needed
    e.target.value = '';
    setActiveDocId(null);
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
                    {d.status === 'uploaded' && <button style={{ marginLeft: 8 }} className="btn btn-primary btn-sm">View</button>}
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
