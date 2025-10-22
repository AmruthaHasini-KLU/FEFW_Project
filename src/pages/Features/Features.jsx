import React from 'react';
import WhyChoose from '@/components/WhyChoose';

export default function Features() {
  return (
    <div id="features" className="features-page" style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '3rem 1rem 0 1rem' }}>
        <WhyChoose />
      </main>
    </div>
  );
}
