// AdminDashboard.jsx
import React, { useEffect, useState, useCallback } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import LineChart from '@/components/charts/LineChart';
import DoughnutChart from '@/components/charts/DoughnutChart';
import adminUsersService from '@/services/adminUsers';
import PreviewModal from '@/components/PreviewModal';

const defaultUsers = [
  { id: 'U-1001', name: 'Alice', email: 'alice@example.com', role: 'Borrower', status: 'active', joinDate: '2024-01-15' },
  { id: 'U-1002', name: 'Ben',   email: 'ben@example.com',   role: 'Lender',   status: 'active', joinDate: '2024-01-20' },
  { id: 'U-1003', name: 'Cara',  email: 'cara@example.com',  role: 'Analyst',  status: 'pending',joinDate: '2024-01-25' },
];

export default function AdminDashboard() {
  // 1. initialize users from localStorage (or default)
  const [users, setUsers] = useState(() => {
    const saved = adminUsersService.get();
    return (saved && saved.length) ? saved : defaultUsers;
  });

  // subscribe to external changes (same-tab or other tabs)
  useEffect(() => {
    const unsub = adminUsersService.subscribe((next) => setUsers(Array.isArray(next) ? next : []));
    return unsub;
  }, []);

  // persist on local changes
  useEffect(() => {
    adminUsersService.save(users);
  }, [users]);

  // form state
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', role: 'Borrower', status: 'active' });

  // add new user
  const addNewUser = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      alert('Please provide name and email');
      return;
    }
    const id = `U-${Date.now()}`; // unique-ish id
    const joinDate = new Date().toISOString().split('T')[0];
    const newUser = { id, name: form.name.trim(), email: form.email.trim(), role: form.role, status: form.status, joinDate };
    setUsers(prev => [...prev, newUser]);
    setForm({ name: '', email: '', role: 'Borrower', status: 'active' });
    setShowForm(false);
  };

  // optional delete (demo)
  const deleteUser = (id) => {
    if (!confirm('Delete user?')) return;
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  // sample charts data (unchanged)
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const userGrowth = [120,150,200,260,320,400,470,530,610,700,780,860];
  const alertBreakdown = ['Security','Payments','System','Other'];
  const alertCounts = [3,14,6,2];

  // Admin overview: load offers, applications, documents
  const [offers, setOffers] = useState(() => JSON.parse(localStorage.getItem('fynvia_offers_v1') || '[]'));
  const [applications, setApplications] = useState(() => JSON.parse(localStorage.getItem('fynvia_applications_v1') || '[]'));
  const [documents, setDocuments] = useState(() => JSON.parse(localStorage.getItem('fynvia_documents_v1') || '{}'));
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  // Preview modal state
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewSrc, setPreviewSrc] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [previewIsObjectUrl, setPreviewIsObjectUrl] = useState(false);

  // IndexedDB helpers (same pattern used in Apply.jsx)
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
    const load = () => {
      setOffers(JSON.parse(localStorage.getItem('fynvia_offers_v1') || '[]'));
      setApplications(JSON.parse(localStorage.getItem('fynvia_applications_v1') || '[]'));
      setDocuments(JSON.parse(localStorage.getItem('fynvia_documents_v1') || '{}'));
    };
    load();

    const onStorage = (e) => {
      if (!e.key) return;
      if (e.key === 'fynvia_offers_v1') setOffers(JSON.parse(e.newValue || '[]'));
      if (e.key === 'fynvia_applications_v1') setApplications(JSON.parse(e.newValue || '[]'));
      if (e.key === 'fynvia_documents_v1') setDocuments(JSON.parse(e.newValue || '{}'));
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const saveOffers = (next) => { setOffers(next); localStorage.setItem('fynvia_offers_v1', JSON.stringify(next)); };
  const saveApplications = (next) => { setApplications(next); localStorage.setItem('fynvia_applications_v1', JSON.stringify(next)); };
  const saveDocuments = (next) => { setDocuments(next); localStorage.setItem('fynvia_documents_v1', JSON.stringify(next)); };

  // admin controls
  const setOfferStatus = (offerId, status) => {
    const next = offers.map(o => o.id === offerId ? { ...o, status } : o);
    saveOffers(next);
  };

  const decideApp = (createdAt, status) => {
    const adminId = 'admin';
    const next = applications.map(a => a.createdAt === createdAt ? { ...a, status, decidedBy: adminId, decidedAt: Date.now() } : a);
    saveApplications(next);
  };

  const removeDocument = (uid, docKey) => {
    const all = { ...documents };
    if (all[uid]) { delete all[uid][docKey]; saveDocuments(all); }
  };

  // open preview (supports data URLs and IDB blob references)
  const openPreview = useCallback(async (doc) => {
    try {
      if (!doc) return;
      // if doc.data is present (data URL) open directly
      if (doc.data) {
        setPreviewTitle(doc.name || 'Preview');
        setPreviewSrc(doc.data);
        setPreviewIsObjectUrl(false);
        setPreviewOpen(true);
        return;
      }
      // if stored in IDB, fetch blob and create object URL
      if (doc.idb && doc.idbKey) {
        const rec = await idbGet(doc.idbKey);
        if (!rec || !rec.blob) throw new Error('File not found in browser file store');
        const blob = rec.blob;
        const url = URL.createObjectURL(blob);
        setPreviewTitle(doc.name || 'Preview');
        setPreviewSrc(url);
        setPreviewIsObjectUrl(true);
        setPreviewOpen(true);
        return;
      }
      alert('No preview available for this file.');
    } catch (err) {
      console.error('preview failed', err);
      alert('Preview failed: ' + (err?.message || err));
    }
  }, [idbGet]);

  const closePreview = useCallback(() => {
    setPreviewOpen(false);
    if (previewIsObjectUrl && previewSrc) {
      try { URL.revokeObjectURL(previewSrc); } catch (e) { /* ignore */ }
    }
    setPreviewSrc('');
    setPreviewTitle('');
    setPreviewIsObjectUrl(false);
  }, [previewIsObjectUrl, previewSrc]);

  return (
    <DashboardLayout role="admin">
      <section className="dashboard-content">
        <header className="admin-header header">
          <div className="header-left">
            <h1>Admin Dashboard</h1>
            <p className="muted">Overview of platform activity and management tools</p>
          </div>
        </header>

        {/* User management inline add (writes to localStorage via state effect) */}
        <section className="card table-block" style={{ padding: '1.25rem', marginTop: 12 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <input placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} style={{ padding: '6px 8px', minWidth: 220 }} />
            <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} style={{ padding: '6px 8px' }}>
              <option value="all">All roles</option>
              <option value="Borrower">Borrowers</option>
              <option value="Lender">Lenders</option>
              <option value="Analyst">Analysts</option>
              <option value="Admin">Admins</option>
            </select>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div>
              <h3>User Management</h3>
              <p className="muted">Manage user accounts and permissions</p>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn btn-primary" onClick={() => setShowForm(s => !s)}>{showForm ? 'Cancel' : 'Add New User'}</button>
            </div>
          </div>

          {showForm && (
            <form onSubmit={addNewUser} style={{ marginBottom: 12, display: 'grid', gridTemplateColumns: '1fr 1fr 160px 120px 80px', gap: 8 }}>
              <input placeholder="Full name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
              <input placeholder="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
              <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                <option>Borrower</option><option>Lender</option><option>Analyst</option><option>Admin</option>
              </select>
              <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                <option value="active">active</option><option value="pending">pending</option><option value="suspended">suspended</option>
              </select>
              <div><button className="btn btn-primary" type="submit">Save</button></div>
            </form>
          )}

          <table className="table">
            <thead>
              <tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Join Date</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {users.filter(u => {
                if (roleFilter !== 'all' && u.role !== roleFilter) return false;
                if (!search) return true;
                const s = search.toLowerCase();
                return u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s) || u.id.toLowerCase().includes(s);
              }).map(u => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td><span className="status-badge">{u.role}</span></td>
                  <td><span className={`status-badge ${u.status === 'active' ? 'approved' : 'pending'}`}>{u.status}</span></td>
                  <td>{u.joinDate}</td>
                  <td>
                    <button onClick={() => deleteUser(u.id)} className="btn btn-outline btn-sm">Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Admin overview: Offers, Applications, Documents */}
        <section style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', marginTop: 18 }}>
          <div className="card" style={{ padding: '1.25rem' }}>
            <h3>Platform Offers</h3>
            <p className="muted">All loan offers created by lenders</p>
            <div style={{ marginTop: 12 }}>
              {offers.length === 0 && <div style={{ color: 'var(--muted)' }}>No offers found.</div>}
              {offers.map(o => (
                <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 8, borderBottom: '1px dashed var(--border)' }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{o.id} • {o.term} • {o.rate}</div>
                    <div style={{ color: 'var(--muted)' }}>Amount: ₹{o.amount} • Created by: {o.createdBy || 'unknown'}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <select value={o.status} onChange={(e) => setOfferStatus(o.id, e.target.value)}>
                      <option value="available">available</option>
                      <option value="offered">offered</option>
                      <option value="accepted">accepted</option>
                      <option value="disabled">disabled</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: '1.25rem' }}>
            <h3>Applications</h3>
            <p className="muted">Borrower applications submitted — admin can review or override decisions</p>
            <div style={{ marginTop: 12 }}>
              {applications.length === 0 && <div style={{ color: 'var(--muted)' }}>No applications yet.</div>}
              {applications.map(app => (
                <div key={app.createdAt} style={{ padding: 8, borderBottom: '1px dashed var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{app.name} ({app.email})</div>
                    <div style={{ color: 'var(--muted)' }}>Offer: {app.offer?.term || app.offer?.label || app.offer} • Amount: ₹{app.amount}</div>
                    <div style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Status: {app.status || 'pending'} {app.decidedBy ? `• decided by ${app.decidedBy}` : ''}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-primary" onClick={() => decideApp(app.createdAt, 'approved')}>Approve</button>
                    <button className="btn btn-outline" onClick={() => decideApp(app.createdAt, 'rejected')}>Reject</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: '1.25rem' }}>
            <h3>Uploaded Documents</h3>
            <p className="muted">Files uploaded by users (admin can remove problematic files)</p>
              <div style={{ marginTop: 12 }}>
                {Object.keys(documents).length === 0 && <div style={{ color: 'var(--muted)' }}>No documents found.</div>}
                {Object.keys(documents).map(uid => (
                  <div key={uid} style={{ marginBottom: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontWeight: 700 }}>{uid}</div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn btn-outline btn-sm" onClick={() => { navigator.clipboard?.writeText(uid); alert('Copied ' + uid); }}>Copy ID</button>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gap: 6, marginTop: 6 }}>
                      {Object.keys(documents[uid] || {}).map(k => {
                        const d = documents[uid][k];
                        return (
                          <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 8, border: '1px solid var(--border)', borderRadius: 6 }}>
                            <div>
                              <div style={{ fontWeight: 700 }}>{d.name}</div>
                              <div style={{ color: 'var(--muted)' }}>{k} • {d.uploadedAt ? new Date(d.uploadedAt).toLocaleString() : ''} {d.size ? `• ${(d.size/1024).toFixed(1)} KB` : ''}</div>
                            </div>
                            <div style={{ display: 'flex', gap: 8 }}>
                              <button className="btn btn-primary" onClick={() => openPreview(d)}>Preview</button>
                              <button className="btn btn-outline" onClick={async () => {
                                try {
                                  // download: handle data URL or IDB blob
                                  if (d.data) {
                                    const a = document.createElement('a');
                                    a.href = d.data; a.download = d.name || 'file'; document.body.appendChild(a); a.click(); a.remove();
                                    return;
                                  }
                                  if (d.idb && d.idbKey) {
                                    const rec = await idbGet(d.idbKey);
                                    if (!rec || !rec.blob) throw new Error('File missing in browser store');
                                    const url = URL.createObjectURL(rec.blob);
                                    const a = document.createElement('a'); a.href = url; a.download = d.name || 'file'; document.body.appendChild(a); a.click(); a.remove();
                                    setTimeout(() => URL.revokeObjectURL(url), 2000);
                                    return;
                                  }
                                  alert('No downloadable data for this file');
                                } catch (err) { console.error(err); alert('Download failed: ' + (err?.message || err)); }
                              }}>Download</button>
                              <button className="btn btn-danger" onClick={() => removeDocument(uid, k)}>Remove</button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
          </div>
        </section>

        {/* Charts (unchanged) */}
        <section style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '1rem', marginTop: 18 }}>
          <div className="card" style={{ padding: '1.25rem' }}>
            <h3>User growth (monthly)</h3>
            <LineChart labels={months} data={userGrowth} label="New users" />
          </div>
          <div className="card" style={{ padding: '1.25rem' }}>
            <h3>Alert breakdown</h3>
            <DoughnutChart labels={alertBreakdown} values={alertCounts} colors={['#ef4444','#3b82f6','#f59e0b','#10b981']} />
          </div>
        </section>
      </section>

      {/* Preview modal */}
      <PreviewModal open={previewOpen} onClose={closePreview} title={previewTitle} src={previewSrc} isBlob={previewIsObjectUrl} />
    </DashboardLayout>
  );
}