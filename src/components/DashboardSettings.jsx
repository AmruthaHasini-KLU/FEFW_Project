import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

const STORAGE_KEY = 'fynvia_dashboard_settings_v1';

export default function DashboardSettings({ onSave, children }) {
  const [settings, setSettings] = useState({
    profile: { fullName: '', email: '' },
    notifications: { email: true, payment: true, loanStatus: true, marketing: false },
    appearance: { compactMode: false },
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSettings(JSON.parse(raw));
    } catch (e) { /* ignore */ }
  }, []);

  const save = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    if (onSave) onSave(settings);
  };

  // slightly larger inputs for settings/profile
  const inputStyle = { width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--panel)', color: 'var(--text)', height: 44 };

  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [localProfile, setLocalProfile] = useState(settings.profile);
  const [aadharPreview, setAadharPreview] = useState('');
  const [aadharFile, setAadharFile] = useState(null);

  useEffect(() => {
    // when user is present, seed profile with user data
    if (user) {
      setLocalProfile({
        fullName: user.name || '',
        email: user.email || '',
        aadhar: user.aadhar || '',
        pan: user.pan || '',
        motherName: user.motherName || '',
        fatherName: user.fatherName || '',
        guardianName: user.guardianName || '',
        guardianRelation: user.guardianRelation || '',
        guardianPhone: user.guardianPhone || '',
        phonePrimary: user.phonePrimary || '',
        phoneAlternate: user.phoneAlternate || '',
        addressLine1: user.addressLine1 || '',
        city: user.city || '',
        state: user.state || '',
        postalCode: user.postalCode || '',
        country: user.country || '',
      });
    } else {
      setLocalProfile(settings.profile);
    }
    // if user has aadharCard data or idb reference, try to set preview (async handled below)
  }, [user, settings.profile]);

  // IndexedDB helpers for storing Aadhar image (same pattern used elsewhere)
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

  // try to load preview from user.aadharCard when user changes
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!user) { setAadharPreview(''); return; }
      const card = user.aadharCard;
      if (!card) { setAadharPreview(''); return; }
      try {
        if (card.data) {
          if (mounted) setAadharPreview(card.data);
          return;
        }
        if (card.idb && card.idbKey) {
          const rec = await idbGet(card.idbKey);
          if (rec && rec.blob) {
            const url = URL.createObjectURL(rec.blob);
            if (mounted) setAadharPreview(url);
          }
        }
      } catch (err) {
        console.warn('Failed to load aadhar preview', err);
      }
    })();
    return () => { mounted = false; };
  }, [user]);

  return (
    <div>
      <div className="card" style={{ padding: 20, marginBottom: 16 }}>
        <h2 style={{ marginTop: 0 }}>Profile</h2>
        <p className="muted">Your personal information</p>
        {/* Profile: if user is logged in, show read view with Edit button, otherwise show settings-controlled inputs */}
        {user ? (
          <div>
            {!editing ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 6 }}>Full name</div>
                  <div style={{ padding: '12px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--panel)' }}>{localProfile.fullName}</div>
                </div>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 6 }}>Email</div>
                  <div style={{ padding: '12px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--panel)' }}>{localProfile.email}</div>
                </div>
                <div style={{ gridColumn: '1 / -1', marginTop: 12 }}>
                  <button className="btn btn-outline" onClick={() => setEditing(true)}>Edit Profile</button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 6 }}>Full name</div>
                  <input style={inputStyle} value={localProfile.fullName} onChange={(e) => setLocalProfile(p => ({ ...p, fullName: e.target.value }))} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 6 }}>Email</div>
                  <input style={inputStyle} value={localProfile.email} onChange={(e) => setLocalProfile(p => ({ ...p, email: e.target.value }))} />
                </div>

                {/* additional profile fields */}
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 6 }}>Aadhar number</div>
                  <input style={inputStyle} value={localProfile.aadhar || ''} onChange={(e) => setLocalProfile(p => ({ ...p, aadhar: e.target.value.replace(/\D/g,'') }))} maxLength={12} />
                  <div style={{ marginTop: 8 }}>
                    <label style={{ fontSize: 13, color: 'var(--muted)' }}>Upload Aadhar card (image, optional)</label>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 6 }}>
                      <input type="file" accept="image/*" onChange={async (e) => {
                        const f = e.target.files && e.target.files[0];
                        if (!f) return;
                        setAadharFile(f);
                        // try quick preview using dataURL for responsiveness
                        const reader = new FileReader();
                        reader.onload = () => setAadharPreview(reader.result);
                        reader.readAsDataURL(f);
                      }} />
                      {aadharPreview ? <img src={aadharPreview} alt="Aadhar preview" style={{ width: 88, height: 56, objectFit: 'cover', borderRadius: 6, border: '1px solid var(--border)' }} /> : <div style={{ width: 88, height: 56, borderRadius: 6, border: '1px dashed var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)' }}>No image</div>}
                    </div>
                  </div>
                </div>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 6 }}>PAN</div>
                  <input style={inputStyle} value={localProfile.pan || ''} onChange={(e) => setLocalProfile(p => ({ ...p, pan: e.target.value.toUpperCase() }))} maxLength={10} />
                </div>

                <div>
                  <div style={{ fontWeight: 600, marginBottom: 6 }}>Mother's name</div>
                  <input style={inputStyle} value={localProfile.motherName || ''} onChange={(e) => setLocalProfile(p => ({ ...p, motherName: e.target.value }))} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 6 }}>Father's name</div>
                  <input style={inputStyle} value={localProfile.fatherName || ''} onChange={(e) => setLocalProfile(p => ({ ...p, fatherName: e.target.value }))} />
                </div>

                <div>
                  <div style={{ fontWeight: 600, marginBottom: 6 }}>Guardian Name</div>
                  <input style={inputStyle} value={localProfile.guardianName || ''} onChange={(e) => setLocalProfile(p => ({ ...p, guardianName: e.target.value }))} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 6 }}>Guardian Relation</div>
                  <input style={inputStyle} value={localProfile.guardianRelation || ''} onChange={(e) => setLocalProfile(p => ({ ...p, guardianRelation: e.target.value }))} />
                </div>

                <div>
                  <div style={{ fontWeight: 600, marginBottom: 6 }}>Guardian Phone</div>
                  <input style={inputStyle} value={localProfile.guardianPhone || ''} onChange={(e) => setLocalProfile(p => ({ ...p, guardianPhone: e.target.value.replace(/\D/g,'') }))} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 6 }}>Phone (primary)</div>
                  <input style={inputStyle} value={localProfile.phonePrimary || ''} onChange={(e) => setLocalProfile(p => ({ ...p, phonePrimary: e.target.value.replace(/\D/g,'') }))} />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <div style={{ fontWeight: 600, marginBottom: 6 }}>Address</div>
                  <input style={{ ...inputStyle, marginBottom: 8 }} value={localProfile.addressLine1 || ''} onChange={(e) => setLocalProfile(p => ({ ...p, addressLine1: e.target.value }))} placeholder="Address line 1" />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 160px', gap: 8 }}>
                    <input style={inputStyle} value={localProfile.city || ''} onChange={(e) => setLocalProfile(p => ({ ...p, city: e.target.value }))} placeholder="City" />
                    <input style={inputStyle} value={localProfile.state || ''} onChange={(e) => setLocalProfile(p => ({ ...p, state: e.target.value }))} placeholder="State" />
                    <input style={inputStyle} value={localProfile.postalCode || ''} onChange={(e) => setLocalProfile(p => ({ ...p, postalCode: e.target.value }))} placeholder="Postal Code" />
                  </div>
                </div>

                <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 8, marginTop: 12 }}>
                  <button className="btn btn-primary" onClick={() => {
                    // save to user record
                    try {
                      (async () => {
                        let updates = { 
                          name: localProfile.fullName,
                          email: localProfile.email,
                          aadhar: localProfile.aadhar,
                          pan: localProfile.pan,
                          motherName: localProfile.motherName,
                          fatherName: localProfile.fatherName,
                          guardianName: localProfile.guardianName,
                          guardianRelation: localProfile.guardianRelation,
                          guardianPhone: localProfile.guardianPhone,
                          phonePrimary: localProfile.phonePrimary,
                          phoneAlternate: localProfile.phoneAlternate,
                          addressLine1: localProfile.addressLine1,
                          city: localProfile.city,
                          state: localProfile.state,
                          postalCode: localProfile.postalCode,
                          country: localProfile.country,
                        };
                        // if there is an uploaded aadharFile, persist it in IDB and reference it
                        if (aadharFile) {
                          const key = `${user.id}-aadhar-${Date.now()}`;
                          try {
                            // if small, store as dataURL in the aadharCard.data field
                            const lsThreshold = 900000; // ~900KB
                            if (aadharFile.size <= lsThreshold) {
                              const dataUrl = await new Promise((res, rej) => {
                                const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(aadharFile);
                              });
                              updates.aadharCard = { name: aadharFile.name, size: aadharFile.size, type: aadharFile.type, data: dataUrl, uploadedAt: Date.now() };
                            } else {
                              await idbPut(key, aadharFile);
                              updates.aadharCard = { name: aadharFile.name, size: aadharFile.size, type: aadharFile.type, idb: true, idbKey: key, uploadedAt: Date.now() };
                            }
                          } catch (err) {
                            console.warn('aadhar save fallback to idb', err);
                            try { await idbPut(key, aadharFile); updates.aadharCard = { name: aadharFile.name, size: aadharFile.size, type: aadharFile.type, idb: true, idbKey: key, uploadedAt: Date.now() }; } catch (e) { console.error('Failed to store aadhar', e); }
                          }
                        }
                        updateUser(updates);
                        setEditing(false);
                        setAadharFile(null);
                        alert('Profile updated');
                      })();
                    } catch (err) {
                      console.error('update failed', err);
                      alert('Update failed: ' + (err?.message || err));
                    }
                  }}>Save Profile</button>
                  <button className="btn btn-outline" onClick={() => { setEditing(false); setLocalProfile({ ...localProfile, fullName: user.name || '', email: user.email || '' }); }}>Cancel</button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <div style={{ fontWeight: 600, marginBottom: 6 }}>Full name</div>
                <input style={inputStyle} value={settings.profile.fullName} onChange={(e) => setSettings(s => ({ ...s, profile: { ...s.profile, fullName: e.target.value } }))} />
              </div>
              <div>
                <div style={{ fontWeight: 600, marginBottom: 6 }}>Email</div>
                <input style={inputStyle} value={settings.profile.email} onChange={(e) => setSettings(s => ({ ...s, profile: { ...s.profile, email: e.target.value } }))} />
              </div>
            </div>
            <div style={{ marginTop: 12 }}>
              <button className="btn btn-primary" onClick={save}>Save Changes</button>
            </div>
          </div>
        )}
      </div>

      <div className="card" style={{ padding: 20, marginBottom: 16 }}>
        <h2 style={{ marginTop: 0 }}>Notifications</h2>
        <p className="muted">Configure how you receive alerts</p>
        {[
          ['Email Notifications', 'Receive updates via email', 'email'],
          ['Payment Reminders', 'Get reminded before payment due dates', 'payment'],
          ['Loan Status Updates', 'Notifications when loan status changes', 'loanStatus'],
          ['Marketing Communications', 'News and promotional offers', 'marketing']
        ].map(([title, desc, key]) => (
          <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div>
              <div style={{ fontWeight: 600 }}>{title}</div>
              <div className="muted" style={{ fontSize: 13 }}>{desc}</div>
            </div>
            <input type="checkbox" checked={settings.notifications[key]} onChange={(e) => setSettings(s => ({ ...s, notifications: { ...s.notifications, [key]: e.target.checked } }))} />
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: 20, marginBottom: 16 }}>
        <h2 style={{ marginTop: 0 }}>Appearance</h2>
        <p className="muted">Customize the interface</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontWeight: 600 }}>Compact Mode</div>
          <input type="checkbox" checked={settings.appearance.compactMode} onChange={(e) => setSettings(s => ({ ...s, appearance: { compactMode: e.target.checked } }))} />
        </div>
      </div>

      {children}
    </div>
  );
}

// PropTypes removed to avoid an external dependency in this lightweight component.
