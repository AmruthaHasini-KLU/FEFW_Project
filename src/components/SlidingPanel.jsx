import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function SlidingPanel({ side = 'right' }) {
  const { user, updateUser } = useAuth();
  const [open, setOpen] = useState(false);
  const [width, setWidth] = useState(340);
  const dragging = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(width);

  useEffect(() => {
    const onMove = (e) => {
      if (!dragging.current) return;
      const clientX = e.clientX ?? (e.touches && e.touches[0].clientX);
      const delta = side === 'right' ? startX.current - clientX : clientX - startX.current;
      const next = Math.max(240, Math.min(640, startWidth.current + delta));
      setWidth(next);
    };
    const onUp = () => { dragging.current = false; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove);
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
  }, [side]);

  const beginDrag = (e) => {
    dragging.current = true;
    startX.current = e.clientX ?? (e.touches && e.touches[0].clientX);
    startWidth.current = width;
  };

  const saveField = (key, value) => {
    if (!user) return;
    try {
      updateUser({ [key]: value || null });
      // optional: show some UI feedback later
    } catch (err) {
      console.error('Failed to save user field', err);
    }
  };

  const onFile = (key, e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    // for simplicity, persist filename only
    saveField(key, file.name);
  };

  if (!user) return null;

  return (
    <div className={`sliding-panel sliding-${side} ${open ? 'open' : ''}`} style={{ width: open ? width : 36 }}>
      <button className="panel-toggle" onClick={() => setOpen(!open)} aria-label="Toggle panel">
        {open ? '‹' : '›'}
      </button>

      <div className="panel-inner" style={{ display: open ? 'block' : 'none' }}>
        <div className="panel-header">
          <h4>Account</h4>
          <small className="muted">{user.email}</small>
        </div>

        <div className="panel-section">
          <h5>Personal Info</h5>
          <p><strong>{user.name}</strong></p>
          <p className="muted">Role: {user.role}</p>
        </div>

        <div className="panel-section">
          <h5>Documents</h5>
          <label className="doc-row">
            <span>Aadhar:</span>
            <input placeholder="Aadhar ID" defaultValue={user.aadhar || ''} onBlur={(e) => saveField('aadhar', e.target.value)} />
          </label>
          <label className="doc-row">
            <span>Upload Aadhar:</span>
            <input type="file" onChange={(e) => onFile('aadharFile', e)} />
          </label>
          <label className="doc-row">
            <span>PAN:</span>
            <input placeholder="PAN" defaultValue={user.pan || ''} onBlur={(e) => saveField('pan', e.target.value)} />
          </label>
          <label className="doc-row">
            <span>Upload PAN:</span>
            <input type="file" onChange={(e) => onFile('panFile', e)} />
          </label>
          {user.role === 'borrower' && (
            <>
              <label className="doc-row">
                <span>Civil Score:</span>
                <input placeholder="Enter civil score" defaultValue={user.civilScore || ''} onBlur={(e) => saveField('civilScore', e.target.value)} />
              </label>
              <label className="doc-row">
                <span>Upload Score Card:</span>
                <input type="file" onChange={(e) => onFile('civilScoreFile', e)} />
              </label>
            </>
          )}
        </div>

        <div className="panel-footer">
          <small className="muted">You can edit or upload documents here. Files are stored locally (filename only).</small>
        </div>
      </div>

      <div className="resize-handle" onMouseDown={beginDrag} onTouchStart={beginDrag} />
    </div>
  );
}
