import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { loginUser, setPassword, requestReset, verifyReset, API_URL } from '@/services/auth';

// Simple IndexedDB helpers for storing large files (Aadhar)
async function idbOpen() {
  return new Promise((resolve, reject) => {
    const req = window.indexedDB.open('fynvia_files', 1);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('files')) db.createObjectStore('files', { keyPath: 'key' });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function idbPut(key, blob) {
  const db = await idbOpen();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('files', 'readwrite');
    const store = tx.objectStore('files');
    store.put({ key, blob, createdAt: Date.now() });
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    givenName: '',
    phone: '',
    altPhone: '',
    addressLines: ['', '', '', '', ''],
    email: '',
    emailVerified: false,
    aadharPreview: null,
    aadharFile: null,
  });

  useEffect(() => {
    if (!user) return;
    setForm((f) => ({
      ...f,
      name: user.name || '',
      givenName: user.givenName || '',
      phone: user.phone || '',
      altPhone: user.altPhone || '',
      addressLines: user.addressLines || ['', '', '', '', ''],
      email: user.email || '',
      emailVerified: !!user.emailVerified,
      aadharPreview: user.aadhar || null,
    }));

    // Attempt to load server-side profile and sync
    (async () => {
      if (!API_URL) return;
      try {
        const resp = await fetch(`${API_URL}/profile/${user.id}`);
        if (!resp.ok) return;
        const serverUser = await resp.json();
        // merge server fields into form and local context
        setForm((s) => ({
          ...s,
          name: serverUser.username || serverUser.name || s.name,
          givenName: serverUser.givenName || s.givenName,
          phone: serverUser.phone || s.phone,
          addressLines: serverUser.address || s.addressLines,
          emailVerified: !!serverUser.emailVerified,
          aadharPreview: serverUser.aadharDocUrl || s.aadharPreview,
        }));
        // also update local auth context to match server
        updateUser({
          name: serverUser.username || serverUser.name || user.name,
          givenName: serverUser.givenName,
          phone: serverUser.phone,
          addressLines: serverUser.address,
          aadhar: serverUser.aadharDocUrl,
          emailVerified: !!serverUser.emailVerified,
        });
      } catch (err) {
        // ignore network errors and keep local-only behavior
      }
    })();
  }, [user]);

  const onChange = (key, value) => setForm((s) => ({ ...s, [key]: value }));

  const onAddressLineChange = (idx, val) => {
    setForm((s) => {
      const lines = [...s.addressLines];
      lines[idx] = val;
      return { ...s, addressLines: lines };
    });
  };

  const handleAadharSelect = async (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    if (f.size < 200 * 1024) {
      // small, store as data URL preview
      const reader = new FileReader();
      reader.onload = () => setForm((s) => ({ ...s, aadharPreview: reader.result, aadharFile: null }));
      reader.readAsDataURL(f);
    } else {
      // store in idb and reference key
      const key = `aadhar_${user.id}_${Date.now()}`;
      setLoading(true);
      try {
        await idbPut(key, f);
        setForm((s) => ({ ...s, aadharPreview: { idb: true, idbKey: key }, aadharFile: null }));
      } catch (err) {
        console.error('IDB save failed', err);
        alert('Failed to save file locally');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSave = async () => {
    if (!user) return;
    // require at least 5 non-empty address lines
    const nonEmpty = form.addressLines.filter((l) => String(l).trim()).length;
    if (nonEmpty < 5) return alert('Please fill at least 5 address lines (house no, area, city etc.)');
    const updates = {
      name: form.name,
      givenName: form.givenName,
      phone: form.phone,
      altPhone: form.altPhone,
      addressLines: form.addressLines,
      aadhar: form.aadharPreview,
      emailVerified: !!form.emailVerified,
    };
    try {
      // attempt server update first
      if (API_URL) {
        const resp = await fetch(`${API_URL}/profile/${user.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: updates.name,
            givenName: updates.givenName,
            phone: updates.phone,
            address: updates.addressLines,
          }),
        });
        if (!resp.ok) throw new Error('Server save failed');
      }
      // update local context
      updateUser(updates);
      alert('Profile saved');
    } catch (err) {
      console.error(err);
      alert('Failed to save profile (server may be unreachable)');
    }
  };

  const handleSendVerification = async () => {
    if (!form.email) return;
    try {
      // prefer server-side verification flow if available
      if (API_URL) {
        // in a real app you'd send an OTP; here we mark verified for demo via API
        const resp = await fetch(`${API_URL}/profile/${user.id}/verify-email`, { method: 'PUT' });
        if (!resp.ok) throw new Error('Verification failed');
        updateUser({ emailVerified: true });
        setForm((s) => ({ ...s, emailVerified: true }));
        alert('Email marked as verified (server)');
        return;
      }

      const pin = requestReset(form.email);
      // demo: show PIN and prompt for entry
      alert(`Verification code (demo): ${pin}`);
      const entry = prompt('Enter verification code');
      if (!entry) return;
      const ok = verifyReset(form.email, entry);
      if (ok) {
        updateUser({ emailVerified: true });
        setForm((s) => ({ ...s, emailVerified: true }));
        alert('Email verified');
      } else {
        alert('Invalid or expired code');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to send verification code');
    }
  };

  const handleChangePassword = async () => {
    const current = prompt('Enter current password to confirm change');
    if (!current) return;
    const newPass = prompt('Enter new password');
    if (!newPass) return;
    const confirm = prompt('Confirm new password');
    if (newPass !== confirm) return alert('Passwords do not match');
    try {
      if (API_URL) {
        const resp = await fetch(`${API_URL}/profile/${user.id}/password`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ oldPassword: current, newPassword: newPass }),
        });
        if (!resp.ok) throw new Error('Password change failed');
        // update local copy
        updateUser({ password: newPass });
        alert('Password changed (server)');
        return;
      }

      // fallback to local/demo
      await loginUser({ email: form.email, password: current });
      setPassword(form.email, newPass);
      // reflect in auth context
      updateUser({ password: newPass });
      alert('Password changed');
    } catch (err) {
      console.error(err);
      alert('Password change failed: invalid current password');
    }
  };

  if (!user) return <div>Please login to access your profile.</div>;

  return (
    <div className="profile-page">
      <h2>My Profile</h2>
      <div className="card">
        <label>Username</label>
        <input value={form.name} onChange={(e) => onChange('name', e.target.value)} />

        <label>Given Name</label>
        <input value={form.givenName} onChange={(e) => onChange('givenName', e.target.value)} />

        <label>Email (read-only)</label>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input value={form.email} readOnly style={{ flex: 1 }} />
          <button className="btn" onClick={handleSendVerification} disabled={form.emailVerified}>Send verification</button>
          {form.emailVerified && <span style={{ color: 'green', marginLeft: 8 }}>Verified</span>}
        </div>

        <label>Primary Phone</label>
        <input value={form.phone} onChange={(e) => onChange('phone', e.target.value)} placeholder="+91xxxxxxxxxx" />

        <label>Alternate Phone</label>
        <input value={form.altPhone} onChange={(e) => onChange('altPhone', e.target.value)} placeholder="Optional" />

        <label>Address (5 lines)</label>
        {form.addressLines.map((line, i) => (
          <input key={i} value={line} onChange={(e) => onAddressLineChange(i, e.target.value)} placeholder={`Line ${i + 1}`} />
        ))}

        <label>Aadhar Card (upload)</label>
        <input type="file" accept="image/*,application/pdf" onChange={handleAadharSelect} />
        {form.aadharPreview && typeof form.aadharPreview === 'string' && (
          <img src={form.aadharPreview} alt="aadhar" style={{ maxWidth: 220, marginTop: 8 }} />
        )}
        {form.aadharPreview && typeof form.aadharPreview === 'object' && form.aadharPreview.idb && (
          <div style={{ marginTop: 8 }}>Stored in IndexedDB: {form.aadharPreview.idbKey}</div>
        )}

        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <button className="btn btn-primary" onClick={handleSave} disabled={loading}>Save Profile</button>
          <button className="btn" onClick={handleChangePassword}>Change Password</button>
        </div>
      </div>
    </div>
  );
}
