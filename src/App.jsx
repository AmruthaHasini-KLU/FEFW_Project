import React from 'react';
import { Link } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <div className="home-bg">
      <header className="home-nav">
        <span className="home-brand">Fynvia</span>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/features">Features</Link>
          <Link to="/how-it-works">How It Works</Link>
          <Link to="/support">Support</Link>
        </nav>
        <div className="nav-block">
          <span className="nav-lang">EN ▼</span>
          <Link to="/login" className="nav-login">Login</Link>
          <Link to="/signup" className="nav-signup">Signup</Link>
        </div>
      </header>
      <main className="home-main">
        <h1 className="main-title">
          Get Your Loan Faster. With Complete Transparency.
        </h1>
        <p className="main-desc">
          Fynvia simplifies every step—from application to repayment—so you're always in control.
        </p>
        <div className="main-actions">
          <Link to="/signup" className="btn-primary">Signup Now</Link>
          <Link to="/how-it-works" className="btn-outline">Learn How It Works</Link>
        </div>
      </main>
      <footer className="home-footer">
        &copy; {new Date().getFullYear()} Fynvia. All rights reserved.
      </footer>
    </div>
  );
}

export default App;