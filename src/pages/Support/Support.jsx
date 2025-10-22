import React from 'react';

export default function Support() {
  return (
    <div id="support" className="support-page" style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
      <main style={{ maxWidth: 900, margin: '0 auto', padding: '3rem 1rem 0 1rem' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 700, marginBottom: 8 }}>Support</h1>
        <p style={{ color: 'var(--muted)', marginBottom: 32 }}>
          Need help? Find answers, contact us, or connect with our team below.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '2.5rem', background: 'var(--panel)', borderRadius: 16, padding: '2.5rem 2rem', boxShadow: '0 2px 16px rgba(0,0,0,0.04)' }}>
          <div>
            <h2 style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '1.5rem', marginBottom: 8 }}>Fynvia</h2>
            <p style={{ color: 'var(--muted)' }}>
              Making loans simple, transparent, and accessible for everyone.
            </p>
          </div>
          <div>
            <h3 style={{ fontWeight: 700, marginBottom: 8 }}>Company</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: 'var(--text)' }}>
              <li>About Us</li>
              <li>Careers</li>
              <li>Contact</li>
              <li>Blog</li>
            </ul>
          </div>
          <div>
            <h3 style={{ fontWeight: 700, marginBottom: 8 }}>Support</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: 'var(--text)' }}>
              <li>Help Center</li>
              <li>FAQs</li>
              <li>Terms of Service</li>
              <li>Privacy Policy</li>
            </ul>
          </div>
          <div>
            <h3 style={{ fontWeight: 700, marginBottom: 8 }}>Connect</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: 'var(--text)' }}>
              <li>LinkedIn</li>
              <li>Twitter</li>
              <li>Facebook</li>
              <li>support@fynvia.com</li>
            </ul>
          </div>
        </div>
      </main>
      <footer style={{ marginTop: 48, padding: '1.5rem 0 0 0', borderTop: '1px solid var(--border)', textAlign: 'center', color: 'var(--muted)' }}>
        © {new Date().getFullYear()} Fynvia. All rights reserved.
      </footer>
    </div>
  );
}
