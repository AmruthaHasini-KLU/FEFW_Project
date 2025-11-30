import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';
import AuthLayout from '@/components/AuthLayout';
import CustomSelect from '@/components/CustomSelect';
import Input from '@/components/Form/Input';
import PasswordInput from '@/components/Form/PasswordInput';
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
    if ((nameTrim || '').length < 10) errs.name = 'Name must be at least 10 characters.';
    if (!password) errs.password = 'Password is required.';
    // Password strength: min 8 chars, uppercase, lowercase, number
    const pwd = String(password || '');
    const pwdErrs = [];
    if (pwd.length < 8) pwdErrs.push('at least 8 characters');
    if (!/[a-z]/.test(pwd)) pwdErrs.push('a lowercase letter');
    if (!/[A-Z]/.test(pwd)) pwdErrs.push('an uppercase letter');
    if (!/\d/.test(pwd)) pwdErrs.push('a number');
    if (pwdErrs.length) errs.password = `Password must contain ${pwdErrs.join(', ')}.`;
    if (password !== confirmPassword) errs.confirmPassword = 'Passwords do not match.';
    // Email must include @ and end with .com or .in
    const emailTrim = String(email || '').trim();
    if (!/^[^\s@]+@[^\s@]+\.(com|in)$/i.test(emailTrim)) errs.email = 'Email must be valid and end with .com or .in.';
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

  // Live validation flags for inline criteria display
  const nameTrim = String(name || '').trim();
  const nameLettersOnly = /^[A-Za-z\s]+$/.test(nameTrim) && nameTrim.length > 0;
  const nameMinLen = nameTrim.length >= 10;
  // require '@' and top-level domain .com or .in
  const emailValid = /^[^\s@]+@[^\s@]+\.(com|in)$/i.test(String(email || ''));

  return (
    <AuthLayout title="Create your account">
      {error && <div className="auth-error">{error}</div>}
      <form onSubmit={onSubmit}>
        <Input
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={fieldErrors.name}
        />
        {/* name criteria: hide when satisfied */}
        {nameTrim.length > 0 && !(nameLettersOnly && nameMinLen) && (
          <div className="pw-rules" style={{ marginTop: -6, marginBottom: 8 }}>
            <div className={nameLettersOnly ? 'good' : 'bad'}>Only letters and spaces</div>
            <div className={nameMinLen ? 'good' : 'bad'}>At least 10 characters</div>
          </div>
        )}
        <Input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={fieldErrors.email}
        />
        {email.length > 0 && !emailValid && (
          <div className="pw-rules" style={{ marginTop: -6, marginBottom: 8 }}>
            <div className={'bad'}>Email must contain '@' and end with .com or .in</div>
          </div>
        )}
        <PasswordInput
          id="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={fieldErrors.password}
        />
        <PasswordInput
          id="confirmPassword"
          label="Confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={fieldErrors.confirmPassword}
          showStrength={false}
        />
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
