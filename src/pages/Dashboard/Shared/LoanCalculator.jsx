import React, { useState, useMemo } from 'react';
import Input from '@/components/Form/Input';
import DashboardLayout from '@/components/DashboardLayout';

function calcMonthlyPayment(principal, annualRatePct, termMonths) {
  const r = annualRatePct / 100 / 12; // monthly rate
  if (r === 0) return principal / termMonths;
  const numerator = r * Math.pow(1 + r, termMonths);
  const denom = Math.pow(1 + r, termMonths) - 1;
  return principal * (numerator / denom);
}

function formatCurrency(n) {
  return n == null ? '-' : n.toLocaleString(undefined, { maximumFractionDigits: 0 });
}

export default function LoanCalculator({ role = 'borrower' }) {
  const [principal, setPrincipal] = useState(500000);
  const [annualRate, setAnnualRate] = useState(12);
  const [termYears, setTermYears] = useState(5);
  const [extraMonthly, setExtraMonthly] = useState(0);

  const termMonths = Math.max(1, Math.round(termYears * 12));

  const monthlyPayment = useMemo(() => calcMonthlyPayment(principal, annualRate, termMonths), [principal, annualRate, termMonths]);

  const monthlyWithExtra = monthlyPayment + Number(extraMonthly || 0);

  const totalPayment = monthlyWithExtra * termMonths;
  const totalInterest = totalPayment - principal;

  // Simple future projection: produce next 12 months outstanding balance estimates
  const projection = useMemo(() => {
    const rows = [];
    let balance = principal;
    const r = annualRate / 100 / 12;
    for (let i = 0; i < 12; i++) {
      const interest = balance * r;
      const principalPaid = monthlyWithExtra - interest;
      balance = Math.max(0, balance - principalPaid);
      rows.push({ month: i + 1, balance: Math.round(balance), interest: Math.round(interest) });
      if (balance <= 0) break;
    }
    return rows;
  }, [principal, annualRate, monthlyWithExtra]);

  // Fake AI prediction: extrapolate small improvement in interest rate and project impact
  const aiPrediction = useMemo(() => {
    // simulate an AI suggestion: if user pays 10% extra, show faster payoff
    const extra = monthlyWithExtra * 0.1;
    const r = annualRate / 100 / 12;
    let balance = principal;
    let months = 0;
    while (balance > 0 && months < 600) {
      const interest = balance * r;
      const paid = monthlyWithExtra + extra;
      balance = Math.max(0, balance + interest - paid);
      months += 1;
    }
    return { suggestedExtra: Math.round(extra), payoffMonths: months };
  }, [principal, annualRate, monthlyWithExtra]);

  return (
    <DashboardLayout role={role}>
      <div style={{ padding: 8 }}>
        <header className="page-header">
          <h1>Loan Calculator</h1>
          <p className="muted">Calculate monthly payments, total interest and a short projection. Shared across dashboards.</p>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 16, marginTop: 12 }}>
          <div className="card" style={{ padding: 16 }}>
            <div style={{ display: 'grid', gap: 10 }}>
              <Input label="Loan amount (principal)" type="number" value={principal} onChange={e => setPrincipal(Number(e.target.value || 0))} />

              <Input label="Annual interest rate (%)" type="number" step="0.01" value={annualRate} onChange={e => setAnnualRate(Number(e.target.value || 0))} />

              <Input label="Term (years)" type="number" step="0.5" value={termYears} onChange={e => setTermYears(Number(e.target.value || 0))} />

              <Input label="Extra monthly payment (optional)" type="number" value={extraMonthly} onChange={e => setExtraMonthly(Number(e.target.value || 0))} />

              <hr />

              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                <div>
                  <div className="muted">Monthly payment</div>
                  <div style={{ fontSize: 20, fontWeight: 700 }}>{formatCurrency(Math.round(monthlyPayment))}</div>
                </div>
                <div>
                  <div className="muted">With extra</div>
                  <div style={{ fontSize: 20, fontWeight: 700 }}>{formatCurrency(Math.round(monthlyWithExtra))}</div>
                </div>
              </div>

              <div style={{ marginTop: 8 }}>
                <div className="muted">Total payment (all months)</div>
                <div>{formatCurrency(Math.round(totalPayment))}</div>
                <div className="muted">Total interest paid</div>
                <div>{formatCurrency(Math.round(totalInterest))}</div>
              </div>
            </div>
          </div>

          <aside className="card" style={{ padding: 16 }}>
            <h3>Projection (12 months)</h3>
            <div style={{ display: 'grid', gap: 6 }}>
              {projection.map(p => (
                <div key={p.month} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>Month {p.month}</div>
                  <div>Bal: {formatCurrency(p.balance)}</div>
                </div>
              ))}
            </div>

            <hr style={{ margin: '12px 0' }} />
            <h4>AI suggestion (simulated)</h4>
            <p className="muted">Small simulated suggestion showing effect of paying ~10% extra.</p>
            <div>Suggested extra: {formatCurrency(aiPrediction.suggestedExtra)}</div>
            <div>Estimated payoff months (with suggestion): {aiPrediction.payoffMonths}</div>
          </aside>
        </div>
      </div>
    </DashboardLayout>
  );
}
