import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import projectImage from '../../assets/project.png';
import Features from '@/pages/Features/Features';
import HowItWorks from '@/pages/HowItWorks/HowItWorks';
import Support from '@/pages/Support/Support';

export default function Home() {
  const location = useLocation();

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
      <img src={projectImage} alt="Project hero" className="home-hero" />
      <h1>Welcome to Fynvia</h1>
      <p>Your finance, simplified.</p>
      <Link to="/signup" className="cta">Get Started</Link>

      {/* Inline render the other pages' sections so Home can provide continuous scroll */}
      <Features />
      <HowItWorks />
      <Support />
    </div>
  );
}
