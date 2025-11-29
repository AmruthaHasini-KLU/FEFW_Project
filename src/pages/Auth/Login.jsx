import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import AuthLayout from '@/components/AuthLayout';
import { roleDashboardPath } from '@/utils/helpers';
import { requestReset, verifyReset, setPassword } from '@/services/auth';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetMethod, setResetMethod] = useState('email');
  const [resetTarget, setResetTarget] = useState('');
  const [pin, setPin] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetStep, setResetStep] = useState(0); // 0 = request, 1 = verify

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please fill in both fields.');
      return;
    }
    try {
      setLoading(true);
      // await login so storage/context are updated before navigation
      const u = await login({ email, password });
      const userRole = (u && u.role) || JSON.parse(localStorage.getItem('fynvia_current_user_v1'))?.role || 'borrower';
      navigate(roleDashboardPath(userRole));
    } catch (err) {
      setError('Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome back">
      {error && <div className="auth-error">{error}</div>}
      <form onSubmit={onSubmit}>
        <input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" disabled={loading}>{loading ? 'Logging in…' : 'Login'}</button>
        <div style={{ marginTop: 8 }}>
          <button type="button" className="link-btn" onClick={() => setShowReset(true)}>Forgot password?</button>
        </div>
      </form>

      {showReset && (
        <div className="reset-box">
          <h4>Reset password</h4>
          {resetStep === 0 ? (
            <>
              <div>
                <label><input type="radio" checked={resetMethod==='email'} onChange={() => setResetMethod('email')} /> Email</label>
                <label style={{ marginLeft: 8 }}><input type="radio" checked={resetMethod==='mobile'} onChange={() => setResetMethod('mobile')} /> Mobile</label>
              </div>
              <input placeholder={resetMethod === 'email' ? 'Email address' : 'Mobile number'} value={resetTarget} onChange={(e) => setResetTarget(e.target.value)} />
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-outline" onClick={async () => {
                  try {
                    const pinVal = requestReset(resetTarget);
                    // show the pin so user can continue (dev-only)
                    alert(`Reset PIN (dev): ${pinVal}`);
                    setResetStep(1);
                  } catch (err) {
                    alert(err?.message || 'Failed to request reset');
                  }
                }}>Request PIN</button>
                <button className="btn" onClick={() => setShowReset(false)}>Close</button>
              </div>
            </>
          ) : (
            <>
              <input placeholder="Enter PIN" value={pin} onChange={(e) => setPin(e.target.value)} />
              <input placeholder="New password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
              <div style={{ display:'flex', gap:8 }}>
                <button className="btn btn-primary" onClick={() => {
                  try {
                    const ok = verifyReset(resetTarget, pin);
                    if (!ok) { alert('Invalid or expired PIN'); return; }
                    setPassword(resetTarget, newPassword);
                    alert('Password reset. Please login.');
                    setShowReset(false);
                  } catch (err) { alert('Failed to reset password'); }
                }}>Verify & Reset</button>
                <button className="btn" onClick={() => setShowReset(false)}>Cancel</button>
              </div>
            </>
          )}
        </div>
      )}
    </AuthLayout>
  );
}
