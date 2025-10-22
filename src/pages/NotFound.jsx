import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{ padding: 40 }}>
      <h2>404 — Not Found</h2>
      <p>The page you requested does not exist.</p>
      <Link to="/">Return home</Link>
    </div>
  );
}
