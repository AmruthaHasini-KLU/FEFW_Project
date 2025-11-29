import React, { useEffect, useState } from 'react';

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

  const inputStyle = { width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--panel)', color: 'var(--text)' };

  return (
    <div>
      <div className="card" style={{ padding: 20, marginBottom: 16 }}>
        <h2 style={{ marginTop: 0 }}>Profile</h2>
        <p className="muted">Your personal information</p>
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
