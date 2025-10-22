
import React from 'react';

const steps = [
  {
    num: 1,
    color: 'var(--accent)',
    title: 'Apply Online',
    desc: 'Fill out our simple application form with your details and upload required documents.'
  },
  {
    num: 2,
    color: 'var(--green)',
    title: 'Get a Decision',
    desc: 'Our advanced system processes your application quickly and provides instant feedback.'
  },
  {
    num: 3,
    color: 'var(--purple)',
    title: 'Track & Manage',
    desc: 'Use our dashboard to track payments, view history, and manage your loan easily.'
  }
];

const testimonials = [
  {
    name: 'Rajesh Sharma',
    role: 'Business Owner',
    initials: 'RS',
    color: 'var(--accent)',
    review: '"Fynvia made getting my business loan so simple. The transparency throughout the process was amazing."',
    stars: 5
  },
  {
    name: 'Priya Mehta',
    role: 'Investor',
    initials: 'PM',
    color: 'var(--green)',
    review: '"As a lender, I love how easy it is to manage my portfolio and track borrower payments."',
    stars: 5
  },
  {
    name: 'Arjun Kumar',
    role: 'Software Engineer',
    initials: 'AK',
    color: 'var(--purple)',
    review: '"The automated reminders helped me never miss a payment. Great user experience!"',
    stars: 5
  }
];

export default function HowItWorks() {
  return (
    <main id="how-it-works" className="how-page">
      <section className="intro">
        <div className="container">
          
        </div>
      </section>

  <div className="howitworks-page" style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
        <main style={{ maxWidth: 1200, margin: '0 auto', padding: '3rem 1rem 0 1rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 700, textAlign: 'center', marginBottom: 8 }}>How It Works</h1>
          <p style={{ color: 'var(--muted)', textAlign: 'center', fontSize: '1.25rem', marginBottom: 40 }}>
            Three simple steps to get your loan
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2.5rem', marginBottom: 64 }}>
            {steps.map((step) => (
              <div key={step.num} style={{ textAlign: 'center' }}>
                <div style={{ width: 80, height: 80, borderRadius: '50%', background: step.color, color: '#fff', fontWeight: 700, fontSize: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>{step.num}</div>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: 8 }}>{step.title}</h2>
                <p style={{ color: 'var(--muted)', fontSize: '1.08rem' }}>{step.desc}</p>
              </div>
            ))}
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 700, textAlign: 'center', marginBottom: 8 }}>Trusted by Thousands</h1>
          <p style={{ color: 'var(--muted)', textAlign: 'center', fontSize: '1.15rem', marginBottom: 32 }}>
            See what our customers say about us
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginBottom: 48 }}>
            {testimonials.map((t, i) => (
              <div key={i} style={{ background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 18, padding: '2rem 1.5rem', minHeight: 220 }}>
                <div style={{ marginBottom: 8 }}>
                  {Array.from({ length: t.stars }).map((_, idx) => (
                    <span key={idx} style={{ color: '#FFD600', fontSize: '1.3rem', marginRight: 2 }}>★</span>
                  ))}
                </div>
                <p style={{ color: 'var(--text)', fontSize: '1.08rem', marginBottom: 18 }}>{t.review}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: t.color, color: '#fff', fontWeight: 700, fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{t.initials}</div>
                  <div>
                    <div style={{ fontWeight: 700 }}>{t.name}</div>
                    <div style={{ color: 'var(--muted)', fontSize: '0.98rem' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </main>
  );
}
