import React, { useState, useRef, useEffect } from 'react';

export default function CustomSelect({ id, options = [], value, onChange, className = '' }) {
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const ref = useRef(null);

  const selected = options.find((o) => o.value === value) || options[0] || null;

  useEffect(() => {
    function onDoc(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  useEffect(() => setHighlight(options.findIndex((o) => o.value === value)), [value, options]);

  function toggle() {
    setOpen((v) => !v);
  }

  function handleKey(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
      setHighlight((h) => Math.min(h + 1, options.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setOpen(true);
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (open && highlight >= 0) {
        const opt = options[highlight];
        if (opt) onChange(opt.value);
        setOpen(false);
      } else {
        setOpen(true);
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  }

  return (
    <div className={`custom-select ${className}`} ref={ref} id={id}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={toggle}
        onKeyDown={handleKey}
        className="custom-select-button"
      >
        <span className="custom-select-value">{selected ? selected.label : 'Select'}</span>
        <span className="custom-select-caret">▾</span>
      </button>
      {open && (
        <ul role="listbox" tabIndex={-1} className="custom-select-menu">
          {options.map((opt, idx) => (
            <li
              key={opt.value}
              role="option"
              aria-selected={opt.value === value}
              className={`custom-select-item ${idx === highlight ? 'highlight' : ''}`}
              onMouseEnter={() => setHighlight(idx)}
              onClick={() => { onChange(opt.value); setOpen(false); }}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
