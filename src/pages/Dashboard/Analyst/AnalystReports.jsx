import React from "react";
import DashboardLayout from "@/components/DashboardLayout";

export default function AnalystReports() {
  // LoanInsights component (kept inside this module)
  function LoanInsights() {
    const mock = [
      { amount: 50000, interest: 10, term: 2, type: 'personal' },
      { amount: 150000, interest: 12, term: 5, type: 'home' },
      { amount: 250000, interest: 8, term: 15, type: 'home' },
      { amount: 60000, interest: 11, term: 3, type: 'personal' },
      { amount: 120000, interest: 13, term: 4, type: 'auto' },
      { amount: 180000, interest: 12, term: 6, type: 'home' },
      { amount: 70000, interest: 9, term: 2, type: 'personal' },
      { amount: 300000, interest: 7, term: 20, type: 'home' },
      { amount: 90000, interest: 14, term: 3, type: 'auto' },
      { amount: 110000, interest: 12, term: 5, type: 'auto' },
    ];

    const [amount, setAmount] = React.useState(100000);
    const [interest, setInterest] = React.useState(12);
    const [term, setTerm] = React.useState(5);

    const tolerance = 0.25;
    const matched = mock.filter(m => Math.abs(m.amount - amount) / amount <= tolerance || Math.abs(m.interest - interest) <= 2 || Math.abs(m.term - term) <= 2);
    const byType = matched.reduce((acc, cur) => { acc[cur.type] = (acc[cur.type] || 0) + 1; return acc; }, {});
    const types = Object.keys(byType);
    const counts = types.map(t => byType[t]);
    const max = Math.max(1, ...counts);

    return (
      <div>
        <div className="insights-form">
          <input aria-label="loan-amount" type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} />
          <input aria-label="interest" type="number" value={interest} onChange={e => setInterest(Number(e.target.value))} />
          <input aria-label="term" type="number" value={term} onChange={e => setTerm(Number(e.target.value))} />
        </div>

        <div style={{ display: 'flex', gap: 18, alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, color: 'var(--muted)' }}>Nearby matches</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)' }}>{matched.length}</div>
            <div style={{ fontSize: 13, color: 'var(--muted)' }}>Matches within ±25% amount or similar interest/term</div>
          </div>

          <div style={{ width: 240, height: 80 }}>
            <svg viewBox={`0 0 240 80`} width="240" height="80">
              {types.map((t, i) => {
                const w = 40;
                const x = i * (w + 10) + 10;
                const h = (counts[i] / max) * 60;
                return (
                  <g key={t}>
                    <rect x={x} y={70 - h} width={w} height={h} rx={6} ry={6} fill="var(--accent)" />
                    <text x={x + w / 2} y={78} textAnchor="middle" fontSize={10} fill="var(--muted)">{t}</text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout role="analyst">
      <>
        <style>{`
          /* Use CSS variables so dark mode follows global theme */
          html, body { margin: 0; padding: 0; overflow-x: hidden; overflow-y: scroll; }
          * { box-sizing: border-box; font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif; }

          .reports-header { margin-bottom: 24px; }
          .reports-header h1 { font-size: 40px; font-weight: 700; letter-spacing: -0.02em; color: var(--text); margin-bottom: 6px; }
          .reports-header p { font-size: 15px; color: var(--muted); }

          .card { background: var(--panel); border-radius: 16px; padding: 24px 26px; border: 1px solid var(--border); box-shadow: var(--shadow); }
          .card h3 { font-size: 20px; font-weight: 600; margin-bottom: 6px; color: var(--text); }
          .card .subtitle { font-size: 14px; color: var(--muted); margin-bottom: 18px; }

          .table-container { width: 100%; overflow-x: auto; }
          table { width: 100%; border-collapse: separate; border-spacing: 0; }
          thead th { font-size: 12px; text-transform: uppercase; letter-spacing: 0.06em; color: var(--muted); text-align: left; padding: 14px 16px; border-bottom: 1px solid var(--border); background: var(--surface); }
          tbody td { padding: 16px; font-size: 14px; color: var(--text); border-bottom: 1px solid var(--border); }
          tbody tr:hover { background: var(--surface); }

          .badge { padding: 6px 14px; border-radius: 999px; font-size: 12px; font-weight: 600; display: inline-block; }
          .low { background: rgba(16,185,129,0.08); color: #065f46; }
          .medium { background: rgba(249,115,22,0.08); color: #7c2d12; }
          .high { background: rgba(239,68,68,0.08); color: #7f1d1d; }
          .volume { font-weight: 600; }

          /* Loan insights controls */
          .insights-form { display:flex; gap:12px; flex-wrap:wrap; margin-bottom:12px; }
          .insights-form input, .insights-form select { padding:8px 10px; border-radius:8px; border:1px solid var(--border); background:var(--surface); color:var(--text); }
        `}</style>

        {/* Header */}
        <div className="reports-header">
          <h1>Reports Overview</h1>
          <p>Detailed reports and trend analysis</p>
        </div>

        {/* Card */}
        <div className="card">
          <h3>Monthly Performance Trends</h3>
          <p className="subtitle">Loan applications, approvals, and volume trends</p>

          <div style={{ marginBottom: 18 }}>
            <LoanInsights />
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Applications</th>
                  <th>Approvals</th>
                  <th>Approval Rate</th>
                  <th>Defaults</th>
                  <th>Volume</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Jan 2024</td>
                  <td>98</td>
                  <td>76</td>
                  <td>77.6%</td>
                  <td><span className="badge low">3</span></td>
                  <td className="volume">45.0L</td>
                </tr>
                <tr>
                  <td>Feb 2024</td>
                  <td>112</td>
                  <td>89</td>
                  <td>79.5%</td>
                  <td><span className="badge low">2</span></td>
                  <td className="volume">52.0L</td>
                </tr>
                <tr>
                  <td>Mar 2024</td>
                  <td>128</td>
                  <td>95</td>
                  <td>74.2%</td>
                  <td><span className="badge medium">4</span></td>
                  <td className="volume">61.0L</td>
                </tr>
                <tr>
                  <td>Apr 2024</td>
                  <td>145</td>
                  <td>108</td>
                  <td>74.5%</td>
                  <td><span className="badge high">5</span></td>
                  <td className="volume">73.0L</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </>
    </DashboardLayout>
  );
}