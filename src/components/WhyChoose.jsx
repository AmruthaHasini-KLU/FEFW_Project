import React from 'react';

const features = [
  {
    id: 1,
    colorVar: '--green',
    title: 'Effortless Application',
    desc: 'Submit loan requests in minutes with an intuitive form and smart defaults.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="11" stroke="none" fill="currentColor" />
        <path d="M6 12.5l3 3 8-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 2,
    colorVar: '--info',
    title: 'Automated Reminders',
    desc: 'Never miss a payment — automated reminders and alerts keep you on track.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="9" stroke="none" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: 3,
    colorVar: '--purple',
    title: 'Clear Dashboard',
    desc: 'Visualize loans, repayments, and performance with clean charts.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="4" width="16" height="16" rx="2" stroke="none" fill="currentColor" />
        <path d="M7 15V11M11 15V9M15 15v-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 4,
    colorVar: '--orange',
    title: 'Full Transparency',
    desc: 'Detailed logs and audit trails so you always know what happened and why.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 5C7 5 3.7 8.2 2 12c1.7 3.8 5 7 10 7s8.3-3.2 10-7c-1.7-3.8-5-7-10-7z" fill="currentColor" />
        <circle cx="12" cy="12" r="3" fill="currentColor" />
      </svg>
    ),
  },
];

export default function WhyChoose() {
  return (
    <section className="why-choose">
      <div className="container">
        <h1 className="why-title">Why Choose Fynvia?</h1>
        <p style={{ color: 'var(--muted)', textAlign: 'center', fontSize: '1.25rem', marginBottom: 32 }}>
                  Experience loan management like never before
                </p>

        <div className="cards">
          {features.map((f) => (
            <div key={f.id} className="card">
              <div className="icon" style={{ backgroundColor: `var(${f.colorVar})` }} aria-hidden>
                {f.icon}
              </div>
              <h3 className="card-title">{f.title}</h3>
              <p className="card-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
