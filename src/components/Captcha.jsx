import React, { useEffect, useState } from 'react';

export default function Captcha({ onChange }) {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const [op, setOp] = useState('+');
  const [input, setInput] = useState('');
  const [valid, setValid] = useState(false);

  const gen = () => {
    const na = Math.floor(Math.random() * 12) + 1;
    const nb = Math.floor(Math.random() * 12) + 1;
    setA(na);
    setB(nb);
    setOp('+');
    setInput('');
    setValid(false);
  };

  useEffect(() => { gen(); }, []);

  useEffect(() => {
    if (typeof onChange === 'function') onChange(valid);
  }, [valid, onChange]);

  const check = (val) => {
    const n = Number(String(val).trim());
    const expected = op === '+' ? a + b : a - b;
    const ok = !Number.isNaN(n) && n === expected;
    setValid(ok);
  };

  return (
    <div className="captcha-box" style={{ marginTop: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ fontWeight: 600 }}>{a} {op} {b} =</div>
        <input
          value={input}
          onChange={(e) => { setInput(e.target.value); check(e.target.value); }}
          placeholder="Answer"
          style={{ width: 100 }}
        />
        <button type="button" className="btn btn-outline" onClick={gen} style={{ padding: '6px 8px' }}>Refresh</button>
      </div>
      <div style={{ fontSize: 12, color: valid ? 'var(--accent)' : 'var(--muted)', marginTop: 6 }}>
        {valid ? 'Captcha solved' : 'Please solve the captcha to continue'}
      </div>
    </div>
  );
}
