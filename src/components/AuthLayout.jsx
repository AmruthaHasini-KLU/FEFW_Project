import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function AuthLayout({ title, children }) {
  const { pathname } = useLocation();
  const isLogin = pathname.includes('/login');

  return (
    <section className="auth-wrapper">
      <div className="auth-page">
        <div className="auth-tabs">
          <Link className={`auth-tab ${isLogin ? 'active' : ''}`} to="/login">Login</Link>
          <Link className={`auth-tab ${!isLogin ? 'active' : ''}`} to="/signup">Signup</Link>
        </div>
        <h2 style={{ marginTop: 8 }}>{title}</h2>
        <div className="auth-card">
          {children}
        </div>
      </div>
    </section>
  );
}
