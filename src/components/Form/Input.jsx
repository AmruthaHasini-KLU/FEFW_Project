import React from 'react';

export default function Input({ id, label, value, onChange, placeholder, type = 'text', error, className = '', ...rest }) {
  return (
    <div className={`form-field ${className}`}>
      {label && <label htmlFor={id} className="form-label">{label}{rest.required ? ' *' : ''}</label>}
      <input
        id={id}
        className="form-input"
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        {...rest}
      />
      {error && <div className="field-error">{error}</div>}
    </div>
  );
}
