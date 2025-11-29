import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import projectImage from '../../assets/fynvia-hero.svg';
import Features from '@/pages/Features/Features';
import HowItWorks from '@/pages/HowItWorks/HowItWorks';
import Support from '@/pages/Support/Support';

export default function Home() {
  const location = useLocation();
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('fynvia_theme') || document.documentElement.dataset.theme || 'light';
    } catch (e) { return 'light'; }
  });

  useEffect(() => {
    try { document.documentElement.dataset.theme = theme; localStorage.setItem('fynvia_theme', theme); } catch (e) {}
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');

  useEffect(() => {
    // if navigated with a hash (e.g. /#features) scroll to it
    if (location.hash) {
      const id = location.hash.replace('#', '');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 80);
    }
  }, [location]);

  return (
    <div className="home-page">
      <div className="hero-card">
        <img src={projectImage} alt="Fynvia hero" className="home-hero" />
        <div className="hero-overlay">
          <div className="hero-content">
            <div className="hero-left">
              <h1>Manage your loans with ease</h1>
              <p className="muted">Powerful dashboards, transparent offers, and timely reminders.</p>
              <div style={{ marginTop: 18 }}>
                <Link to="/signup" className="cta">Get Started</Link>
              </div>
            </div>
            <div className="hero-visual" aria-hidden>
              {/* decorative area — svg already contains illustration */}
            </div>
          </div>
        </div>
      </div>

      {/* feature cards — below hero, matching sample layout */}
      <section className="feature-cards" id="features">
        <div className="feature-card">
          <h3>Home Features</h3>
          <ul>
            <li>📊 Dashboard overview</li>
            <li>📝 Application tracking</li>
            <li>⏰ Payment reminders</li>
          </ul>
        </div>
        <div className="feature-card">
          <h3>How It Works</h3>
          <ol>
            <li><strong>1.</strong> Apply online</li>
            <li><strong>2.</strong> Approval</li>
            <li><strong>3.</strong> Repay & track</li>
          </ol>
        </div>
        <div className="feature-card">
          <h3>Support</h3>
          <ul>
            <li>💬 Live chat</li>
            <li>❓ FAQ database</li>
            <li>📞 Contact us</li>
          </ul>
        </div>
      </section>

      {/* Inline render the other pages' sections so Home can provide continuous scroll */}
      <HowItWorks />
      <Support />
    </div>
  );
}
