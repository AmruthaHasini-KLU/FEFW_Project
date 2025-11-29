import React from 'react';

export default function Support() {
  return (
    <div id="support" className="support-page" style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
      <main style={{ maxWidth: 900, margin: '0 auto', padding: '3rem 1rem 0 1rem' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 700, marginBottom: 8 }}>Support</h1>
        <p style={{ color: 'var(--muted)', marginBottom: 32 }}>
          Need help? Find answers, contact us, or connect with our team below.
        </p>
        <div className="support-grid">
          <div>
            <h2 className="support-brand">Fynvia</h2>
            <p className="support-muted">Making loans simple, transparent, and accessible for everyone.</p>
          </div>
          <div>
            <h3 className="support-heading">Company</h3>
            <ul className="support-links">
              <li><a href="#">About Us</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Contact</a></li>
              <li><a href="#">Blog</a></li>
            </ul>
          </div>
          <div>
            <h3 className="support-heading">Support</h3>
            <ul className="support-links">
              <li><a href="#">Help Center</a></li>
              <li><a href="#">FAQs</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h3 className="support-heading">Connect</h3>
            <ul className="support-links">
              <li><a href="#">LinkedIn</a></li>
              <li><a href="#">Twitter</a></li>
              <li><a href="#">Facebook</a></li>
              <li><a href="mailto:support@fynvia.com">support@fynvia.com</a></li>
            </ul>
            <div style={{ marginTop: 12 }}>
              <a className="btn btn-primary" href="mailto:support@fynvia.com?subject=Support%20Request">Contact Support</a>
            </div>
          </div>
        </div>
      </main>
      <footer style={{ marginTop: 48, padding: '1.5rem 0 0 0', borderTop: '1px solid var(--border)', textAlign: 'center', color: 'var(--muted)' }}>
        © {new Date().getFullYear()} Fynvia. All rights reserved.
      </footer>
    </div>
  );
}
