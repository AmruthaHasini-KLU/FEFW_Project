import React from 'react';
import { Link } from 'react-router-dom';
import projectImage from '../../assets/project.png';

export default function Home() {
  return (
    <div className="home-page">
      <img src={projectImage} alt="Project hero" className="home-hero" />
      <h1>Welcome to Fynvia</h1>
      <p>Your finance, simplified.</p>
      <Link to="/signup" className="cta">Get Started</Link>

      <nav style={{ marginTop: 24, display: 'flex', gap: 12, justifyContent: 'center' }}>
        <Link to="/features" style={{ color: 'var(--accent)', fontWeight: 600 }}>Features</Link>
        <Link to="/how-it-works" style={{ color: 'var(--accent)', fontWeight: 600 }}>How it works</Link>
        <Link to="/support" style={{ color: 'var(--accent)', fontWeight: 600 }}>Support</Link>
      </nav>

      {/* WhyChoose moved to HowItWorks page; anchors above allow scrolling when on Home */}
    </div>
  );
}
