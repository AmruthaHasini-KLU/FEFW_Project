import React, { useEffect, useState } from 'react';
import DashboardSidebar from '@/components/DashboardSidebar';

const STORAGE_KEY = 'fynvia:admin:settings';

export default function AdminSettings() {
  const [settings, setSettings] = useState({ siteName: 'Fynvia', allowSignups: true, notificationEmail: 'ops@fynvia.com' });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSettings(JSON.parse(raw));
    } catch (e) {
      // ignore
    }
  }, []);

  const save = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    alert('Settings saved locally');
  };

  return (
    <div className="admin-dashboard dashboard">
      <div className="dashboard-layout">
        <DashboardSidebar basePath="/dashboard/admin" role="admin" />
        <section className="dashboard-content admin-content">
          <header className="admin-header header">
            <div>
              <h1>Settings</h1>
              <p className="muted">Platform configuration and preferences</p>
            </div>
          </header>

          <div className="card" style={{ padding: '1rem' }}>
            <div style={{ display: 'grid', gap: 12 }}>
              <label className="label">Site name</label>
              <input value={settings.siteName} onChange={(e) => setSettings(s => ({ ...s, siteName: e.target.value }))} />

              <label className="label">Notification Email</label>
              <input value={settings.notificationEmail} onChange={(e) => setSettings(s => ({ ...s, notificationEmail: e.target.value }))} />

              <label className="label">Allow new user signups</label>
              <select value={settings.allowSignups ? 'yes' : 'no'} onChange={(e) => setSettings(s => ({ ...s, allowSignups: e.target.value === 'yes' }))}>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn btn-primary" onClick={save}>Save settings</button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
