import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';
import AuthLayout from '@/components/AuthLayout';
import CustomSelect from '@/components/CustomSelect';
import { roleDashboardPath } from '@/utils/helpers';

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [role, setRole] = useState('borrower');
  const [aadhar, setAadhar] = useState('');
  const [pan, setPan] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    // Basic client-side validations
    const errs = {};
    const nameTrim = String(name || '').trim();
    if (!/^[A-Za-z\s]+$/.test(nameTrim)) errs.name = 'Name must contain only letters and spaces.';
    if (!password) errs.password = 'Password is required.';
    if (password !== confirmPassword) errs.confirmPassword = 'Passwords do not match.';
    if (aadhar) {
      if (!/^\d{12}$/.test(aadhar)) errs.aadhar = 'Aadhar must be 12 digits.';
    }
    if (pan) {
      if (!/^[A-Za-z]{5}\d{4}[A-Za-z]$/.test(pan)) errs.pan = 'PAN must be in format ABCDE1234F.';
    }
    if (Object.keys(errs).length) {
      setFieldErrors(errs);
      return;
    }
    if (!name || !email || !password || !role) {
      setError('All fields are required.');
      return;
    }
    if (password !== confirmPassword) {
      setFieldErrors((s) => ({ ...s, confirmPassword: 'Passwords do not match.' }));
      return;
    }
    if (role === 'borrower') {
      // At least one of Aadhar or PAN must be provided or user can upload later
      if (!aadhar && !pan) {
        setError('Borrowers must provide Aadhar ID or PAN (you can upload the other later).');
        return;
      }
    }
    try {
      setLoading(true);
      // Await signup so storage/context are updated before navigation
      const u = await signup({ name: name.trim(), email, password, role, aadhar: aadhar || null, pan: pan || null });
      const userRole = (u && u.role) || role;
      navigate(roleDashboardPath(userRole));
    } catch (err) {
      setError(err?.message || 'Failed to create account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Create your account">
      {error && <div className="auth-error">{error}</div>}
      <form onSubmit={onSubmit}>
        <input
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {fieldErrors.name && <div className="auth-error" style={{ marginTop: 6 }}>{fieldErrors.name}</div>}
        <input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {fieldErrors.email && <div className="auth-error" style={{ marginTop: 6 }}>{fieldErrors.email}</div>}
        <div className="input-with-toggle">
          <input
            placeholder="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (fieldErrors.confirmPassword) setFieldErrors((s) => ({ ...s, confirmPassword: null }));
            }}
          />
          <button type="button" className="input-toggle" onClick={() => setShowPassword((v) => !v)} aria-label="Toggle password visibility">{showPassword ? 'Hide' : 'Show'}</button>
        </div>
        {fieldErrors.password && <div className="auth-error" style={{ marginTop: 6 }}>{fieldErrors.password}</div>}
        <div className="password-hint">
          {/* Show only unmet rules while typing to avoid noise */}
          <div className="pw-rules" aria-live="polite">
            {password.length < 8 && <div className="bad">At least 8 characters</div>}
            {!/[0-9]/.test(password) && password.length > 0 && <div className="bad">Contains a number</div>}
            {!/[!@#$%^&*(),.?":{}|<>]/.test(password) && password.length > 0 && <div className="bad">Contains a symbol</div>}
          </div>
          <div className="pw-strength">
            <div className={`pw-bar ${password.length >= 8 && /[0-9]/.test(password) && /[!@#$%^&*(),.?":{}|<>]/.test(password) ? (password.length>11? 'strong':'medium') : 'weak'}`}></div>
            <small className="muted">Your password is encrypted and never shared.</small>
          </div>
        </div>
        <div className="input-with-toggle">
          <input
            placeholder="Confirm password"
            type={showConfirm ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (fieldErrors.confirmPassword) setFieldErrors((s) => ({ ...s, confirmPassword: null }));
            }}
          />
          <button type="button" className="input-toggle" onClick={() => setShowConfirm((v) => !v)} aria-label="Toggle confirm password visibility">{showConfirm ? 'Hide' : 'Show'}</button>
        </div>
        {fieldErrors.confirmPassword && <div className="auth-error" style={{ marginTop: 6 }}>{fieldErrors.confirmPassword}</div>}
        <CustomSelect
          value={role}
          onChange={(v) => setRole(v)}
          options={[
            { value: 'borrower', label: 'Borrower' },
            { value: 'lender', label: 'Lender' },
            { value: 'analyst', label: 'Analyst' },
            { value: 'admin', label: 'Admin' },
          ]}
        />
        {role === 'borrower' && (
          <div className="borrower-docs">
            <input
              placeholder="Aadhar ID (optional)"
              value={aadhar}
              onChange={(e) => setAadhar(e.target.value.replace(/\D/g, ''))}
              maxLength={12}
            />
            <input
              placeholder="PAN (optional)"
              value={pan}
              onChange={(e) => setPan(e.target.value.toUpperCase())}
              maxLength={10}
              style={{ textTransform: 'uppercase' }}
            />
            {fieldErrors.aadhar && <div className="auth-error" style={{ marginTop: 6 }}>{fieldErrors.aadhar}</div>}
            {fieldErrors.pan && <div className="auth-error" style={{ marginTop: 6 }}>{fieldErrors.pan}</div>}
            <small className="muted">Provide at least one of Aadhar or PAN. You can upload documents later from your dashboard.</small>
          </div>
        )}
        <button type="submit" disabled={loading}>{loading ? 'Creating…' : 'Create account'}</button>
        <div style={{ marginTop: 12, textAlign: 'center' }}>
          <small className="muted">Already have an account? <Link to="/login">Login</Link></small>
        </div>
      </form>
    </AuthLayout>
  );
}
