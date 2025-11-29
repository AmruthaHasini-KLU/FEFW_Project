
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
        <div className="container" />
      </section>

      <div className="howitworks-page" style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
        <main style={{ maxWidth: 1200, margin: '0 auto', padding: '3rem 1rem 0 1rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 700, textAlign: 'center', marginBottom: 8 }}>How It Works</h1>
          <p style={{ color: 'var(--muted)', textAlign: 'center', fontSize: '1.25rem', marginBottom: 40 }}>
            Three simple steps to get your loan
          </p>

          <div className="how-steps" style={{ marginBottom: 32 }}>
            {steps.map((step) => (
              <div key={step.num} className="how-step" tabIndex={0} aria-label={`${step.title} — step ${step.num}`}>
                <div className="how-step-circle" style={{ background: step.color }}>{step.num}</div>
                <h3 className="how-step-title">{step.title}</h3>
                <p className="how-step-desc">{step.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <a className="btn btn-primary" href="/dashboard/borrower/apply">Start Application</a>
          </div>

          <h1 style={{ fontSize: '2.2rem', fontWeight: 700, textAlign: 'center', marginBottom: 8 }}>Trusted by Thousands</h1>
          <p style={{ color: 'var(--muted)', textAlign: 'center', fontSize: '1.15rem', marginBottom: 32 }}>
            See what our customers say about us
          </p>

          <div className="testimonials" style={{ marginBottom: 48 }}>
            {testimonials.map((t, i) => (
              <article key={i} className="testimonial-card">
                <div className="testimonial-stars">
                  {Array.from({ length: t.stars }).map((_, idx) => (
                    <span key={idx}>★</span>
                  ))}
                </div>
                <p className="testimonial-text">{t.review}</p>
                <div className="testimonial-by">
                  <div className="testimonial-avatar" style={{ background: t.color }}>{t.initials}</div>
                  <div>
                    <div className="testimonial-name">{t.name}</div>
                    <div className="testimonial-role">{t.role}</div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </main>
      </div>
    </main>
  );
}
