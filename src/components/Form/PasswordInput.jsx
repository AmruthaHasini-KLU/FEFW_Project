import React, { useState } from 'react';

export default function PasswordInput({ id, label, value, onChange, placeholder, error, showStrength = true }) {
  const [show, setShow] = useState(false);

  const hasLength = value.length >= 8;
  const hasNumber = /[0-9]/.test(value);
  const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(value);
  const strength = hasLength && hasNumber && hasSymbol ? (value.length > 11 ? 'strong' : 'medium') : 'weak';

  return (
    <div className="form-field">
      {label && <label htmlFor={id} className="form-label">{label}</label>}
      <div className="input-with-toggle">
        <input
          id={id}
          className="form-input"
          type={show ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
        <button type="button" className="input-toggle" onClick={() => setShow((v) => !v)} aria-label="Toggle password visibility">{show ? 'Hide' : 'Show'}</button>
      </div>

      {showStrength && (
        <div className="password-hint">
          <div className="pw-rules" aria-live="polite">
            {value.length === 0 ? null : (
              <>
                {!hasLength && <div className="bad">At least 8 characters</div>}
                {!hasNumber && <div className="bad">Contains a number</div>}
                {!hasSymbol && <div className="bad">Contains a symbol</div>}
              </>
            )}
          </div>
          <div className="pw-strength">
            <div className={`pw-bar ${strength}`}></div>
          </div>
        </div>
      )}

      {error && <div className="field-error">{error}</div>}
    </div>
  );
}
