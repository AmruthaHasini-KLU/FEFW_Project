import React, { useEffect } from 'react';

export default function PreviewModal({ open, onClose, title, src, isBlob }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal-backdrop" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1200 }}>
      <div className="modal-card" style={{ width: '90%', maxWidth: 1000, maxHeight: '90%', background: 'var(--bg)', borderRadius: 8, overflow: 'hidden', boxShadow: '0 8px 30px rgba(0,0,0,0.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontWeight: 700 }}>{title}</div>
          <div>
            <button className="btn btn-outline btn-sm" onClick={onClose}>Close</button>
          </div>
        </div>
        <div style={{ height: '80vh', background: '#fff' }}>
          {/* Use iframe for data: URLs and object URLs. */}
          <iframe title={title} src={src} style={{ width: '100%', height: '100%', border: 0 }} />
        </div>
      </div>
    </div>
  );
}
